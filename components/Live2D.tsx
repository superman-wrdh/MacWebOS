import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

// Fix for shader error in some environments
// Remove PRECISION_FRAGMENT override as it can cause checkMaxIfStatementsInShader error on devices without highp support
(PIXI as any).settings.SPRITE_MAX_TEXTURES = 16;
// Force WebGL 1 for better compatibility in iframes
if ((PIXI as any).ENV) {
  (PIXI as any).settings.PREFER_ENV = (PIXI as any).ENV.WEBGL_LEGACY || 1;
}

// Register PIXI to Live2DModel
(window as any).PIXI = PIXI;

interface Live2DProps {
  modelUrl?: string;
}

export const Live2D: React.FC<Live2DProps> = ({ 
  modelUrl = 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<Live2DModel | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 250, y: window.innerHeight - 400 });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    let isDestroyed = false;
    let app: PIXI.Application;

    try {
      app = new PIXI.Application({
        autoStart: true,
        backgroundAlpha: 0,
        resizeTo: containerRef.current,
      });
      containerRef.current.appendChild(app.view as HTMLCanvasElement);
    } catch (e) {
      console.error("WebGL is not supported or failed to initialize PIXI:", e);
      return;
    }

    const loadModel = async () => {
      try {
        const live2dModel = await Live2DModel.from(modelUrl);
        if (isDestroyed) {
          live2dModel.destroy();
          return;
        }
        
        app.stage.addChild(live2dModel);

        // Scale and position
        const scale = 0.2;
        live2dModel.scale.set(scale);
        live2dModel.anchor.set(0.5, 0.5);
        live2dModel.x = app.screen.width / 2;
        live2dModel.y = app.screen.height / 2;

        // Interaction
        live2dModel.interactive = true;
        live2dModel.on('hit', (hitAreas) => {
          if (hitAreas.includes('body') || hitAreas.includes('Body')) {
            live2dModel.motion('tap_body');
          }
        });

        setModel(live2dModel);
      } catch (error) {
        console.error('Failed to load Live2D model:', error);
      }
    };

    loadModel();

    return () => {
      isDestroyed = true;
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [modelUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="absolute z-[1] cursor-grab active:cursor-grabbing"
      style={{ 
        left: position.x, 
        top: position.y,
        width: '300px',
        height: '400px',
        pointerEvents: 'auto'
      }}
      onMouseDown={handleMouseDown}
    >
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
