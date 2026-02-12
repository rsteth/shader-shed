'use client';

import { useState } from 'react';
import ShaderCanvas from '@/components/ShaderCanvas';
import { sketches, sketchIds, defaultSketchId } from '@/shaders/sketches';

const panelClassName =
  'relative rounded-2xl border border-white/20 bg-black/55 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl';

const selectClassName =
  'relative z-10 w-full appearance-none rounded-xl border border-white/15 bg-zinc-950/95 px-4 py-3.5 pr-12 text-[15px] font-medium tracking-[0.01em] text-zinc-100 outline-none transition-all duration-200 hover:border-white/35 hover:bg-zinc-900/95 focus:border-white/50 focus:ring-2 focus:ring-white/20';

export default function Home() {
  const [activeSketch, setActiveSketch] = useState(defaultSketchId);

  return (
    <main className="relative min-h-screen">
      <ShaderCanvas mode="background" sketch={activeSketch} />

      <div className="pointer-events-auto absolute left-4 top-4 z-10 w-[min(18rem,calc(100%-2rem))] sm:left-6 sm:top-6">
        <div className={panelClassName}>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset pointer-events-none" />
          <select
            id="sketch-select"
            value={activeSketch}
            onChange={(event) => setActiveSketch(event.target.value)}
            aria-label="Sketch"
            className={selectClassName}
          >
            {sketchIds.map((id) => (
              <option key={id} value={id}>
                {sketches[id]?.name ?? id}
              </option>
            ))}
          </select>
        </div>
      </div>
    </main>
  );
}
