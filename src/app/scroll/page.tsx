'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ShaderCanvas from '@/components/ShaderCanvas';
import { sketches, scrollSketchIds } from '@/shaders/sketches';

const cardClassName =
  'max-w-md rounded-2xl border border-white/20 bg-black/60 p-5 text-sm leading-relaxed text-zinc-200 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl';

const controlClassName =
  'w-full appearance-none rounded-xl border border-white/15 bg-zinc-950/95 px-4 py-3 text-[15px] font-medium text-zinc-100 outline-none transition-colors duration-200 hover:border-white/35 focus:border-white/50 focus:ring-2 focus:ring-white/20';

const CONTAINED_SKETCH = 'slitScrollText';

/**
 * A tall page for trying scroll input the way it would be used on a real site:
 * one canvas fixed behind the content reading page progress, and one canvas in
 * the flow reading its own trip through the viewport.
 */
export default function ScrollDemoPage() {
  const [activeSketch, setActiveSketch] = useState(scrollSketchIds[0]);

  // ?sketch=<id> preselects the background. Read after mount so the page can be exported statically.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('sketch');
    if (requested && scrollSketchIds.includes(requested)) {
      setActiveSketch(requested);
    }
  }, []);

  return (
    <main className="relative text-zinc-100">
      <ShaderCanvas mode="background" sketch={activeSketch} scrollSource="page" />

      <div className="fixed left-4 top-4 z-20 w-[min(18rem,calc(100%-2rem))] rounded-2xl border border-white/20 bg-black/60 p-3 backdrop-blur-2xl sm:left-6 sm:top-6">
        <select
          value={activeSketch}
          onChange={(event) => setActiveSketch(event.target.value)}
          aria-label="Background sketch"
          className={controlClassName}
        >
          {scrollSketchIds.map((id) => (
            <option key={id} value={id}>
              {sketches[id]?.name ?? id}
            </option>
          ))}
        </select>
        <Link href="/" className={`${controlClassName} mt-3 block`}>
          All sketches
        </Link>
      </div>

      <section className="flex min-h-screen items-end px-4 pb-16 sm:px-6">
        <div className={cardClassName}>
          <h1 className="text-base font-semibold text-white">Scroll input</h1>
          <p className="mt-2">
            The canvas behind this page is fixed to the viewport and reads one number: how far down the page
            you are, from 0 at the top to 1 at the bottom. Scroll, and the selected sketch follows.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-end px-4 sm:px-6">
        <div className={cardClassName}>
          <h2 className="text-base font-semibold text-white">Speed, not just position</h2>
          <p className="mt-2">
            Flick the page. Every row of bars is knocked sideways in proportion to how fast you are scrolling
            and settles when you stop. Any sketch can read that as <code>uScrollVelocity</code>.
          </p>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className={cardClassName}>
          <h2 className="text-base font-semibold text-white">A block in the flow</h2>
          <p className="mt-2">
            The canvas below sits in the page like an image would. It measures its own trip through the
            viewport instead of the whole page: scattered as it enters, assembled when it is centred,
            scattered again as it leaves.
          </p>
        </div>
        <div className="mt-6 h-[70vh] overflow-hidden rounded-2xl border border-white/20">
          <ShaderCanvas mode="contained" sketch={CONTAINED_SKETCH} />
        </div>
      </section>

      <section className="flex min-h-screen items-start px-4 pt-24 sm:px-6">
        <div className={cardClassName}>
          <h2 className="text-base font-semibold text-white">End of the page</h2>
          <p className="mt-2">
            Progress is now 1. Pick another background from the selector and scroll back up to see how it
            uses the same input.
          </p>
        </div>
      </section>
    </main>
  );
}
