import React from 'react';
import { Folder, Image as ImageIcon, FileText, HardDrive, Download, Clock, Cloud, Monitor } from 'lucide-react';

export const FinderApp: React.FC = () => {
  return (
    <div className="flex h-full bg-white text-gray-700 text-sm font-medium select-none">
      {/* Sidebar */}
      <div className="w-48 bg-gray-100/90 backdrop-blur border-r border-gray-200 p-3 space-y-4 pt-4">
        <div>
            <div className="text-[11px] font-bold text-gray-400 mb-1 px-2">Favorites</div>
            <SidebarLink icon={<Clock size={15} className="text-blue-500" />} label="Recents" />
            <SidebarLink icon={<Monitor size={15} className="text-blue-500" />} label="Desktop" active />
            <SidebarLink icon={<FileText size={15} className="text-blue-500" />} label="Documents" />
            <SidebarLink icon={<Download size={15} className="text-blue-500" />} label="Downloads" />
        </div>
        <div>
            <div className="text-[11px] font-bold text-gray-400 mb-1 px-2">Locations</div>
            <SidebarLink icon={<HardDrive size={15} className="text-gray-500" />} label="Macintosh HD" />
            <SidebarLink icon={<Cloud size={15} className="text-gray-500" />} label="iCloud Drive" />
        </div>
        <div>
            <div className="text-[11px] font-bold text-gray-400 mb-1 px-2">Tags</div>
            <SidebarLink icon={<div className="w-3 h-3 rounded-full bg-red-500" />} label="Red" />
            <SidebarLink icon={<div className="w-3 h-3 rounded-full bg-orange-500" />} label="Orange" />
            <SidebarLink icon={<div className="w-3 h-3 rounded-full bg-yellow-500" />} label="Yellow" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
          {/* Path Bar */}
          <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-2 text-gray-500 bg-white/50 backdrop-blur-sm">
              <div className="flex space-x-2 mr-4 text-gray-400">
                  <span className="hover:bg-gray-200 p-1 rounded cursor-pointer">&lt;</span>
                  <span className="hover:bg-gray-200 p-1 rounded cursor-pointer">&gt;</span>
              </div>
              <span className="font-semibold text-gray-700">Desktop</span>
          </div>
          
          {/* Files Grid */}
          <div className="flex-1 p-4 grid grid-cols-4 md:grid-cols-5 gap-2 content-start overflow-y-auto">
              <FileIcon name="Project_Final.pdf" type="pdf" />
              <FileIcon name="Screenshot 2024..." type="img" />
              <FileIcon name="Notes.txt" type="txt" />
              <FileIcon name="Portfolio" type="folder" />
              <FileIcon name="Budget.xlsx" type="xls" />
              <FileIcon name="Vacation 2023" type="folder" />
              <FileIcon name="Resume.docx" type="doc" />
          </div>
          
          {/* Footer status bar */}
          <div className="h-6 border-t border-gray-200 bg-gray-50 flex items-center px-4 text-[10px] text-gray-500">
              7 items, 450 GB available
          </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className={`flex items-center space-x-2 px-2 py-1 rounded-[6px] cursor-pointer transition-colors ${active ? 'bg-gray-300/60' : 'hover:bg-gray-200/60'}`}>
        {icon}
        <span className="text-sm">{label}</span>
    </div>
);

const FileIcon = ({ name, type }: { name: string, type: string }) => {
    let icon = <FileText size={48} strokeWidth={1} />;
    
    if (type === 'folder') { icon = <Folder size={48} fill="#60a5fa" className="text-blue-400" strokeWidth={1} />; }
    else if (type === 'img') { icon = <ImageIcon size={48} className="text-purple-400" strokeWidth={1} />; }
    
    return (
        <div className="flex flex-col items-center p-2 hover:bg-gray-100 rounded border border-transparent hover:border-gray-200 cursor-pointer active:bg-blue-100 active:border-blue-300">
            <div className="mb-1 drop-shadow-sm">{icon}</div>
            <span className="text-[11px] font-medium text-center break-all leading-tight px-1 rounded hover:text-white hover:bg-blue-500 w-full truncate">{name}</span>
        </div>
    );
};