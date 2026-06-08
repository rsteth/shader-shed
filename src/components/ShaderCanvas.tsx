'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { UniformManager } from '@/lib/regl/uniforms';
import { MultipassSystem } from '@/lib/regl/pipeline';
import { createReglWithCaps, printCapsReport, type Caps } from '@/lib/regl/render-target';
import { defaultSketchId } from '@/shaders/sketches';

interface ShaderCanvasProps {
  mode?: 'background' | 'overlay' | 'contained';
  sketch?: string;
  asciiMode?: boolean;
  onLoaded?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface ShaderCanvasHandle {
  setSketch: (sketchId: string) => void;
  getCurrentSketch: () => string;
}

const MAX_DEVICE_PIXEL_RATIO = 2;

const ShaderCanvas = forwardRef<ShaderCanvasHandle, ShaderCanvasProps>(({
  mode = 'contained',
  sketch = defaultSketchId,
  asciiMode = false,
  onLoaded,
  className = '',
  style,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Refs to hold system instances to survive re-renders without recreation
  const systemRef = useRef<{
    regl: ReturnType<typeof createReglWithCaps>['regl'];
    uniforms: UniformManager;
    pipeline: MultipassSystem;
    caps: Caps;
    rafId: number;
    observer: ResizeObserver;
  } | null>(null);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    setSketch: (sketchId: string) => {
      if (systemRef.current) {
        systemRef.current.pipeline.setSketch(sketchId);
      }
    },
    getCurrentSketch: () => {
      return systemRef.current?.pipeline.currentSketchId || defaultSketchId;
    }
  }), []);

  // Handle sketch prop changes
  useEffect(() => {
    if (systemRef.current && sketch) {
      systemRef.current.pipeline.setSketch(sketch);
    }
  }, [sketch]);

  useEffect(() => {
    if (systemRef.current) {
      systemRef.current.pipeline.setAsciiEnabled(asciiMode);
    }
  }, [asciiMode]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    try {
      const container = containerRef.current;

      const { regl: _regl, caps } = createReglWithCaps({
        canvas: canvasRef.current,
        preferWebGL2: true,
        attributes: {
          alpha: true,
          antialias: false,
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false,
        },
      });

      printCapsReport(caps);

      const uniforms = new UniformManager();
      const pipeline = new MultipassSystem(_regl, uniforms, caps, sketch);
      pipeline.setAsciiEnabled(asciiMode);

      const handleWindowMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        uniforms.setMouse(clientX / innerWidth, clientY / innerHeight);
      };

      const handleContainedMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        uniforms.setMouse(
          (e.clientX - rect.left) / rect.width,
          (e.clientY - rect.top) / rect.height
        );
      };

      if (mode !== 'contained') {
        window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
      } else {
        container.addEventListener('mousemove', handleContainedMouseMove, { passive: true });
      }

      let framebufferWidth = 0;
      let framebufferHeight = 0;

      const handleResize = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        if (width === 0 || height === 0) return;

        const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO));
        const nextFramebufferWidth = Math.round(width * dpr);
        const nextFramebufferHeight = Math.round(height * dpr);

        if (
          nextFramebufferWidth === framebufferWidth &&
          nextFramebufferHeight === framebufferHeight
        ) {
          return;
        }

        framebufferWidth = nextFramebufferWidth;
        framebufferHeight = nextFramebufferHeight;

        canvasRef.current.width = framebufferWidth;
        canvasRef.current.height = framebufferHeight;

        _regl.poll();
        pipeline.resize(framebufferWidth, framebufferHeight);
      };

      const observer = new ResizeObserver(handleResize);
      observer.observe(container);

      handleResize();

      let disposed = false;
      let lastTime = performance.now();
      let currentRafId = 0;

      const loop = () => {
        if (disposed) return;

        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        uniforms.update(dt);

        _regl.clear({ color: [0, 0, 0, 0], depth: 1 });
        pipeline.render();

        currentRafId = requestAnimationFrame(loop);
      };

      currentRafId = requestAnimationFrame(loop);

      systemRef.current = {
        regl: _regl,
        uniforms,
        pipeline,
        caps,
        rafId: currentRafId,
        observer
      };

      setRenderError(null);
      onLoaded?.();

      return () => {
        disposed = true;
        cancelAnimationFrame(currentRafId);
        observer.disconnect();
        pipeline.dispose();
        _regl.destroy();

        if (mode !== 'contained') {
          window.removeEventListener('mousemove', handleWindowMouseMove);
        } else {
          container.removeEventListener('mousemove', handleContainedMouseMove);
        }

        systemRef.current = null;
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initialize the shader renderer.';
      setRenderError(message);
      console.error('[shader-canvas] Renderer initialization failed:', error);
    }
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
              zIndex: renderError ? 0 : -1,
              pointerEvents: renderError ? 'auto' : 'none'
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
      {renderError && (
        <div
          role="status"
          className="absolute inset-0 grid place-items-center bg-black px-6 text-center text-sm text-zinc-200"
        >
          <div className="max-w-sm rounded-lg border border-white/15 bg-zinc-950/90 p-4 shadow-2xl">
            <p className="font-semibold text-white">Shader renderer unavailable</p>
            <p className="mt-2 text-zinc-300">{renderError}</p>
          </div>
        </div>
      )}
    </div>
  );
});

ShaderCanvas.displayName = 'ShaderCanvas';

export default ShaderCanvas;
