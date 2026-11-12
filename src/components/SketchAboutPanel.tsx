import Link from 'next/link';
import MathText from '@/components/MathText';
import type { ResolvedSketchAbout } from '@/app/sketchAbout';

interface SketchAboutPanelProps {
  id: string;
  name: string;
  attribution?: string;
  about: ResolvedSketchAbout;
}

/**
 * The short version of a sketch's explanation, for the About panel on the home page:
 * the idea, a way into the full walkthrough at /sketches/<id>/, and the steps by name.
 * Each step name links straight to that step.
 */
export default function SketchAboutPanel({ id, name, attribution, about }: SketchAboutPanelProps) {
  const titles = [...about.steps, ...(about.more?.steps ?? [])].map((step) => step.title);

  return (
    <>
      <h2 className="about-blend text-base font-semibold">{name}</h2>
      {attribution && <p className="about-blend mt-1 text-xs italic text-zinc-300/90">{attribution}</p>}
      <MathText text={about.idea} className="about-blend mt-2 space-y-2" />

      {titles.length > 0 && (
        <>
          <Link
            href={`/sketches/${id}/`}
            className="about-blend mt-3 block rounded-xl border border-white/25 px-4 py-2.5 text-center font-medium transition-colors hover:border-white/50 hover:bg-white/10"
          >
            Read the walkthrough →
          </Link>
          <h3 className="about-blend mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-300/90">
            How it works, in {titles.length} steps
          </h3>
          <ol className="mt-1.5 space-y-0.5">
            {titles.map((title, index) => (
              <li key={index}>
                <Link
                  href={`/sketches/${id}/#step-${index + 1}`}
                  className="about-blend flex gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white/10 focus-visible:bg-white/10"
                >
                  <span className="w-4 shrink-0 tabular-nums text-zinc-400">{index + 1}</span>
                  <span>{title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
