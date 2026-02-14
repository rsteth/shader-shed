'use client';

import { useState } from 'react';
import ShaderCanvas from '@/components/ShaderCanvas';
import { sketches, sketchIds, defaultSketchId } from '@/shaders/sketches';
import MathText from '@/components/MathText';
import { getSketchAbout } from '@/app/sketchAbout';

const panelClassName =
  'relative rounded-2xl border border-white/20 bg-black/55 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl';

const selectClassName =
  'relative z-10 w-full appearance-none rounded-xl border border-white/15 bg-zinc-950/95 px-4 py-3.5 pr-12 text-[15px] font-medium tracking-[0.01em] text-zinc-100 outline-none transition-all duration-200 hover:border-white/35 hover:bg-zinc-900/95 focus:border-white/50 focus:ring-2 focus:ring-white/20';

const buttonClassName =
  'relative z-10 mt-3 w-full rounded-xl border border-white/15 bg-zinc-950/95 px-4 py-3.5 text-left text-[15px] font-medium tracking-[0.01em] text-zinc-100 outline-none transition-all duration-200 hover:border-white/35 hover:bg-zinc-900/95 focus:border-white/50 focus:ring-2 focus:ring-white/20';

export default function Home() {
  const [activeSketch, setActiveSketch] = useState(defaultSketchId);
  const [showAbout, setShowAbout] = useState(false);
  const [asciiMode, setAsciiMode] = useState(false);
  const sketch = sketches[activeSketch];
  const about = getSketchAbout(activeSketch, sketch);

  return (
    <main className="relative min-h-screen">
      <ShaderCanvas mode="background" sketch={activeSketch} asciiMode={asciiMode} />

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

          <button
            type="button"
            className={buttonClassName}
            onClick={() => setAsciiMode((enabled) => !enabled)}
            aria-pressed={asciiMode}
          >
            ASCII: {asciiMode ? 'On' : 'Off'}
          </button>

          <button
            type="button"
            className={buttonClassName}
            onClick={() => setShowAbout((open) => !open)}
            aria-expanded={showAbout}
            aria-controls="sketch-about-panel"
          >
            About
          </button>

          {showAbout && (
            <section
              id="sketch-about-panel"
              className="about-panel relative z-10 mt-3 max-h-[52vh] overflow-y-auto rounded-xl border border-white/20 p-4 text-sm"
            >
              <h2 className="about-blend text-base font-semibold">{sketch?.name ?? activeSketch}</h2>
              {sketch?.meta?.attribution && (
                <p className="about-blend mt-1 text-xs italic text-zinc-300/90">{sketch.meta.attribution}</p>
              )}
              <MathText text={about.equation} className="about-blend mt-2 space-y-2" />
              <MathText
                text={about.symbols}
                className="about-blend mt-1 text-[11px] leading-relaxed text-zinc-300/90 space-y-1"
              />
              <MathText text={about.intro} className="about-blend mt-4 space-y-2" />
              <div className="mt-3 space-y-3">
                {about.sections.map((section) => (
                  <div key={section.heading} className="rounded-lg border border-white/15 p-3">
                    <h3 className="about-blend text-sm font-semibold">{section.heading}</h3>
                    <MathText text={section.body} className="about-blend mt-1.5 space-y-2" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
