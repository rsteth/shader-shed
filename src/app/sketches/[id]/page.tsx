import { notFound } from 'next/navigation';
import ShaderCanvas from '@/components/ShaderCanvas';
import SketchWalkthrough from '@/components/SketchWalkthrough';
import { getSketchAbout } from '@/app/sketchAbout';
import { sketches, sketchIds } from '@/shaders/sketches';

export const dynamicParams = false;

export function generateStaticParams() {
  return sketchIds.map((id) => ({ id }));
}

/**
 * The walkthrough for one sketch: the shader fixed behind the page, its explanation
 * scrolling over it. Scroll-driven sketches read this page's own scroll position, so
 * they move as you read.
 */
export default async function SketchWalkthroughPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const sketch = sketches[id];
  if (!sketch || !sketchIds.includes(id)) {
    notFound();
  }

  const index = sketchIds.indexOf(id);
  const previousId = sketchIds[(index - 1 + sketchIds.length) % sketchIds.length];
  const nextId = sketchIds[(index + 1) % sketchIds.length];

  return (
    <main className="relative">
      <ShaderCanvas mode="background" sketch={id} scrollSource="page" />
      <SketchWalkthrough
        name={sketch.name}
        attribution={sketch.meta?.attribution}
        about={getSketchAbout(id, sketch)}
        scrollDriven={sketch.scrollDriven === true}
        previous={{ id: previousId, name: sketches[previousId].name }}
        next={{ id: nextId, name: sketches[nextId].name }}
      />
    </main>
  );
}
