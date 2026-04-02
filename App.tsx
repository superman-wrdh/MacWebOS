import React, { useState, useEffect, useRef } from 'react';
import { MenuBar } from './components/MenuBar';
import { Dock } from './components/Dock';
import { Window } from './components/Window';
import { Launchpad } from './components/Launchpad';
import { AppId, WindowState } from './types';
import { APP_CONFIGS, DEFAULT_WALLPAPER } from './constants';
import { SettingsApp } from './apps/Settings';
import { BrowserApp } from './apps/Browser';
import { FinderApp } from './apps/Finder';
import { PhotosApp } from './apps/Photos';
import { CalendarApp } from './apps/Calendar';
import { NotesApp } from './apps/Notes';
import { AboutApp } from './apps/About';
import { Live2DGuideApp } from './apps/Live2DGuide';
import { Live2DSettingsApp } from './apps/Live2DSettings';
import { VoiceAssistantApp } from './apps/VoiceAssistant';
import { Live2D } from './components/Live2D';
import { Lock, ArrowRight, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  isDone?: boolean;
}

export default function App() {
  const [wallpaper, setWallpaper] = useState<string>(DEFAULT_WALLPAPER);
  const [password, setPassword] = useState<string>(() => localStorage.getItem('mac-password') || 'admin');
  const [isLocked, setIsLocked] = useState(false); // Start unlocked for better dev experience, or true for realism
  const [loginInput, setLoginInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);

  // Voice Assistant State
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([]);
  const [showVoiceText, setShowVoiceText] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [voiceMessages]);

  useEffect(() => {
    const handleConfig = (e: any) => {
      setShowVoiceText(e.detail.showText);
    };
    const handleMessage = (e: any) => {
      const { role, text } = e.detail;
      setVoiceMessages(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), role, text, isDone: true }]);
    };
    const handleDelta = (e: any) => {
      const { role, text } = e.detail;
      setVoiceMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === role && !last.isDone) {
          return [...prev.slice(0, -1), { ...last, text: last.text + text }];
        }
        return [...prev, { id: Math.random().toString(36).substr(2, 9), role, text, isDone: false }];
      });
    };
    const handleDone = (e: any) => {
      const { role, text } = e.detail;
      setVoiceMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === role) {
          return [...prev.slice(0, -1), { ...last, text, isDone: true }];
        }
        return [...prev, { id: Math.random().toString(36).substr(2, 9), role, text, isDone: true }];
      });
    };
    const handleDisconnect = () => {
      setIsVoiceConnected(false);
      setVoiceMessages([]);
    };

    window.addEventListener('voice-assistant-config', handleConfig);
    window.addEventListener('voice-assistant-message', handleMessage);
    window.addEventListener('voice-assistant-delta', handleDelta);
    window.addEventListener('voice-assistant-message-done', handleDone);
    window.addEventListener('voice-assistant-disconnected', handleDisconnect);

    return () => {
      window.removeEventListener('voice-assistant-config', handleConfig);
      window.removeEventListener('voice-assistant-message', handleMessage);
      window.removeEventListener('voice-assistant-delta', handleDelta);
      window.removeEventListener('voice-assistant-message-done', handleDone);
      window.removeEventListener('voice-assistant-disconnected', handleDisconnect);
    };
  }, []);

  const handleVoiceConnected = (connected: boolean) => {
    setIsVoiceConnected(connected);
    if (connected) {
      // Hide window after connection
      closeWindow(AppId.VOICE_ASSISTANT);
    }
  };

  // Load wallpaper from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('mac-wallpaper');
    if (saved) setWallpaper(saved);
  }, []);

  const handleWallpaperChange = (url: string) => {
    setWallpaper(url);
    localStorage.setItem('mac-wallpaper', url);
  };

  const handleChangePassword = (oldPw: string, newPw: string): boolean => {
      if (oldPw === password) {
          setPassword(newPw);
          localStorage.setItem('mac-password', newPw);
          return true;
      }
      return false;
  };

  const handleLogin = () => {
      if (loginInput === password) {
          setIsLocked(false);
          setLoginInput('');
          setLoginError(false);
      } else {
          setLoginError(true);
          setTimeout(() => setLoginError(false), 500); // Reset error state for animation
      }
  };

  const openApp = (id: AppId) => {
    if (id === AppId.LAUNCHPAD) {
        setIsLaunchpadOpen(!isLaunchpadOpen);
        return;
    }
    
    // Close launchpad if opening an app
    if (isLaunchpadOpen) setIsLaunchpadOpen(false);

    // If app is Trash, maybe open a Finder window for Trash? (Simplification: Just Finder for now)
    if (id === AppId.TRASH) {
        // Implement Trash logic if needed, for now just ignore or alert
        alert("Trash is empty!");
        return;
    }

    const existingWindow = windows.find(w => w.id === id);

    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
        setNextZIndex(prev => prev + 1);
        setActiveWindowId(id);
      } else {
        // Bring to front
        focusWindow(id);
      }
    } else {
      // Create new window
      const config = APP_CONFIGS[id];
      
      let width = config.defaultWidth || 600;
      let height = config.defaultHeight || 400;

      // Special case for Live2D Settings: 70% of screen
      if (id === AppId.LIVE2D_SETTINGS) {
        width = Math.round(window.innerWidth * 0.7);
        height = Math.round(window.innerHeight * 0.7);
      }

      const newWindow: WindowState = {
        id,
        title: config.name,
        isOpen: true,
        isMinimized: false,
        zIndex: nextZIndex,
        position: { x: 0, y: 0 }, // Will be centered by Window component
        size: { width, height }
      };
      setWindows(prev => [...prev, newWindow]);
      setNextZIndex(prev => prev + 1);
      setActiveWindowId(id);
    }
  };

  const closeWindow = (id: AppId) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  };

  const focusWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setNextZIndex(prev => prev + 1);
    setActiveWindowId(id);
  };

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  const handleAppleMenu = (action: string) => {
      if (action === 'lock') {
          setIsLocked(true);
          setLoginInput('');
      }
      if (action === 'settings') openApp(AppId.SETTINGS);
      if (action === 'about') openApp(AppId.ABOUT);
  };

  // Render App Content based on ID
  const renderAppContent = (id: AppId) => {
      switch (id) {
          case AppId.SETTINGS: 
            return <SettingsApp 
                onWallpaperChange={handleWallpaperChange} 
                currentWallpaper={wallpaper} 
                onChangePassword={handleChangePassword}
            />;
          case AppId.CHROME: return <BrowserApp />;
          case AppId.FINDER: return <FinderApp />;
          case AppId.PHOTOS: return <PhotosApp />;
          case AppId.CALENDAR: return <CalendarApp />;
          case AppId.NOTES: return <NotesApp />;
          case AppId.ABOUT: return <AboutApp />;
          case AppId.LIVE2D_GUIDE: return <Live2DGuideApp />;
          case AppId.LIVE2D_SETTINGS: return <Live2DSettingsApp />;
          case AppId.VOICE_ASSISTANT: return <VoiceAssistantApp onConnected={handleVoiceConnected} />;
          case AppId.APPSTORE: return <div className="flex items-center justify-center h-full text-gray-400">App Store Unavailable</div>;
          default: return <div className="p-4">Content for {id}</div>;
      }
  };

  if (isLocked) {
      return (
          <div 
            className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-white transition-all duration-500"
            style={{ backgroundImage: `url(${wallpaper})` }}
          >
              <div className="backdrop-blur-xl bg-black/30 p-10 rounded-2xl flex flex-col items-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-white/20 shadow-inner">
                     <img src="https://ui-avatars.com/api/?name=Admin&background=random&size=128" alt="User" />
                  </div>
                  <div className="text-2xl font-semibold tracking-wide text-shadow">Admin</div>
                  <div className="flex flex-col items-center space-y-2 w-full">
                      <div className="flex relative w-full">
                        <input 
                            type="password" 
                            placeholder="Enter Password" 
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            className={`w-full bg-white/20 border ${loginError ? 'border-red-400 animate-shake' : 'border-white/30'} rounded-full px-4 py-2 text-sm placeholder-gray-300 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all pr-10`}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            autoFocus
                        />
                        <button 
                            onClick={handleLogin} 
                            className="absolute right-1 top-1 bottom-1 w-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                        >
                            <ArrowRight size={16} />
                        </button>
                      </div>
                      {loginError && <span className="text-xs text-red-200 font-medium animate-pulse">Incorrect password</span>}
                  </div>
                  <div className="text-xs opacity-70 mt-4 cursor-pointer hover:underline hover:opacity-100 transition-opacity">
                      Switch User
                  </div>
              </div>
              <div className="absolute bottom-10 flex flex-col items-center space-y-2 opacity-80">
                  <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Lock size={14} /></div>
                      <span className="text-sm font-medium">Sleep</span>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center overflow-hidden relative"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <MenuBar onAppleMenuSelect={handleAppleMenu} activeApp={activeWindowId || 'Finder'} />
      
      {/* Desktop Area - Click to clear focus could go here */}
      <div className="absolute inset-0 top-8 bottom-20" onClick={() => setActiveWindowId(null)}>
        {/* Desktop Icons */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-4 p-4 z-0">
          <div 
            className="flex flex-col items-center gap-1 w-20 cursor-pointer group"
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(AppId.LIVE2D_GUIDE);
            }}
          >
            <div className="w-14 h-14 rounded-xl shadow-sm overflow-hidden transition-transform group-hover:scale-105 group-active:scale-95 group-active:brightness-90">
              {APP_CONFIGS[AppId.LIVE2D_GUIDE].icon}
            </div>
            <span className="text-white text-xs font-medium text-center drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {APP_CONFIGS[AppId.LIVE2D_GUIDE].name}
            </span>
          </div>

          <div 
            className="flex flex-col items-center gap-1 w-20 cursor-pointer group"
            onDoubleClick={(e) => {
              e.stopPropagation();
              openApp(AppId.LIVE2D_SETTINGS);
            }}
          >
            <div className="w-14 h-14 rounded-xl shadow-sm overflow-hidden transition-transform group-hover:scale-105 group-active:scale-95 group-active:brightness-90">
              {APP_CONFIGS[AppId.LIVE2D_SETTINGS].icon}
            </div>
            <span className="text-white text-xs font-medium text-center drop-shadow-md bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {APP_CONFIGS[AppId.LIVE2D_SETTINGS].name}
            </span>
          </div>
        </div>

        {/* Live2D Model */}
        <Live2D />

        {/* Voice Assistant Conversation Box */}
        <AnimatePresence>
          {isVoiceConnected && showVoiceText && voiceMessages.length > 0 && (
            <motion.div
              drag
              dragMomentum={false}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="absolute right-8 top-20 w-80 max-h-[60vh] bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col z-50"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">实时对话</span>
                </div>
                <div className="w-8 h-1 bg-white/20 rounded-full cursor-grab active:cursor-grabbing" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {voiceMessages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[90%] px-4 py-2 rounded-2xl text-sm ${
                        msg.role === 'user' 
                          ? 'bg-purple-600/80 text-white rounded-tr-none' 
                          : 'bg-white/10 text-white/90 rounded-tl-none'
                      } ${i === voiceMessages.length - 1 ? 'ring-2 ring-purple-400/50 shadow-lg shadow-purple-500/20' : ''}`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Assistant Mic Icon */}
        <AnimatePresence>
          {isVoiceConnected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openApp(AppId.VOICE_ASSISTANT)}
              className="absolute bottom-24 right-8 w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-500/40 cursor-pointer z-50 group"
            >
              <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
              <Mic size={24} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows */}
        {windows.map(win => (
            <Window
                key={win.id}
                {...win}
                onClose={closeWindow}
                onMinimize={minimizeWindow}
                onFocus={focusWindow}
                onMove={moveWindow}
            >
                {renderAppContent(win.id)}
            </Window>
        ))}
      </div>

      <Dock onAppClick={openApp} openApps={windows.map(w => w.id)} />
      
      <Launchpad 
        isOpen={isLaunchpadOpen} 
        onClose={() => setIsLaunchpadOpen(false)} 
        onAppClick={(id) => { openApp(id); setIsLaunchpadOpen(false); }} 
      />
    </div>
  );
}