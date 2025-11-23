import React from 'react';

export const PhotosApp: React.FC = () => {
    return (
        <div className="flex flex-col h-full bg-white select-none">
            <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50/80 backdrop-blur">
                <div className="flex space-x-4 text-sm font-medium text-gray-600">
                    <span className="text-black bg-gray-200 px-3 py-1 rounded-md">Library</span>
                    <span className="hover:bg-gray-200 px-3 py-1 rounded-md cursor-pointer">For You</span>
                    <span className="hover:bg-gray-200 px-3 py-1 rounded-md cursor-pointer">Albums</span>
                </div>
                <div className="text-xs text-gray-500">2,431 Photos, 128 Videos</div>
            </div>
            <div className="flex-1 overflow-y-auto p-1 bg-white">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 overflow-hidden relative group cursor-pointer">
                            <img 
                                src={`https://picsum.photos/300/300?random=${i + 10}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                loading="lazy"
                                alt="" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};