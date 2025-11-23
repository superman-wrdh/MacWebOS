import React, { useRef, useState } from 'react';
import { Image, Monitor, Lock, Wifi, Bluetooth, Volume2, Users, User, KeyRound } from 'lucide-react';

interface SettingsProps {
  onWallpaperChange: (url: string) => void;
  currentWallpaper: string;
  onChangePassword: (oldPw: string, newPw: string) => boolean;
}

type Tab = 'wallpaper' | 'users' | 'wifi' | 'bluetooth' | 'sound';

export const SettingsApp: React.FC<SettingsProps> = ({ onWallpaperChange, currentWallpaper, onChangePassword }) => {
  const [activeTab, setActiveTab] = useState<Tab>('wallpaper');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

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

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setMsg({ text: '', type: '' });

      if (newPassword !== confirmPassword) {
          setMsg({ text: "New passwords do not match.", type: 'error' });
          return;
      }

      if (newPassword.length < 1) {
          setMsg({ text: "Password cannot be empty.", type: 'error' });
          return;
      }

      const success = onChangePassword(oldPassword, newPassword);
      if (success) {
          setMsg({ text: "Password changed successfully!", type: 'success' });
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
      } else {
          setMsg({ text: "Incorrect old password.", type: 'error' });
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
      <div className="w-48 bg-gray-200/50 h-full border-r border-gray-300 pt-4 px-2 space-y-1 overflow-y-auto">
        <div className="flex items-center space-x-2 px-3 py-1 mb-4 cursor-default">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-gray-300">
                <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800">Admin</span>
                <span className="text-[10px] text-gray-500">Apple ID</span>
            </div>
        </div>
        
        <div className="border-t border-gray-300/50 my-2"></div>
        
        <SidebarItem 
            icon={<Wifi size={16} />} 
            label="Wi-Fi" 
            active={activeTab === 'wifi'} 
            onClick={() => setActiveTab('wifi')} 
        />
        <SidebarItem 
            icon={<Bluetooth size={16} />} 
            label="Bluetooth" 
            active={activeTab === 'bluetooth'} 
            onClick={() => setActiveTab('bluetooth')} 
        />
        <SidebarItem 
            icon={<Monitor size={16} />} 
            label="Wallpaper" 
            active={activeTab === 'wallpaper'} 
            onClick={() => setActiveTab('wallpaper')} 
        />
        <div className="border-t border-gray-300/50 my-2"></div>
        <SidebarItem 
            icon={<Users size={16} />} 
            label="Users & Groups" 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
        />
        <SidebarItem 
            icon={<Lock size={16} />} 
            label="Lock Screen" 
            active={false} 
        />
        <SidebarItem 
            icon={<Volume2 size={16} />} 
            label="Sound" 
            active={activeTab === 'sound'} 
            onClick={() => setActiveTab('sound')} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-white">
        
        {/* Wallpaper Tab */}
        {activeTab === 'wallpaper' && (
            <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Wallpaper</h2>
                
                <div className="mb-8">
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow-md mb-4 relative group border border-gray-200">
                        <img src={currentWallpaper} alt="Current" className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 left-4 text-white text-shadow-md font-medium bg-black/20 px-2 py-1 rounded backdrop-blur-sm">Current Desktop</div>
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
                        className="flex flex-col items-center justify-center w-28 h-20 bg-gray-50 border border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-500"
                    >
                        <Image size={24} className="mb-1" />
                        <span className="text-xs font-medium">Add Photo</span>
                    </button>
                </div>

                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Collections</h3>
                <div className="grid grid-cols-2 gap-4">
                    {wallpapers.map((wp, idx) => (
                        <button key={idx} onClick={() => onWallpaperChange(wp)} className="relative group rounded-lg overflow-hidden h-28 shadow-sm hover:ring-2 hover:ring-blue-500 focus:outline-none transition-all">
                            <img src={wp} alt={`Wallpaper ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            </>
        )}

        {/* Users & Groups Tab */}
        {activeTab === 'users' && (
            <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Users & Groups</h2>
                
                <div className="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" />
                    </div>
                    <div>
                        <div className="font-bold text-lg text-gray-800">Admin</div>
                        <div className="text-sm text-gray-500">Administrator</div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4 text-gray-700">
                        <KeyRound size={20} />
                        <h3 className="font-semibold">Change Password</h3>
                    </div>
                    
                    <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Old Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow select-text text-gray-900"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                placeholder="Required"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow select-text text-gray-900"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Verify</label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow select-text text-gray-900"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {msg.text && (
                            <div className={`text-xs font-medium px-2 py-1 rounded ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {msg.text}
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <button 
                                type="submit" 
                                className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors shadow-sm"
                            >
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Other Tabs Placeholder */}
        {(activeTab === 'wifi' || activeTab === 'bluetooth' || activeTab === 'sound') && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="mb-2">
                    {activeTab === 'wifi' && <Wifi size={48} />}
                    {activeTab === 'bluetooth' && <Bluetooth size={48} />}
                    {activeTab === 'sound' && <Volume2 size={48} />}
                </span>
                <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</span>
                <span className="text-xs mt-2">Not implemented in this demo</span>
            </div>
        )}

      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-3 py-1.5 rounded-md text-sm transition-colors ${active ? 'bg-blue-500 text-white shadow-sm' : 'hover:bg-gray-300/50 text-gray-700'}`}
    >
        <span className={active ? 'text-white' : 'text-blue-500'}>{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);