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
import * as eclipseWeave from './eclipseWeave';

export interface Sketch {
  name: string;
  description: string;
  sim: string;    // Simulation fragment shader source
  final: string;  // Final/composite fragment shader source
  includeInSlideshow?: boolean;
  meta?: {
    attribution?: string;
  };
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

  event2: {
    name: 'Event 2',
    description: 'Dense oscillatory field with warped feedback sampling',
    sim: event2.sim,
    final: event2.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  rocaille: {
    name: 'Rocaille',
    description: 'Layered trigonometric filigree with spatial phase offsets',
    sim: rocaille.sim,
    final: rocaille.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
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
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  cathedralMist: {
    name: 'Cathedral Mist',
    description: 'Volumetric cosine folds with refracted inner turbulence',
    sim: cathedralMist.sim,
    final: cathedralMist.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  eventideHelix: {
    name: 'Eventide Helix',
    description: 'Stepped oscillatory field with sine-warped feedback trails',
    sim: eventideHelix.sim,
    final: eventideHelix.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  emberArray: {
    name: 'Ember Array',
    description: 'Dense orbital fold cloud with chromatic ray accumulation',
    sim: emberArray.sim,
    final: emberArray.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  silkSpindle: {
    name: 'Silk Spindle',
    description: 'Cross-product drift lattice disturbed by quantized cosine pulses',
    sim: silkSpindle.sim,
    final: silkSpindle.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  axialChoir: {
    name: 'Axial Choir',
    description: 'Rotated ray bundle with anisotropic depth and harmonic tinting',
    sim: axialChoir.sim,
    final: axialChoir.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  prismTangle: {
    name: 'Prism Tangle',
    description: 'Rounded fold filigree with radial prism-like grading',
    sim: prismTangle.sim,
    final: prismTangle.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  noctilucentArc: {
    name: 'Noctilucent Arc',
    description: 'Phase-shifted shell growth with sinusoidal volumetric trails',
    sim: noctilucentArc.sim,
    final: noctilucentArc.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },
  furnaceMire: {
    name: 'Furnace Mire',
    description: 'Chaotic folded plasma with rounded-step harmonic diffusion',
    sim: furnaceMire.sim,
    final: furnaceMire.final,
    meta: {
      attribution: 'Adapted from sketch by @XorDev',
    },
  },

  eclipseWeave: {
    name: 'Eclipse Weave',
    description: 'Interlaced corona rings and umbral cores orbiting the cursor',
    sim: eclipseWeave.sim,
    final: eclipseWeave.final,
  },


};

export const sketchIds = Object.keys(sketches);
export const slideshowSketchIds = sketchIds.filter((id) => sketches[id].includeInSlideshow !== false);
export const defaultSketchId = 'ripple';

export function getSketch(id: string): Sketch {
  return sketches[id] || sketches[defaultSketchId];
}
