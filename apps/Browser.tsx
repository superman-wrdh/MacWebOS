import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, Star, MoreVertical, Lock, Info, X } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://www.wikipedia.org');
  const [inputValue, setInputValue] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(['https://www.wikipedia.org']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize input when URL changes via history or internal nav
  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputValue.trim();
    
    if (!url) return;

    // Smart URL handling
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // If it looks like a domain, prepend https://
        if (/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(url) && !url.includes(' ')) {
             url = 'https://' + url;
        } else {
             // Otherwise treat as search query (using Bing to allow iframing sometimes, though many engines block it)
             // Using Wikipedia search as it allows iframing usually
             url = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(url)}`;
        }
    }

    navigateTo(url);
  };

  const navigateTo = (url: string) => {
      if (url === currentUrl) {
          // Just refresh if same
          if (iframeRef.current) iframeRef.current.src = url;
          return;
      }
      setIsLoading(true);
      setCurrentUrl(url);
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(url);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const url = history[newIndex];
          setCurrentUrl(url);
          setIsLoading(true);
      }
  };

  const goForward = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const url = history[newIndex];
          setCurrentUrl(url);
          setIsLoading(true);
      }
  };

  const handleIframeLoad = () => {
      setIsLoading(false);
  };

  const isSecure = currentUrl.startsWith('https');

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Tab Strip */}
      <div className="h-10 bg-[#dfe3e7] flex items-end px-2 space-x-1 pt-2">
          <div className="w-48 h-full bg-white rounded-t-lg flex items-center justify-between px-3 text-xs text-gray-700 shadow-sm relative group">
              <div className="flex items-center space-x-2 truncate">
                  <img src={`https://www.google.com/s2/favicons?domain=${currentUrl}`} className="w-3 h-3 opacity-80" alt="" />
                  <span className="truncate max-w-[120px]">New Tab</span>
              </div>
              <X size={12} className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-full cursor-pointer p-0.5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-full cursor-pointer mb-1">
              <span className="text-xl leading-none text-gray-600">+</span>
          </div>
      </div>

      {/* Browser Toolbar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-3 space-x-3 shadow-sm z-10">
        <div className="flex space-x-1 text-gray-600">
          <button 
            onClick={goBack} 
            disabled={historyIndex === 0}
            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${historyIndex === 0 ? 'opacity-30 cursor-default' : ''}`}
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex === history.length - 1}
            className={`p-1.5 hover:bg-gray-100 rounded-full transition-colors ${historyIndex === history.length - 1 ? 'opacity-30 cursor-default' : ''}`}
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => { setIsLoading(true); if (iframeRef.current) iframeRef.current.src = currentUrl; }} 
            className="p-1.5 hover:bg-gray-100 rounded-full"
          >
            <RotateCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center">
            <div className="relative w-full group">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isSecure ? 'text-green-600' : 'text-gray-400'}`}>
                    {isSecure ? <Lock size={12} /> : <Info size={12} />}
                </div>
                <input 
                    type="text" 
                    className="w-full bg-gray-100 text-gray-700 rounded-full py-1.5 pl-8 pr-8 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-400/50 focus:shadow-sm border border-transparent focus:border-blue-300 transition-all"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={(e) => e.target.select()}
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star size={14} />
                </div>
            </div>
        </form>

        <div className="flex items-center text-gray-600 space-x-2">
             <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">U</div>
             <button className="p-1 hover:bg-gray-100 rounded-full"><MoreVertical size={16} /></button>
        </div>
      </div>
      
      {/* Bookmarks Bar */}
      <div className="h-8 bg-white border-b border-gray-100 flex items-center px-4 space-x-4 text-xs text-gray-600 overflow-hidden">
        <div className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer transition-colors" onClick={() => navigateTo('https://www.wikipedia.org')}>
            <img src="https://www.google.com/s2/favicons?domain=wikipedia.org" alt="" className="w-3 h-3" />
            <span>Wikipedia</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer transition-colors" onClick={() => navigateTo('https://www.bing.com')}>
            <img src="https://www.google.com/s2/favicons?domain=bing.com" alt="" className="w-3 h-3" />
            <span>Bing</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-md cursor-pointer transition-colors" onClick={() => navigateTo('https://github.com/trending')}>
            <img src="https://www.google.com/s2/favicons?domain=github.com" alt="" className="w-3 h-3" />
            <span>GitHub</span>
        </div>
      </div>

      {/* Webview Content */}
      <div className="flex-1 bg-white relative">
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400 text-xs">Loading content...</span>
                </div>
            </div>
        )}
        <iframe 
            ref={iframeRef}
            src={currentUrl} 
            title="Browser" 
            className="w-full h-full border-none"
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        <div className="absolute bottom-0 w-full bg-yellow-50 text-yellow-700 text-[10px] p-1 text-center border-t border-yellow-200">
            <strong>Simulation Note:</strong> Many websites (Google, YouTube, etc.) prevent being loaded inside other pages (iFrames). If a page is blank, that is why.
        </div>
      </div>
    </div>
  );
};