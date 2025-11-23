import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export const CalendarApp: React.FC = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    return (
        <div className="flex h-full bg-white select-none">
            {/* Sidebar (Month view small) */}
            <div className="hidden md:flex w-56 bg-gray-50 border-r border-gray-200 pt-4 flex-col items-center">
                 <div className="w-full px-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">June 2024</span>
                        <div className="flex space-x-2 text-gray-500">
                             <ChevronLeft size={14} />
                             <ChevronRight size={14} />
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 text-[10px] text-center text-gray-500">
                        {['S','M','T','W','T','F','S'].map(d => <span key={d}>{d}</span>)}
                        {Array.from({length: 30}).map((_, i) => (
                            <span key={i} className={`h-5 w-5 flex items-center justify-center rounded-full ${i === 23 ? 'bg-red-500 text-white' : 'hover:bg-gray-200'}`}>
                                {i + 1}
                            </span>
                        ))}
                    </div>
                 </div>
                 
                 <div className="w-full border-t border-gray-200 p-4 space-y-2">
                     <div className="flex items-center space-x-2 text-sm">
                         <input type="checkbox" checked readOnly className="rounded text-blue-500" />
                         <span className="text-gray-700">Work</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm">
                         <input type="checkbox" checked readOnly className="rounded text-green-500" />
                         <span className="text-gray-700">Home</span>
                     </div>
                 </div>
            </div>

            {/* Main Calendar */}
            <div className="flex-1 flex flex-col">
                <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
                    <div className="flex items-center space-x-4">
                         <h2 className="text-xl font-bold text-gray-800">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                         <div className="flex space-x-1">
                             <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} className="text-gray-500" /></button>
                             <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} className="text-gray-500" /></button>
                         </div>
                    </div>
                    <div className="flex space-x-2">
                        <div className="bg-gray-100 rounded-md p-1 flex text-sm font-medium text-gray-600">
                            <button className="px-3 py-0.5 rounded shadow-sm bg-white text-black">Day</button>
                            <button className="px-3 py-0.5 hover:bg-gray-200 rounded">Week</button>
                            <button className="px-3 py-0.5 hover:bg-gray-200 rounded">Month</button>
                            <button className="px-3 py-0.5 hover:bg-gray-200 rounded">Year</button>
                        </div>
                        <button className="p-1.5 hover:bg-gray-100 rounded"><Search size={18} className="text-gray-500" /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {days.map(d => <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500">{d}</div>)}
                </div>
                <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white overflow-y-auto">
                    {Array.from({length: 35}).map((_, i) => (
                        <div key={i} className="border-b border-r border-gray-100 p-2 relative min-h-[100px] hover:bg-gray-50 transition-colors">
                            <span className={`text-sm font-medium ${i === 23 ? 'bg-red-500 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
                                {i + 1 > 30 ? i - 29 : i + 1}
                            </span>
                            {i === 23 && (
                                <div className="mt-2 text-xs border-l-2 border-blue-500 bg-blue-50 text-blue-700 pl-1 py-0.5 truncate rounded-r">
                                    Project Demo
                                    <div className="text-[10px] opacity-75">10:00 AM</div>
                                </div>
                            )}
                             {i === 25 && (
                                <div className="mt-2 text-xs border-l-2 border-green-500 bg-green-50 text-green-700 pl-1 py-0.5 truncate rounded-r">
                                    Dentist
                                    <div className="text-[10px] opacity-75">2:30 PM</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};