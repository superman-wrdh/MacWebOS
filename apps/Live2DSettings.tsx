import React, { useState, useEffect } from 'react';
import { Maximize, Minus, Plus } from 'lucide-react';

export const Live2DSettingsApp: React.FC = () => {
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('live2d-scale');
    return saved ? parseFloat(saved) : 0.3;
  });

  const handleScaleChange = (newScale: number) => {
    const clampedScale = Math.max(0.1, Math.min(3.0, newScale));
    setScale(clampedScale);
    localStorage.setItem('live2d-scale', clampedScale.toString());
    
    // Dispatch custom event to notify Live2D component
    window.dispatchEvent(new CustomEvent('live2d-scale-change', { detail: clampedScale }));
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-white/80 backdrop-blur-md h-full">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="p-2 bg-indigo-500 rounded-lg text-white">
          <Maximize size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">模型缩放设置</h2>
          <p className="text-xs text-gray-500">调整 Live2D 模型在桌面上的显示大小</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">当前比例</span>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {Math.round(scale * 500)}%
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleScaleChange(scale - 0.05)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 border border-gray-200"
          >
            <Minus size={18} />
          </button>
          
          <input 
            type="range" 
            min="0.1" 
            max="3.0" 
            step="0.05" 
            value={scale} 
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />

          <button 
            onClick={() => handleScaleChange(scale + 0.05)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 border border-gray-200"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {[0.1, 0.3, 0.6, 1.0].map((val) => (
            <button
              key={val}
              onClick={() => handleScaleChange(val)}
              className={`text-xs py-1.5 rounded border transition-all ${
                Math.abs(scale - val) < 0.01 
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm' 
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              {Math.round(val * 500)}%
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-[11px] text-blue-700 leading-relaxed">
          <strong>提示：</strong> 调整比例后，模型容器会自动同步调整大小，确保模型不会被边缘裁剪。设置会自动保存。
        </p>
      </div>
    </div>
  );
};
