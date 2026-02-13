'use client';

import { useEffect, useMemo, useState } from 'react';
import ShaderCanvas from '@/components/ShaderCanvas';
import { defaultSketchId, slideshowSketchIds } from '@/shaders/sketches';

const SLIDESHOW_INTERVAL_MS = 15000;

interface SlideshowCanvasProps {
  asciiMode?: boolean;
}

export default function SlideshowCanvas({ asciiMode = false }: SlideshowCanvasProps) {
  const ids = useMemo(() => (slideshowSketchIds.length > 0 ? slideshowSketchIds : [defaultSketchId]), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ids.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ids.length);
    }, SLIDESHOW_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [ids]);

  return (
    <main className="relative min-h-screen">
      <ShaderCanvas mode="contained" sketch={ids[index]} asciiMode={asciiMode} />
    </main>
  );
}
