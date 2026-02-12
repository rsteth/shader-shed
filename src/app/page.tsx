'use client';

import { useState } from 'react';
import ShaderCanvas from "@/components/ShaderCanvas";
import { sketches, sketchIds, defaultSketchId } from '@/shaders/sketches';

export default function Home() {
  const [activeSketch, setActiveSketch] = useState(defaultSketchId);
  const currentSketch = sketches[activeSketch];

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <ShaderCanvas mode="background" sketch={activeSketch} />

      <div className="pointer-events-none absolute inset-0 z-10 p-4 sm:p-6">
        <section className="pointer-events-auto w-full max-w-xs rounded-xl border border-zinc-700 bg-black p-4 shadow-2xl font-sans">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">Sketch</p>
          <h1 className="mt-2 text-lg font-semibold text-cyan-100">{currentSketch.name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">{currentSketch.description}</p>

          <label htmlFor="sketch-select" className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Select sketch
          </label>
          <select
            id="sketch-select"
            value={activeSketch}
            onChange={(event) => setActiveSketch(event.target.value as (typeof sketchIds)[number])}
            className="mt-2 w-full rounded-md border border-zinc-500 bg-zinc-950 px-3 py-2 text-sm text-cyan-50 outline-none transition focus:border-cyan-300"
          >
            {sketchIds.map((id) => (
              <option key={id} value={id}>
                {sketches[id].name}
              </option>
            ))}
          </select>
        </section>
      </div>
    </main>
  );
}
