import React, { useRef, useState, useEffect } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { AppId } from '../types';

interface WindowProps {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  isOpen,
  isMinimized,
  zIndex,
  position,
  size,
  onClose,
  onMinimize,
  onFocus,
  onMove,
  children,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);

  // Initial center on mount if 0,0
  useEffect(() => {
    if (position.x === 0 && position.y === 0 && window.innerWidth > 0) {
       const centerX = (window.innerWidth - size.width) / 2;
       const centerY = (window.innerHeight - size.height) / 2;
       // Add a slight random offset to prevent perfect stacking
       const offset = Math.random() * 30;
       onMove(id, Math.max(0, centerX + offset), Math.max(40, centerY + offset));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag from header
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    onFocus(id);
    if (isMaximized) return;

    setIsDragging(true);
    const rect = windowRef.current!.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onMove(id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, id, onMove]);

  if (!isOpen || isMinimized) return null;

  const currentSize = isMaximized ? { width: '100%', height: 'calc(100vh - 2rem - 5rem)' } : { width: size.width, height: size.height };
  const currentPos = isMaximized ? { top: 32, left: 0 } : { top: position.y, left: position.x };
  const transform = isMaximized ? 'none' : undefined;

  return (
    <div
      ref={windowRef}
      className={`absolute rounded-xl shadow-2xl overflow-hidden flex flex-col bg-white border border-gray-200 transition-shadow duration-200 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        top: currentPos.top,
        left: currentPos.left,
        transform: transform,
        zIndex: zIndex,
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 4rem)'
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Title Bar */}
      <div 
        className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 justify-between select-none cursor-default"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2 window-controls">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(id); }} 
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"
          >
            <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(id); }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"
          >
             <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized); }}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group"
          >
             <Maximize2 size={8} className="text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="text-xs font-semibold text-gray-600">{title}</div>
        <div className="w-14"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white relative">
        {children}
      </div>
    </div>
  );
};