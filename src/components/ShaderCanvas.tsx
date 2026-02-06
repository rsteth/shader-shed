'use client';

import React, { useEffect, useRef } from 'react';
import regl from 'regl';
import { UniformManager } from '@/lib/regl/uniforms';
import { MultipassSystem } from '@/lib/regl/pipeline';
import { requiredExtensions, optionalExtensions } from '@/lib/regl/context';

interface ShaderCanvasProps {
  mode?: 'background' | 'overlay' | 'contained';
  onLoaded?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  mode = 'contained',
  onLoaded,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs to hold system instances to survive re-renders without recreation
  const systemRef = useRef<{
    regl: regl.Regl;
    uniforms: UniformManager;
    pipeline: MultipassSystem;
    rafId: number;
    observer: ResizeObserver;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // 1. Initialize Regl
    const gl = canvasRef.current.getContext('webgl2', {
        alpha: true,
        antialias: false,
        stencil: false,
        depth: false,
        preserveDrawingBuffer: false
    });

    if (!gl) {
        console.error("WebGL2 not supported");
        return;
    }

    // WebGL2 has float/half-float textures built-in
    // EXT_color_buffer_float is required for rendering to float textures
    const _regl = regl({
      gl,
      extensions: requiredExtensions,
      optionalExtensions: optionalExtensions,
    });

    // 2. Initialize System
    const uniforms = new UniformManager();
    const pipeline = new MultipassSystem(_regl, uniforms);

    // 3. Event Listeners
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize to 0..1
      uniforms.setMouse(clientX / innerWidth, clientY / innerHeight);
    };

    if (mode !== 'contained') {
        window.addEventListener('mousemove', handleMouseMove);
    } else {
        // For contained, we might want relative coordinates, 
        // but for now let's keep it simple or attach to container
        // Attaching to window is often safer for dragging, but let's try container for 'contained'
        containerRef.current.addEventListener('mousemove', (e) => {
             const rect = containerRef.current!.getBoundingClientRect();
             uniforms.setMouse(
                (e.clientX - rect.left) / rect.width,
                (e.clientY - rect.top) / rect.height
             );
        });
    }

    // 4. Resize Handling
    const handleResize = () => {
        if (!containerRef.current || !canvasRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        // Update canvas size
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        
        // Update styling to match display size
        // canvasRef.current.style.width = `${width}px`;
        // canvasRef.current.style.height = `${height}px`;

        // Update system
        _regl.poll(); // Update viewport
        pipeline.resize(width * dpr, height * dpr);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);
    
    // Initial resize
    handleResize();

    // 5. Render Loop
    let lastTime = performance.now();
    const loop = () => {
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        uniforms.update(dt);
        
        _regl.clear({ color: [0, 0, 0, 0], depth: 1 });
        pipeline.render();

        systemRef.current!.rafId = requestAnimationFrame(loop);
    };
    
    const rafId = requestAnimationFrame(loop);

    // Store refs
    systemRef.current = {
        regl: _regl,
        uniforms,
        pipeline,
        rafId,
        observer
    };

    if (onLoaded) onLoaded();

    return () => {
        // Cleanup
        if (systemRef.current) {
            cancelAnimationFrame(systemRef.current.rafId);
            systemRef.current.observer.disconnect();
            systemRef.current.pipeline.dispose();
            systemRef.current.regl.destroy();
            
            if (mode !== 'contained') {
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    };
  }, []);

  // Layout styles
  const getContainerStyle = (): React.CSSProperties => {
      const base: React.CSSProperties = { ...style };
      if (mode === 'background') {
          return {
              ...base,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: -1,
              pointerEvents: 'none'
          };
      }
      if (mode === 'overlay') {
          return {
              ...base,
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 50,
              pointerEvents: 'none' // Allow clicks to pass through by default
          };
      }
      // Contained
      return {
          ...base,
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
      };
  };

  return (
    <div ref={containerRef} style={getContainerStyle()} className={className}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
};

export default ShaderCanvas;
