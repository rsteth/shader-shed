import { notFound } from 'next/navigation';
import ShaderCanvas from '@/components/ShaderCanvas';
import MathText from '@/components/MathText';
import { getSketchAbout } from '@/app/sketchAbout';
import { sketches } from '@/shaders/sketches';

const aboutEnabledSketchIds = ['chiaroscuroBloom', 'eclipseWeave', 'umbraDrift', 'lumenGlyphs'] as const;

type AboutSketchId = (typeof aboutEnabledSketchIds)[number];

export const dynamicParams = false;

export function generateStaticParams() {
  return aboutEnabledSketchIds.map((id) => ({ id }));
}

export default async function SketchAboutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!aboutEnabledSketchIds.includes(id as AboutSketchId)) {
    notFound();
  }

  const sketch = sketches[id];
  if (!sketch) {
    notFound();
  }

  const about = getSketchAbout(id, sketch);

  return (
    <main className="relative min-h-screen">
      <ShaderCanvas mode="background" sketch={id} />

      <section className="absolute left-4 top-4 z-10 w-[min(24rem,calc(100%-2rem))] rounded-2xl border border-white/20 bg-black/55 p-4 text-sm shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:left-6 sm:top-6">
        <h1 className="about-blend text-base font-semibold">{sketch.name}</h1>
        <MathText text={about.equation} className="about-blend mt-2 space-y-2" />
        <MathText
          text={about.symbols}
          className="about-blend mt-1 text-[11px] leading-relaxed text-zinc-300/90 space-y-1"
        />
        <MathText text={about.intro} className="about-blend mt-4 space-y-2" />
        <div className="mt-3 space-y-3">
          {about.sections.map((section) => (
            <div key={section.heading} className="rounded-lg border border-white/15 p-3">
              <h2 className="about-blend text-sm font-semibold">{section.heading}</h2>
              <MathText text={section.body} className="about-blend mt-1.5 space-y-2" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
