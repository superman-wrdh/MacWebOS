import React, { useState } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Loader2 } from 'lucide-react';

interface VoiceAssistantAppProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  onConnect: (voice: string, showText: boolean) => void;
  onDisconnect: () => void;
  initialVoice?: string;
  initialShowText?: boolean;
}

export const VoiceAssistantApp: React.FC<VoiceAssistantAppProps> = ({ 
  isConnected, 
  isConnecting, 
  error, 
  onConnect, 
  onDisconnect,
  initialVoice = 'alloy',
  initialShowText = true
}) => {
  const [voice, setVoice] = useState(initialVoice);
  const [showText, setShowText] = useState(initialShowText);

  const handleConnect = () => {
    onConnect(voice, showText);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-6">
          <Volume2 size={40} />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">语音助手</h2>
        <p className="text-sm text-gray-500 mb-8">基于 OpenAI Realtime WebRTC</p>

        <div className="w-full max-w-xs space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!isConnected ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">声音类型</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  disabled={isConnecting}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
                >
                    <option value="alloy">Alloy (中性/平衡)</option>
                    <option value="ash">Ash (男-低沉/稳重)</option>
                    <option value="ballad">Ballad (男-温柔/亲切)</option>
                    <option value="coral">Coral (女-明亮/活泼)</option>
                    <option value="echo">Echo (男-深邃/磁性)</option>
                    <option value="sage">Sage (女-睿智/平和)</option>
                    <option value="shimmer">Shimmer (女-清脆/动听)</option>
                    <option value="verse">Verse (男-富有表现力)</option>
                    <option value="marin">marin (女-白领)</option>
                    <option value="verse">verse (男-浑厚)</option>
                    <option value="cedar">cedar (男-沉稳)</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-600 font-medium">显示对话文本</span>
                <button
                  onClick={() => setShowText(!showText)}
                  disabled={isConnecting}
                  className={`w-10 h-5 rounded-full transition-colors relative ${showText ? 'bg-purple-600' : 'bg-gray-200'} disabled:opacity-50`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showText ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>正在连接...</span>
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    <span>开始连接</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in zoom-in-95 duration-300">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 animate-pulse">
                  <Mic size={24} />
                </div>
                <h3 className="font-bold text-green-800 mb-1">已连接</h3>
                <p className="text-xs text-green-600 opacity-80">语音助手正在后台运行</p>
              </div>

              <button
                onClick={onDisconnect}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <MicOff size={20} />
                <span>断开连接</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-white/50 text-center">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
          OpenAI Realtime API • WebRTC Mode
        </p>
      </div>
    </div>
  );
};
