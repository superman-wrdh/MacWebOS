import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings, MessageSquare, Power, Loader2, Volume2 } from 'lucide-react';

type VoiceType = 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'sage' | 'shimmer' | 'verse';

interface VoiceAssistantProps {
  onConnected?: (connected: boolean) => void;
}

export const VoiceAssistantApp: React.FC<VoiceAssistantProps> = ({ onConnected }) => {
  const [voice, setVoice] = useState<VoiceType>('alloy');
  const [showText, setShowText] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const voices: VoiceType[] = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, []);

  const fetchToken = async () => {
    try {
      const response = await fetch('/api/v2/openai/realtime_token');
      const result = await response.json();
      if (result.code === 0 && result.data?.client_secret) {
        return result.data.client_secret;
      }
      throw new Error(result.message || 'Failed to get token');
    } catch (err) {
      console.error('Error fetching token:', err);
      throw err;
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const token = await fetchToken();
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // Create PeerConnection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Handle remote audio
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      pc.addTrack(stream.getTracks()[0]);

      // Create data channel
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log('Data channel opened');
        // Send initial session update
        const sessionUpdate = {
          type: 'session.update',
          session: {
            voice: voice,
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: { type: 'server_vad' }
          }
        };
        dc.send(JSON.stringify(sessionUpdate));
      };

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);
        handleServerEvent(event);
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to OpenAI
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/sdp',
        },
      });

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      setIsConnected(true);
      if (onConnected) onConnected(true);
      
      // Notify system about showText preference
      window.dispatchEvent(new CustomEvent('voice-assistant-config', { detail: { showText } }));

    } catch (err: any) {
      setError(err.message || 'Connection failed');
      console.error(err);
      disconnect();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
      audioElRef.current.remove();
      audioElRef.current = null;
    }
    setIsConnected(false);
    if (onConnected) onConnected(false);
    window.dispatchEvent(new CustomEvent('voice-assistant-disconnected'));
  };

  const handleServerEvent = (event: any) => {
    // console.log('Server event:', event.type, event);
    
    // Handle transcriptions
    if (event.type === 'conversation.item.input_audio_transcription.completed') {
      window.dispatchEvent(new CustomEvent('voice-assistant-message', { 
        detail: { role: 'user', text: event.transcript } 
      }));
    } else if (event.type === 'response.audio_transcript.delta') {
      window.dispatchEvent(new CustomEvent('voice-assistant-delta', { 
        detail: { role: 'assistant', text: event.delta } 
      }));
    } else if (event.type === 'response.audio_transcript.done') {
      window.dispatchEvent(new CustomEvent('voice-assistant-message-done', { 
        detail: { role: 'assistant', text: event.transcript } 
      }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-md p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
          <Mic size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">语音助手</h1>
          <p className="text-sm text-gray-500">OpenAI Realtime WebRTC</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Voice Selection */}
        <section className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Settings size={16} className="text-purple-500" />
            声音类型
          </label>
          <div className="grid grid-cols-4 gap-2">
            {voices.map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                disabled={isConnected || isConnecting}
                className={`py-2 px-1 text-xs rounded-xl border transition-all ${
                  voice === v 
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Options */}
        <section className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MessageSquare size={16} className="text-purple-500" />
            显示选项
          </label>
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
            <input 
              type="checkbox" 
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              disabled={isConnected || isConnecting}
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700 font-medium">显示对话文本</span>
          </label>
        </section>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-8">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-3 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-purple-200 active:scale-95"
          >
            {isConnecting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                正在连接...
              </>
            ) : (
              <>
                <Power size={24} />
                连接
              </>
            )}
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              已连接
            </div>
            <button
              onClick={disconnect}
              className="w-full flex items-center justify-center gap-3 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-lg font-bold transition-all shadow-xl shadow-red-200 active:scale-95"
            >
              <MicOff size={24} />
              断开连接
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
