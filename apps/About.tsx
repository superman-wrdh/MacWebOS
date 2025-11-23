import React from 'react';
import { Cpu, MemoryStick } from 'lucide-react';

export const AboutApp: React.FC = () => {
  return (
    <div className="flex flex-col items-center h-full bg-[#f5f5f7] select-none text-center p-6 text-gray-800">
        <div className="mb-6 relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-black rounded-full shadow-xl flex items-center justify-center text-white relative overflow-hidden ring-4 ring-gray-200">
                <span className="font-bold text-3xl z-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">M5</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
            </div>
        </div>
        
        <h1 className="text-xl font-bold mb-1">MacWeb OS</h1>
        <p className="text-sm text-gray-500 font-medium mb-6">Version 1.0.0</p>
        
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-[13px] space-y-3 mb-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-semibold text-gray-500">Model</span>
                <span className="font-medium">MacBook Pro (16-inch, 2025)</span>
            </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-semibold text-gray-500">Chip</span>
                <div className="flex items-center space-x-1.5">
                    <Cpu size={14} className="text-gray-400" />
                    <span className="font-medium">Apple M5</span>
                </div>
            </div>
             <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="font-semibold text-gray-500">Memory</span>
                <div className="flex items-center space-x-1.5">
                    <MemoryStick size={14} className="text-gray-400" />
                    <span className="font-medium">32 GB</span>
                </div>
            </div>
             <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-500">Startup Disk</span>
                <span className="font-medium">Macintosh HD</span>
            </div>
        </div>
        
        <div className="flex gap-3">
             <button className="px-4 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-xs font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors">More Info...</button>
             <button className="px-4 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-xs font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors">Storage...</button>
        </div>
        
        <div className="mt-auto pt-4 text-[10px] text-gray-400">
            &copy; 2025 MacWeb OS Project. All rights reserved.
        </div>
    </div>
  );
};