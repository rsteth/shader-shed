'use client';

import { useState } from 'react';
import ShaderCanvas from '@/components/ShaderCanvas';
import { sketches, sketchIds, defaultSketchId } from '@/shaders/sketches';

export default function Home() {
  const [activeSketch, setActiveSketch] = useState(defaultSketchId);

  return (
    <main className="relative flex min-h-screen items-start justify-center p-6">
      <ShaderCanvas mode="background" sketch={activeSketch} />

      <div className="relative z-10 pointer-events-auto mt-2">
        <label htmlFor="sketch-select" className="sr-only">
          Select sketch
        </label>
        <select
          id="sketch-select"
          value={activeSketch}
          onChange={(e) => setActiveSketch(e.target.value)}
          className="
            min-w-56 rounded-xl border border-white/30 bg-black/45 px-4 py-2.5
            text-sm font-medium text-white backdrop-blur-md outline-none
            transition-colors duration-200 hover:border-white/50 focus:border-white/80
          "
        >
          {sketchIds.map((id) => (
            <option key={id} value={id}>
              {sketches[id].name}
            </option>
          ))}
        </select>
      </div>
    </main>
  );
}
