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
import * as lapse from './lapse';
import * as firewall from './firewall';

export interface Sketch {
  name: string;
  description: string;
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
    sim: ripple.sim,
    final: ripple.final,
  },
  plasma: {
    name: 'Plasma',
    description: 'Classic plasma effect with sine waves',
    sim: plasma.sim,
    final: plasma.final,
  },
  gradient: {
    name: 'Gradient Drift',
    description: 'Smooth flowing color gradients',
    sim: gradient.sim,
    final: gradient.final,
  },
  voronoi: {
    name: 'Voronoi Cells',
    description: 'Animated cellular pattern',
    sim: voronoi.sim,
    final: voronoi.final,
  },
  lapse: {
    name: 'Lapse',
    description: 'Iterative volumetric folds translated from a compact one-liner shader',
    sim: lapse.sim,
    final: lapse.final,
  },
  firewall: {
    name: 'Firewall',
    description: 'Angular flame-like folding field translated from a compact one-liner shader',
    sim: firewall.sim,
    final: firewall.final,
  },
};

export const sketchIds = Object.keys(sketches);
export const defaultSketchId = 'ripple';

export function getSketch(id: string): Sketch {
  return sketches[id] || sketches[defaultSketchId];
}
