'use client';

import { useState } from 'react';
import ShaderCanvas from "@/components/ShaderCanvas";
import { sketches, sketchIds, defaultSketchId } from '@/shaders/sketches';

export default function Home() {
  const [activeSketch, setActiveSketch] = useState(defaultSketchId);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 text-white">

      {/* Background Layer */}
      <ShaderCanvas mode="background" sketch={activeSketch} />

      {/* Content Layer */}
      <div className="relative z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8 pointer-events-none">
        <h1 className="text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          SHADER FORGE
        </h1>
        <p className="text-xl opacity-80 max-w-2xl text-center">
          Next.js + Regl + WebGL2<br/>
          Multipass Shader Sketches
        </p>

        {/* Sketch Selector */}
        <div className="flex flex-wrap gap-3 mt-8 pointer-events-auto justify-center">
          {sketchIds.map((id) => {
            const sketch = sketches[id];
            const isActive = id === activeSketch;
            return (
              <button
                key={id}
                onClick={() => setActiveSketch(id)}
                className={`
                  px-5 py-2.5 rounded-full border transition-all duration-200
                  backdrop-blur-md text-sm font-medium
                  ${isActive
                    ? 'bg-white text-black border-white'
                    : 'border-white/30 hover:bg-white/10 hover:border-white/50'
                  }
                `}
                title={sketch.description}
              >
                {sketch.name}
              </button>
            );
          })}
        </div>

        {/* Current sketch description */}
        <p className="text-sm opacity-60 mt-4 text-center">
          {sketches[activeSketch].description}
        </p>
      </div>

    </main>
  );
}
