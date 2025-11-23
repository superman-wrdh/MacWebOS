import React from 'react';
import { 
  AppWindow, 
  Grid, 
  Chrome, 
  Image as ImageIcon, 
  Calendar as CalendarIcon, 
  NotebookPen, 
  ShoppingBag, 
  Settings, 
  Trash2,
  HardDrive,
  Info
} from 'lucide-react';
import { AppId, AppConfig } from './types';

// Default Wallpaper
export const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop";

export const APP_CONFIGS: Record<AppId, AppConfig> = {
  [AppId.FINDER]: {
    id: AppId.FINDER,
    name: 'Finder',
    icon: <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white"><HardDrive size={24} /></div>,
    defaultWidth: 800,
    defaultHeight: 500
  },
  [AppId.LAUNCHPAD]: {
    id: AppId.LAUNCHPAD,
    name: 'Launchpad',
    icon: <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl flex items-center justify-center text-white"><Grid size={24} /></div>,
  },
  [AppId.CHROME]: {
    id: AppId.CHROME,
    name: 'Google Chrome',
    icon: <div className="w-full h-full bg-white rounded-xl flex items-center justify-center shadow-sm"><Chrome size={28} className="text-red-500" /><span className="absolute text-yellow-500 opacity-50 ml-1 mt-1"><Chrome size={28}/></span><span className="absolute text-green-500 opacity-50 -ml-1 -mt-1"><Chrome size={28}/></span></div>, // Mock colorful icon
    defaultWidth: 900,
    defaultHeight: 600
  },
  [AppId.PHOTOS]: {
    id: AppId.PHOTOS,
    name: 'Photos',
    icon: <div className="w-full h-full bg-white rounded-xl flex items-center justify-center overflow-hidden"><img src="https://picsum.photos/60/60?random=1" className="w-full h-full object-cover" alt="Photos" /></div>,
    defaultWidth: 700,
    defaultHeight: 500
  },
  [AppId.CALENDAR]: {
    id: AppId.CALENDAR,
    name: 'Calendar',
    icon: <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center overflow-hidden border border-gray-200"><div className="w-full h-1/3 bg-red-500 text-white text-[8px] flex items-center justify-center uppercase font-bold tracking-widest">JUN</div><div className="w-full h-2/3 flex items-center justify-center text-2xl font-light text-gray-800">24</div></div>,
    defaultWidth: 800,
    defaultHeight: 600
  },
  [AppId.NOTES]: {
    id: AppId.NOTES,
    name: 'Notes',
    icon: <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-xl flex items-center justify-center text-gray-700 border border-yellow-400"><NotebookPen size={24} /></div>,
    defaultWidth: 600,
    defaultHeight: 400
  },
  [AppId.APPSTORE]: {
    id: AppId.APPSTORE,
    name: 'App Store',
    icon: <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white p-1"><div className="border-2 border-white rounded-full p-1"><ShoppingBag size={16} /></div></div>,
    defaultWidth: 900,
    defaultHeight: 600
  },
  [AppId.SETTINGS]: {
    id: AppId.SETTINGS,
    name: 'Settings',
    icon: <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center text-gray-600"><Settings size={28} className="animate-spin-slow" style={{animationDuration: '10s'}} /></div>,
    defaultWidth: 600,
    defaultHeight: 450
  },
  [AppId.TRASH]: {
    id: AppId.TRASH,
    name: 'Trash',
    icon: <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 rounded-b-xl rounded-t-sm flex items-center justify-center text-gray-500 border border-gray-300"><Trash2 size={24} /></div>,
  },
  [AppId.ABOUT]: {
    id: AppId.ABOUT,
    name: 'About This Mac',
    icon: <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white"><Info size={24} /></div>,
    defaultWidth: 320,
    defaultHeight: 400
  }
};