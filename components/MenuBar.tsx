import React, { useState, useEffect, useRef } from 'react';
import { Apple, Battery, Wifi, Search } from 'lucide-react';
import { AppId } from '../types';
import { APP_CONFIGS } from '../constants';

interface MenuBarProps {
  onAppleMenuSelect: (action: string) => void;
  activeApp: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ onAppleMenuSelect, activeApp }) => {
  const [date, setDate] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAppleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-8 w-full bg-white/30 backdrop-blur-md text-black flex items-center justify-between px-4 fixed top-0 left-0 z-50 text-sm shadow-sm select-none">
      <div className="flex items-center space-x-4">
        <div className="relative" ref={menuRef}>
          <button 
            className={`hover:bg-white/40 p-1 rounded ${isAppleMenuOpen ? 'bg-white/40' : ''}`}
            onClick={() => setIsAppleMenuOpen(!isAppleMenuOpen)}
          >
            <Apple size={18} fill="black" />
          </button>
          
          {isAppleMenuOpen && (
            <div className="absolute top-8 left-0 w-56 bg-white/90 backdrop-blur-xl rounded-lg shadow-xl border border-gray-200 py-1 flex flex-col z-50">
              <button 
                className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white"
                onClick={() => { onAppleMenuSelect('about'); setIsAppleMenuOpen(false); }}
              >
                About This Mac
              </button>
              <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
              <button 
                className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white"
                onClick={() => { onAppleMenuSelect('settings'); setIsAppleMenuOpen(false); }}
              >
                System Settings...
              </button>
              <button className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white">
                App Store...
              </button>
              <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
              <button className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white">
                Sleep
              </button>
              <button className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white">
                Restart...
              </button>
              <button className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white">
                Shut Down...
              </button>
              <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
              <button 
                className="text-left px-4 py-1 hover:bg-blue-500 hover:text-white"
                onClick={() => { onAppleMenuSelect('lock'); setIsAppleMenuOpen(false); }}
              >
                Lock Screen
              </button>
            </div>
          )}
        </div>
        
        <span className="font-bold hidden sm:block">
          {APP_CONFIGS[activeApp as AppId]?.name || 'Finder'}
        </span>
        
        <div className="hidden md:flex space-x-4 text-sm font-medium opacity-90">
           <span className="cursor-default">File</span>
           <span className="cursor-default">Edit</span>
           <span className="cursor-default">View</span>
           <span className="cursor-default">Go</span>
           <span className="cursor-default">Window</span>
           <span className="cursor-default">Help</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex space-x-3 opacity-80">
            <Battery size={18} />
            <Wifi size={18} />
            <Search size={16} />
        </div>
        <div className="flex items-center space-x-2 font-medium">
          <span>{formatDate(date)}</span>
          <span>{formatTime(date)}</span>
        </div>
      </div>
    </div>
  );
};