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
    <main className="relative flex min-h-screen items-start justify-center px-6 pt-12 sm:pt-16">
      <ShaderCanvas mode="background" sketch={activeSketch} />

      <div className="relative z-10 w-full max-w-lg pointer-events-auto">
        <label htmlFor="sketch-select" className="sr-only">
          Select sketch
        </label>
        <div className={panelClassName}>
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset pointer-events-none" />
          <select
            id="sketch-select"
            value={activeSketch}
            onChange={(event) => setActiveSketch(event.target.value)}
            className={selectClassName}
          >
            {sketchIds.map((id) => (
              <option key={id} value={id}>
                {sketches[id]?.name ?? id}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-7 z-20 flex items-center text-zinc-400 pointer-events-none">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </main>
  );
}
