/**
 * SHADER SKETCHES REGISTRY
 * ========================
 *
 * This module provides isolated shader sketches that can be easily swapped.
 * Each sketch is a pair of simulation + final fragment shaders.
 *
 * HOW TO ADD A NEW SKETCH:
 * 1. Create your simulation shader in this folder (e.g., mysketch.sim.ts)
 * 2. Create your final/composite shader (e.g., mysketch.final.ts)
 * 3. Import them here and add to the `sketches` object
 * 4. That's it! The sketch will appear in the UI automatically.
 *
 * SHADER CONVENTIONS:
 * - common.glsl is automatically prepended (provides noise, fbm, random functions)
 * - Use GLSL ES 3.0 syntax (in/out, texture() not texture2D)
 * - Available uniforms in sim: uPrevState, uTime, uResolution, uMouse, uDt
 * - Available uniforms in final: uTexture, uTime, uOpacity, uResolution
 */

// Import all sketches
import * as ripple from './ripple';
import * as plasma from './plasma';
import * as gradient from './gradient';
import * as voronoi from './voronoi';
import * as rocaille2 from './rocaille2';
import * as rocaille from './rocaille';
import * as event2 from './event2';
import * as rocailleGlitch from './rocailleGlitch';
import * as rocaille2Glitch from './rocaille2Glitch';
import * as cathedralMist from './cathedralMist';
import * as eventideHelix from './eventideHelix';
import * as emberArray from './emberArray';
import * as silkSpindle from './silkSpindle';
import * as axialChoir from './axialChoir';
import * as prismTangle from './prismTangle';
import * as noctilucentArc from './noctilucentArc';
import * as furnaceMire from './furnaceMire';

export interface Sketch {
  name: string;
  description: string;
  includeInSlideshow?: boolean;
  sim: string;    // Simulation fragment shader source
  final: string;  // Final/composite fragment shader source
}

/**
 * All available sketches.
 * Add new sketches here - they'll automatically appear in the UI.
 */
export const sketches: Record<string, Sketch> = {
  ripple: {
    name: 'Ripple Flow',
    description: 'Interactive fluid ripples with curl noise',
    includeInSlideshow: false,
    sim: ripple.sim,
    final: ripple.final,
  },
  plasma: {
    name: 'Plasma',
    description: 'Classic plasma effect with sine waves',
    includeInSlideshow: false,
    sim: plasma.sim,
    final: plasma.final,
  },
  gradient: {
    name: 'Gradient Drift',
    description: 'Smooth flowing color gradients',
    includeInSlideshow: false,
    sim: gradient.sim,
    final: gradient.final,
  },
  voronoi: {
    name: 'Voronoi Cells',
    description: 'Animated cellular pattern',
    includeInSlideshow: false,
    sim: voronoi.sim,
    final: voronoi.final,
  },

  event2: {
    name: 'Event 2',
    description: 'Dense oscillatory field with warped feedback sampling',
    sim: event2.sim,
    final: event2.final,
  },
  rocaille: {
    name: 'Rocaille',
    description: 'Layered trigonometric filigree with spatial phase offsets',
    sim: rocaille.sim,
    final: rocaille.final,
  },

  rocailleGlitch: {
    name: 'Rocaille Glitch',
    description: 'Rocaille filigree remixed with Event 2-style quantized warping and feedback',
    sim: rocailleGlitch.sim,
    final: rocailleGlitch.final,
  },

  rocaille2Glitch: {
    name: 'Rocaille 2 Glitch',
    description: 'Rocaille 2 filigree remixed with Event 2-style stepped warping and feedback',
    sim: rocaille2Glitch.sim,
    final: rocaille2Glitch.final,
  },
  rocaille2: {
    name: 'Rocaille 2',
    description: 'Rocaille variant without resolution phase offset in the inner loop',
    sim: rocaille2.sim,
    final: rocaille2.final,
  },
  cathedralMist: {
    name: 'Cathedral Mist',
    description: 'Volumetric cosine folds with refracted inner turbulence',
    sim: cathedralMist.sim,
    final: cathedralMist.final,
  },
  eventideHelix: {
    name: 'Eventide Helix',
    description: 'Stepped oscillatory field with sine-warped feedback trails',
    sim: eventideHelix.sim,
    final: eventideHelix.final,
  },
  emberArray: {
    name: 'Ember Array',
    description: 'Dense orbital fold cloud with chromatic ray accumulation',
    sim: emberArray.sim,
    final: emberArray.final,
  },
  silkSpindle: {
    name: 'Silk Spindle',
    description: 'Cross-product drift lattice disturbed by quantized cosine pulses',
    sim: silkSpindle.sim,
    final: silkSpindle.final,
  },
  axialChoir: {
    name: 'Axial Choir',
    description: 'Rotated ray bundle with anisotropic depth and harmonic tinting',
    sim: axialChoir.sim,
    final: axialChoir.final,
  },
  prismTangle: {
    name: 'Prism Tangle',
    description: 'Rounded fold filigree with radial prism-like grading',
    sim: prismTangle.sim,
    final: prismTangle.final,
  },
  noctilucentArc: {
    name: 'Noctilucent Arc',
    description: 'Phase-shifted shell growth with sinusoidal volumetric trails',
    sim: noctilucentArc.sim,
    final: noctilucentArc.final,
  },
  furnaceMire: {
    name: 'Furnace Mire',
    description: 'Chaotic folded plasma with rounded-step harmonic diffusion',
    sim: furnaceMire.sim,
    final: furnaceMire.final,
  },
};

export const sketchIds = Object.keys(sketches);
export const slideshowSketchIds = sketchIds.filter((id) => sketches[id]?.includeInSlideshow !== false);
export const defaultSketchId = 'ripple';

export function getSketch(id: string): Sketch {
  return sketches[id] || sketches[defaultSketchId];
}
