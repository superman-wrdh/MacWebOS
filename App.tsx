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
import { Lock } from 'lucide-react';

export default function App() {
  const [wallpaper, setWallpaper] = useState<string>(DEFAULT_WALLPAPER);
  const [isLocked, setIsLocked] = useState(false);
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
      if (action === 'lock') setIsLocked(true);
      if (action === 'settings') openApp(AppId.SETTINGS);
      if (action === 'about') openApp(AppId.ABOUT);
  };

  // Render App Content based on ID
  const renderAppContent = (id: AppId) => {
      switch (id) {
          case AppId.SETTINGS: return <SettingsApp onWallpaperChange={handleWallpaperChange} currentWallpaper={wallpaper} />;
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
            className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center text-white"
            style={{ backgroundImage: `url(${wallpaper})` }}
          >
              <div className="backdrop-blur-md bg-black/20 p-8 rounded-2xl flex flex-col items-center space-y-4 shadow-2xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-2 border-white/50">
                     <img src="https://ui-avatars.com/api/?name=User&background=random&size=128" alt="User" />
                  </div>
                  <div className="text-xl font-semibold">Admin</div>
                  <div className="flex space-x-2">
                      <input 
                        type="password" 
                        placeholder="Enter Password" 
                        className="bg-white/20 border border-white/30 rounded-full px-4 py-1 text-sm placeholder-gray-300 focus:outline-none focus:bg-white/30 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && setIsLocked(false)}
                      />
                      <button onClick={() => setIsLocked(false)} className="bg-white/20 rounded-full p-1.5 hover:bg-white/40">
                          <Lock size={16} />
                      </button>
                  </div>
                  <div className="text-xs opacity-70 mt-4 cursor-pointer hover:underline">Switch User</div>
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