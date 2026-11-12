'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MathText from '@/components/MathText';
import type { AboutStep, ResolvedSketchAbout } from '@/app/sketchAbout';

interface SketchLink {
  id: string;
  name: string;
}

interface SketchWalkthroughProps {
  name: string;
  attribution?: string;
  about: ResolvedSketchAbout;
  /** True when the sketch itself reacts to scrolling this page. */
  scrollDriven?: boolean;
  previous: SketchLink;
  next: SketchLink;
}

const cardClassName =
  'rounded-2xl border border-white/15 bg-black/65 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-5';

const pillClassName =
  'rounded-full border border-white/15 bg-black/65 px-3.5 py-2 text-[13px] font-medium text-zinc-100 backdrop-blur-xl';

const eyebrowClassName = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400';

/**
 * The reading view for one sketch. The shader stays fixed behind the page and the
 * explanation scrolls over it one card at a time, with space between cards so the
 * picture stays in view. Cards fade up as they arrive, a bar across the top shows how
 * far through you are, and the pill in the corner names the step you are on
 * (the sketch's name again once you are past the last step).
 */
export default function SketchWalkthrough({
  name,
  attribution,
  about,
  scrollDriven = false,
  previous,
  next,
}: SketchWalkthroughProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = about.steps;
  const sharedSteps = about.more?.steps ?? [];
  const total = steps.length + sharedSteps.length;
  const titles = [...steps, ...sharedSteps].map((step) => step.title);

  // Reveal cards as they enter, and track which step sits at the middle of the screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    // Only hide cards once we know we can show them again.
    root.dataset.revealReady = 'true';

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = 'true';
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    root.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));

    const middle = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveStep(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    root.querySelectorAll('[data-step]').forEach((element) => middle.observe(element));

    return () => {
      reveal.disconnect();
      middle.disconnect();
      delete root.dataset.revealReady;
    };
  }, [total]);

  // Progress bar: written straight to the element so scrolling never re-renders the page.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, []);

  const renderStep = (step: AboutStep, number: number) => (
    <section
      key={number}
      id={`step-${number}`}
      data-step={number}
      data-reveal
      aria-labelledby={`step-${number}-title`}
      className={`${cardClassName} my-[34vh] scroll-mt-24 sm:my-[26vh]`}
    >
      <p className={eyebrowClassName}>
        Step {number} of {total}
      </p>
      <h2 id={`step-${number}-title`} className="mt-1.5 text-xl font-semibold leading-snug text-white">
        {step.title}
      </h2>
      <MathText text={step.text} className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-200" />
      {step.math && (
        <MathText
          text={`$$${step.math}$$`}
          className="about-math mt-4 rounded-xl bg-white/[0.07] px-2 py-1 text-sm text-white sm:px-3"
        />
      )}
    </section>
  );

  return (
    <div ref={rootRef} className="relative z-10 text-zinc-100">
      {/* Reading progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[2px] bg-white/10">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-white/85" />
      </div>

      <nav aria-label="Walkthrough" className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6">
        <Link href="/" className={`${pillClassName} pointer-events-auto transition-colors hover:border-white/40`}>
          ← All sketches
        </Link>
        <p className={`${pillClassName} max-w-[60%] truncate`} aria-live="polite">
          {activeStep === 0 || activeStep > total ? name : `${activeStep} / ${total} · ${titles[activeStep - 1]}`}
        </p>
      </nav>

      <div className="mx-auto w-full max-w-[27rem] px-4 sm:mx-0 sm:ml-[max(1.5rem,7vw)]">
        {/* Opening: the idea, with the sketch filling the rest of the first screen */}
        <header data-step={0} className="flex min-h-[100svh] flex-col justify-end pb-[10vh] pt-28">
          <div className={cardClassName}>
            <p className={eyebrowClassName}>How it works</p>
            <h1 className="mt-1.5 text-3xl font-semibold leading-tight text-white">{name}</h1>
            {attribution && <p className="mt-1 text-xs italic text-zinc-400">{attribution}</p>}
            <MathText text={about.idea} className="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-200" />
            {total > 0 && (
              <p className="mt-4 text-[13px] text-zinc-400">
                {total} steps. {scrollDriven ? 'The sketch follows your scrolling as you read. ' : ''}
                Scroll to begin <span aria-hidden="true">↓</span>
              </p>
            )}
          </div>
        </header>

        {steps.map((step, index) => renderStep(step, index + 1))}

        {about.more && (
          <div data-reveal className="my-[20vh] border-l-2 border-white/40 pl-4">
            <p className={eyebrowClassName}>Next</p>
            <p className="mt-1 text-lg font-semibold text-white">{about.more.title}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-zinc-300">
              The remaining steps are shared by every sketch in this family.
            </p>
          </div>
        )}

        {sharedSteps.map((step, index) => renderStep(step, steps.length + index + 1))}

        {about.tryThis.length > 0 && (
          <section data-reveal data-step={total + 1} aria-labelledby="try-title" className={`${cardClassName} my-[26vh]`}>
            <p className={eyebrowClassName}>Your turn</p>
            <h2 id="try-title" className="mt-1.5 text-xl font-semibold text-white">
              Try changing
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-zinc-200">
              {about.tryThis.map((item, index) => (
                <li key={index}>
                  <MathText text={item} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {about.symbols.length > 0 && (
          <section data-reveal data-step={total + 1} aria-labelledby="symbols-title" className={`${cardClassName} my-[18vh]`}>
            <p className={eyebrowClassName}>Reference</p>
            <h2 id="symbols-title" className="mt-1.5 text-xl font-semibold text-white">
              Symbols
            </h2>
            <div className="mt-3 space-y-2 text-[13.5px] leading-relaxed text-zinc-300">
              {about.symbols.map((line, index) => (
                <MathText key={index} text={line} />
              ))}
            </div>
          </section>
        )}

        <footer data-reveal className="mb-[22vh] mt-[18vh] grid grid-cols-2 gap-3">
          <Link href={`/sketches/${previous.id}/`} className={`${cardClassName} transition-colors hover:border-white/40`}>
            <span className={eyebrowClassName}>← Previous</span>
            <span className="mt-1 block text-[15px] font-semibold text-white">{previous.name}</span>
          </Link>
          <Link
            href={`/sketches/${next.id}/`}
            className={`${cardClassName} text-right transition-colors hover:border-white/40`}
          >
            <span className={eyebrowClassName}>Next →</span>
            <span className="mt-1 block text-[15px] font-semibold text-white">{next.name}</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
