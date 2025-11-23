import React, { useState, useEffect } from 'react';
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
import { Lock, ArrowRight } from 'lucide-react';

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
      const newWindow: WindowState = {
        id,
        title: config.name,
        isOpen: true,
        isMinimized: false,
        zIndex: nextZIndex,
        position: { x: 0, y: 0 }, // Will be centered by Window component
        size: { width: config.defaultWidth || 600, height: config.defaultHeight || 400 }
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