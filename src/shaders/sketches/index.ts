/**
 * SHADER SKETCHES REGISTRY
 * ========================
 *
 * Every sketch the app can show. A sketch is a pair of fragment shaders (`sim` + `final`)
 * plus optional `defines` and `textures`; see ./types.ts for the full contract.
 *
 * HOW TO ADD A SKETCH
 * 1. Create `mySketch.ts` in this folder exporting `sim` and `final` GLSL strings
 *    (copy gradient.ts for a minimal starting point).
 * 2. Import it here and add an entry to `sketches`.
 * 3. Add an explanation in src/app/sketchAbout.ts (idea, steps, things to try). Without
 *    one the About panel shows only the description below.
 * The sketch then appears in the selector and gets its own /sketches/<id>/ page.
 *
 * SHADER CONVENTIONS
 * - common.glsl is prepended automatically (#version, precision, PI, random, noise, fbm,
 *   smoothUnion),
 *   followed by the sketch's `defines`. Do not repeat the #version line.
 * - Write GLSL ES 3.00 (`in vec2 vUv; out vec4 fragColor;`, `texture()`). The pipeline
 *   rewrites those few constructs for WebGL1, so avoid ES 3.00-only features beyond them
 *   (integer ops, texelFetch, round, non-constant loop bounds).
 * - Both passes may declare any of: uTime, uDt, uResolution, uMouse, uMouseVelocity,
 *   uMouseActive, uScroll, uScrollVelocity, uAscii, and each texture in `textures`
 *   (as `sampler2D <name>` + `vec2 <name>Size`).
 * - sim also gets uPrevState (its own previous frame); final gets uTexture (sim's output)
 *   and uOpacity.
 */

// Import all sketches
import * as ripple from './ripple';
import * as plasma from './plasma';
import * as gradient from './gradient';
import * as voronoi from './voronoi';
import * as eclipseWeave from './eclipseWeave';
import * as sdfOrbitalBlobs from './sdfOrbitalBlobs';
import { slitBandSketches } from './slitBands';
import type { Sketch } from './types';

export type { Sketch, TextureSource } from './types';

/**
 * All available sketches.
 * Add new sketches here - they'll automatically appear in the UI.
 */
export const sketches: Record<string, Sketch> = {
  ripple: {
    name: 'Ripple Flow',
    description: 'Feedback trails smeared along drifting noise',
    sim: ripple.sim,
    final: ripple.final,
    includeInSlideshow: false,
  },
  plasma: {
    name: 'Plasma',
    description: 'Classic plasma effect with sine waves',
    sim: plasma.sim,
    final: plasma.final,
    includeInSlideshow: false,
  },
  gradient: {
    name: 'Gradient Drift',
    description: 'Smooth flowing color gradients',
    sim: gradient.sim,
    final: gradient.final,
    includeInSlideshow: false,
  },
  voronoi: {
    name: 'Voronoi Cells',
    description: 'Animated cellular pattern',
    sim: voronoi.sim,
    final: voronoi.final,
    includeInSlideshow: false,
  },
  eclipseWeave: {
    name: 'Eclipse Weave',
    description: 'Earth and sky corridor fading into atmospheric haze',
    sim: eclipseWeave.sim,
    final: eclipseWeave.final,
  },
  sdfOrbitalBlobs: {
    name: 'SDF Orbital Blobs',
    description: 'Metaball cluster of orbiting blobs and glossy highlights',
    sim: sdfOrbitalBlobs.sim,
    final: sdfOrbitalBlobs.final,
    includeInSlideshow: false,
  },
  // One renderer, many sources: bouncing ball, moon, text, image, scroll-driven... see slitBands.ts
  ...slitBandSketches,
};

export const sketchIds = Object.keys(sketches);
export const scrollSketchIds = sketchIds.filter((id) => sketches[id].scrollDriven === true);
export const slideshowSketchIds = sketchIds.filter((id) => sketches[id].includeInSlideshow !== false);
export const defaultSketchId = 'ripple';

export function getSketch(id: string): Sketch {
  return sketches[id] || sketches[defaultSketchId];
}
