import React, { useRef } from 'react';
import { Image, Monitor, Lock, Wifi, Bluetooth, Volume2 } from 'lucide-react';

interface SettingsProps {
  onWallpaperChange: (url: string) => void;
  currentWallpaper: string;
}

export const SettingsApp: React.FC<SettingsProps> = ({ onWallpaperChange, currentWallpaper }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onWallpaperChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const wallpapers = [
     "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070",
     "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070",
     "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070",
     "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964",
  ];

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-48 bg-gray-200/50 h-full border-r border-gray-300 pt-4 px-2 space-y-1">
        <div className="flex items-center space-x-2 px-3 py-1">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold">Admin</span>
                <span className="text-xs text-gray-500">Apple ID</span>
            </div>
        </div>
        
        <div className="mt-4"></div>
        
        <SidebarItem icon={<Wifi size={16} />} label="Wi-Fi" active={false} />
        <SidebarItem icon={<Bluetooth size={16} />} label="Bluetooth" active={false} />
        <SidebarItem icon={<Monitor size={16} />} label="Wallpaper" active={true} />
        <SidebarItem icon={<Lock size={16} />} label="Lock Screen" active={false} />
        <SidebarItem icon={<Volume2 size={16} />} label="Sound" active={false} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Wallpaper</h2>
        
        <div className="mb-8">
            <div className="w-full h-48 rounded-xl overflow-hidden shadow-md mb-4 relative group">
                <img src={currentWallpaper} alt="Current" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 text-white text-shadow-md font-medium">Current Desktop</div>
            </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Local Images</h3>
        <div className="flex items-center space-x-4 mb-8">
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-28 h-20 bg-white border border-dashed border-gray-400 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
            >
                <Image size={24} className="mb-1" />
                <span className="text-xs">Upload</span>
            </button>
        </div>

        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Default Collections</h3>
        <div className="grid grid-cols-2 gap-4">
            {wallpapers.map((wp, idx) => (
                <button key={idx} onClick={() => onWallpaperChange(wp)} className="relative group rounded-lg overflow-hidden h-24 shadow-sm hover:ring-2 hover:ring-blue-500 focus:outline-none">
                    <img src={wp} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active }: { icon: React.ReactNode, label: string, active: boolean }) => (
    <button className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm transition-colors ${active ? 'bg-blue-500 text-white' : 'hover:bg-gray-300/50 text-gray-700'}`}>
        <span className={active ? 'text-white' : 'text-blue-500'}>{icon}</span>
        <span>{label}</span>
    </button>
);