import React from 'react';
import { AppId } from '../types';
import { APP_CONFIGS } from '../constants';

interface DockProps {
  onAppClick: (id: AppId) => void;
  openApps: AppId[];
}

export const Dock: React.FC<DockProps> = ({ onAppClick, openApps }) => {
  // Order of apps in dock
  const dockApps = [
    AppId.FINDER,
    AppId.LAUNCHPAD,
    AppId.CHROME,
    AppId.PHOTOS,
    AppId.CALENDAR,
    AppId.NOTES,
    AppId.APPSTORE,
    AppId.SETTINGS,
  ];

  return (
    <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 mb-2">
      <div className="glass-dock px-2 pb-2 pt-2 rounded-2xl flex items-end space-x-1 sm:space-x-3 h-16 sm:h-20 shadow-2xl transition-all duration-300 hover:scale-105">
        {dockApps.map((appId) => (
          <DockIcon 
            key={appId} 
            config={APP_CONFIGS[appId]} 
            isOpen={openApps.includes(appId)}
            onClick={() => onAppClick(appId)} 
          />
        ))}
        
        {/* Divider */}
        <div className="w-[1px] h-10 bg-gray-400/50 mx-2 self-center"></div>
        
        {/* Trash */}
        <DockIcon 
            config={APP_CONFIGS[AppId.TRASH]} 
            isOpen={false}
            onClick={() => onAppClick(AppId.TRASH)} 
        />
      </div>
    </div>
  );
};

const DockIcon: React.FC<{ config: any, isOpen: boolean, onClick: () => void }> = ({ config, isOpen, onClick }) => {
  return (
    <div className="group relative flex flex-col items-center cursor-pointer transition-all duration-200 hover:-translate-y-2" onClick={onClick}>
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl shadow-lg transition-transform active:scale-90 active:brightness-75">
        {config.icon}
      </div>
      <div className={`w-1 h-1 rounded-full bg-black mt-1 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Tooltip */}
      <div className="absolute -top-10 bg-gray-800/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/10">
        {config.name}
      </div>
    </div>
  );
};