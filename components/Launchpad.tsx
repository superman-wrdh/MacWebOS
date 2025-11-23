import React from 'react';
import { AppId } from '../types';
import { APP_CONFIGS } from '../constants';
import { Search } from 'lucide-react';

interface LaunchpadProps {
    isOpen: boolean;
    onClose: () => void;
    onAppClick: (id: AppId) => void;
}

export const Launchpad: React.FC<LaunchpadProps> = ({ isOpen, onClose, onAppClick }) => {
    if (!isOpen) return null;

    // Filter out Launchpad itself, About app, and Trash from the grid
    const apps = Object.values(APP_CONFIGS).filter(app => 
        app.id !== AppId.LAUNCHPAD && 
        app.id !== AppId.ABOUT && 
        app.id !== AppId.TRASH
    );

    return (
        <div 
            className="fixed inset-0 z-[60] overflow-hidden flex flex-col items-center"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.4)' }}
            onClick={onClose}
        >
            <div className="mt-12 w-80 relative" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full bg-gray-500/30 text-white placeholder-gray-300 rounded-lg py-1.5 pl-10 pr-4 border border-gray-500/50 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
            </div>

            <div className="flex-1 w-full max-w-5xl p-10 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-y-12 gap-x-8 content-start mt-8">
                {apps.map((app) => (
                    <div 
                        key={app.id} 
                        className="flex flex-col items-center space-y-3 group cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); onAppClick(app.id); }}
                    >
                        <div className="w-20 h-20 rounded-[1.5rem] shadow-xl transition-transform duration-200 group-hover:scale-110">
                            {app.icon}
                        </div>
                        <span className="text-white font-medium text-sm tracking-wide text-shadow-sm text-center whitespace-nowrap">{app.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};