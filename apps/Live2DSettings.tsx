import React, { useState, useEffect } from 'react';
import { Maximize, Minus, Plus, Trash2, Link, Check, PlusCircle, Cloud, Loader2 } from 'lucide-react';
import { fetchNetworkRoles, NetworkRole } from '../services/live2dApi';

interface ModelConfig {
  id: string;
  name: string;
  url: string;
}

const DEFAULT_MODELS: ModelConfig[] = [
  { 
    id: 'default-shizuku', 
    name: 'Shizuku (Default)', 
    url: 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json' 
  },
  {
    id: 'hiyori',
    name: 'Hiyori',
    url: 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/hiyori/hiyori.model.json'
  }
];

export const Live2DSettingsApp: React.FC = () => {
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('live2d-scale');
    return saved ? parseFloat(saved) : 0.3;
  });

  const [models, setModels] = useState<ModelConfig[]>(() => {
    const saved = localStorage.getItem('live2d-models');
    return saved ? JSON.parse(saved) : DEFAULT_MODELS;
  });

  const [currentModelUrl, setCurrentModelUrl] = useState(() => {
    return localStorage.getItem('live2d-current-url') || DEFAULT_MODELS[0].url;
  });

  const [newModelName, setNewModelName] = useState('');
  const [newModelUrl, setNewModelUrl] = useState('');

  const [networkRoles, setNetworkRoles] = useState<NetworkRole[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    const loadNetworkRoles = async () => {
      setIsLoadingRoles(true);
      setRolesError(null);
      try {
        const roles = await fetchNetworkRoles();
        setNetworkRoles(roles);
      } catch (err: any) {
        setRolesError(err.message || '获取网络角色失败');
      } finally {
        setIsLoadingRoles(false);
      }
    };
    loadNetworkRoles();
  }, []);

  const handleScaleChange = (newScale: number) => {
    const clampedScale = Math.max(0.1, Math.min(3.0, newScale));
    setScale(clampedScale);
    localStorage.setItem('live2d-scale', clampedScale.toString());
    
    // Dispatch custom event to notify Live2D component
    window.dispatchEvent(new CustomEvent('live2d-scale-change', { detail: clampedScale }));
  };

  const handleSelectModel = (url: string) => {
    setCurrentModelUrl(url);
    localStorage.setItem('live2d-current-url', url);
    window.dispatchEvent(new CustomEvent('live2d-url-change', { detail: url }));
  };

  const handleAddModel = () => {
    if (!newModelName || !newModelUrl) return;
    
    const newModel: ModelConfig = {
      id: Date.now().toString(),
      name: newModelName,
      url: newModelUrl
    };

    const updatedModels = [...models, newModel];
    setModels(updatedModels);
    localStorage.setItem('live2d-models', JSON.stringify(updatedModels));
    
    setNewModelName('');
    setNewModelUrl('');
  };

  const handleDeleteModel = (id: string) => {
    const modelToDelete = models.find(m => m.id === id);
    if (!modelToDelete) return;

    const updatedModels = models.filter(m => m.id !== id);
    setModels(updatedModels);
    localStorage.setItem('live2d-models', JSON.stringify(updatedModels));

    // If we deleted the current model, switch to default
    if (modelToDelete.url === currentModelUrl) {
      handleSelectModel(DEFAULT_MODELS[0].url);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-white/80 backdrop-blur-md h-full overflow-y-auto">
      {/* Scale Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="p-2 bg-indigo-500 rounded-lg text-white">
            <Maximize size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">角色缩放设置</h2>
            <p className="text-xs text-gray-500">调整 Live2D 角色在桌面上的显示大小</p>
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
        </div>
      </section>

      {/* Network Roles Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="p-2 bg-purple-500 rounded-lg text-white">
            <Cloud size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">网络角色</h2>
            <p className="text-xs text-gray-500">从云端选择并加载角色</p>
          </div>
        </div>

        {isLoadingRoles ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : rolesError ? (
          <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
            {rolesError}
          </div>
        ) : networkRoles.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500">
            暂无网络角色
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {networkRoles.map((role) => (
              <div 
                key={role.id}
                onClick={() => handleSelectModel(role.url)}
                className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  currentModelUrl === role.url 
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-200 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-purple-600">{role.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">{role.name}</span>
                {currentModelUrl === role.url && (
                  <div className="absolute top-2 right-2 text-purple-500">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Model URL Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <Link size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">自定义角色管理</h2>
            <p className="text-xs text-gray-500">管理并切换不同的自定义角色 URL</p>
          </div>
        </div>

        {/* Model List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {models.map((model) => (
            <div 
              key={model.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                currentModelUrl === model.url 
                  ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-100' 
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => handleSelectModel(model.url)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{model.name}</span>
                  {currentModelUrl === model.url && <Check size={14} className="text-blue-500" />}
                </div>
                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{model.url}</p>
              </div>
              
              {!DEFAULT_MODELS.some(m => m.id === model.id) && (
                <button 
                  onClick={() => handleDeleteModel(model.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Model */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">添加自定义角色</h3>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="角色名称 (例如: 希儿)" 
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <input 
              type="text" 
              placeholder="角色 JSON URL (model.json)" 
              value={newModelUrl}
              onChange={(e) => setNewModelUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <button 
              onClick={handleAddModel}
              disabled={!newModelName || !newModelUrl}
              className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <PlusCircle size={16} />
              保存角色
            </button>
          </div>
        </div>
      </section>

      <div className="mt-auto p-3 bg-indigo-50 rounded-lg border border-indigo-100">
        <p className="text-[11px] text-indigo-700 leading-relaxed">
          <strong>提示：</strong> 你可以从网络上获取 Live2D 角色的 <code>model.json</code> 链接并粘贴到此处。切换角色后，桌面上的角色会自动重新加载。
        </p>
      </div>
    </div>
  );
};
