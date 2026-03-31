import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

// Register PIXI to Live2DModel
(window as any).PIXI = PIXI;

interface Live2DProps {
  modelUrl?: string;
}

export const Live2D: React.FC<Live2DProps> = ({ 
  modelUrl = 'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/hiyori/hiyori_pro_t10.model3.json' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<Live2DModel | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: window.innerHeight - 500 });
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new PIXI.Application({
      view: canvasRef.current,
      autoStart: true,
      backgroundAlpha: 0,
      resizeTo: canvasRef.current.parentElement || undefined,
    });

    const loadModel = async () => {
      try {
        const live2dModel = await Live2DModel.from(modelUrl);
        app.stage.addChild(live2dModel);

        // Scale and position
        const scale = 0.15;
        live2dModel.scale.set(scale);
        live2dModel.anchor.set(0.5, 0.5);
        live2dModel.x = app.screen.width / 2;
        live2dModel.y = app.screen.height / 2;

        // Interaction
        live2dModel.interactive = true;
        live2dModel.on('hit', (hitAreas) => {
          if (hitAreas.includes('body') || hitAreas.includes('Body')) {
            live2dModel.motion('TapBody');
          }
        });

        setModel(live2dModel);
      } catch (error) {
        console.error('Failed to load Live2D model:', error);
      }
    };

    loadModel();

    return () => {
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
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
