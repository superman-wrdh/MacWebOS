import React from 'react';
import { Search, PenLine, Trash2 } from 'lucide-react';

export const NotesApp: React.FC = () => {
    return (
        <div className="flex h-full bg-white select-none">
            {/* Folder Sidebar */}
            <div className="w-48 bg-gray-50/90 border-r border-gray-200 flex flex-col pt-2">
                <div className="px-3 mb-2 flex items-center space-x-2 text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-3 font-bold text-gray-500 text-xs uppercase tracking-wider">iCloud</div>
                <div className="flex-1 space-y-0.5">
                    <div className="px-4 py-2 bg-yellow-400/20 text-yellow-900 font-medium flex justify-between items-center cursor-pointer">
                        <span>Notes</span>
                        <span className="text-xs opacity-60">2</span>
                    </div>
                    <div className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
                        <span>Personal</span>
                        <span className="text-xs opacity-60">5</span>
                    </div>
                    <div className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
                        <span>Work</span>
                        <span className="text-xs opacity-60">8</span>
                    </div>
                    <div className="mt-4 p-3 font-bold text-gray-500 text-xs uppercase tracking-wider">On My Mac</div>
                    <div className="px-4 py-2 text-gray-600 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
                        <span>Recently Deleted</span>
                    </div>
                </div>
            </div>

            {/* Notes List */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                 <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-2 top-2 text-gray-400" />
                        <input type="text" placeholder="Search" className="w-full bg-gray-100 rounded-md py-1 pl-7 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50" />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto">
                     <NoteListItem 
                        title="Grocery List" 
                        preview="Milk, Eggs, Bread, Coffee, Avocados, Chocolate..." 
                        date="10:42 AM" 
                        active 
                     />
                     <NoteListItem 
                        title="Meeting Notes" 
                        preview="Discuss Q3 roadmap, marketing budget approval and..." 
                        date="Yesterday" 
                     />
                     <NoteListItem 
                        title="Book Ideas" 
                        preview="Sci-fi novel about AI taking over web development..." 
                        date="Monday" 
                     />
                     <NoteListItem 
                        title="React Components" 
                        preview="Remember to use fragments when returning multiple..." 
                        date="Last Week" 
                     />
                 </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1 bg-white flex flex-col">
                <div className="h-12 flex items-center justify-between px-6 border-b border-transparent">
                     <span className="text-xs text-gray-400">Last edited today at 10:42 AM</span>
                     <div className="flex space-x-4 text-gray-500">
                         <Trash2 size={18} className="hover:text-red-500 cursor-pointer" />
                         <PenLine size={18} className="hover:text-yellow-600 cursor-pointer" />
                     </div>
                </div>
                <div className="p-8 flex-1 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 outline-none" contentEditable>Grocery List</h1>
                    <div className="space-y-3 text-gray-700 text-lg">
                        <div className="flex items-center space-x-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-yellow-400 cursor-pointer"></div>
                            <span contentEditable>Milk</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-yellow-400 cursor-pointer"></div>
                            <span contentEditable>Eggs (Free range)</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-yellow-400 cursor-pointer"></div>
                            <span contentEditable>Sourdough Bread</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-yellow-400 cursor-pointer"></div>
                            <span contentEditable>Coffee Beans</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                             <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-yellow-400 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-white rounded-full"></div>
                             </div>
                             <span className="line-through text-gray-400" contentEditable>Avocados</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoteListItem = ({ title, preview, date, active }: { title: string, preview: string, date: string, active?: boolean }) => (
    <div className={`p-4 border-b border-gray-100 cursor-pointer ${active ? 'bg-yellow-100/50' : 'hover:bg-gray-50'}`}>
        <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
        <div className="flex space-x-2 mt-1">
             <span className="text-sm text-gray-500 whitespace-nowrap">{date}</span>
             <p className="text-sm text-gray-400 truncate">{preview}</p>
        </div>
    </div>
);