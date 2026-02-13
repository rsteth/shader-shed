'use client';

import { useEffect, useMemo, useState } from 'react';
import ShaderCanvas from '@/components/ShaderCanvas';
import { defaultSketchId, slideshowSketchIds } from '@/shaders/sketches';

const SLIDESHOW_INTERVAL_MS = 12000;

export interface SlideshowPageProps {
  asciiMode: boolean;
}

export default function SlideshowPage({ asciiMode }: SlideshowPageProps) {
  const availableSketches = useMemo(
    () => (slideshowSketchIds.length > 0 ? slideshowSketchIds : [defaultSketchId]),
    []
  );

  const [activeIndex, setActiveIndex] = useState(() =>
    Math.floor(Math.random() * availableSketches.length)
  );

  useEffect(() => {
    if (availableSketches.length <= 1) {
      return;
    }

    let intervalId: number | null = null;

    const startInterval = () => {
      if (intervalId !== null) {
        return;
      }

      intervalId = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % availableSketches.length);
      }, SLIDESHOW_INTERVAL_MS);
    };

    const stopInterval = () => {
      if (intervalId === null) {
        return;
      }

      window.clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [availableSketches]);

  return (
    <main className="relative min-h-screen">
      <ShaderCanvas mode="background" sketch={availableSketches[activeIndex]} asciiMode={asciiMode} />
    </main>
  );
}
