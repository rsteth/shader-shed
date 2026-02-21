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
import * as eclipseWeave from './eclipseWeave';
import * as sdfTwistedLinks from './sdfTwistedLinks';
import * as sdfGyroidPulse from './sdfGyroidPulse';
import * as sdfMengerBloom from './sdfMengerBloom';
import * as sdfOrbitalBlobs from './sdfOrbitalBlobs';
import * as sdfCappedColumns from './sdfCappedColumns';
import * as sdfKnotTunnel from './sdfKnotTunnel';
import * as aizawaSpiralNest from './aizawaSpiralNest';
import * as aizawaTwinOrbit from './aizawaTwinOrbit';
import * as aizawaInkMap from './aizawaInkMap';
import * as aizawaPhaseField from './aizawaPhaseField';
import * as sdfAizawaFilament from './sdfAizawaFilament';
import * as sdfAizawaRelief from './sdfAizawaRelief';

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
  eclipseWeave: {
    name: 'Eclipse Weave',
    description: 'Interlaced corona rings and umbral cores orbiting the cursor',
    sim: eclipseWeave.sim,
    final: eclipseWeave.final,
  },
  sdfTwistedLinks: {
    name: 'SDF Twisted Links',
    description: 'Raymarched chain-like torus links with orbital twist',
    sim: sdfTwistedLinks.sim,
    final: sdfTwistedLinks.final,
    includeInSlideshow: false,
  },
  sdfGyroidPulse: {
    name: 'SDF Gyroid Pulse',
    description: 'Oscillating gyroid shell with neon cavity lighting',
    sim: sdfGyroidPulse.sim,
    final: sdfGyroidPulse.final,
    includeInSlideshow: false,
  },
  sdfMengerBloom: {
    name: 'SDF Menger Bloom',
    description: 'Fractal-inspired box lattice with blooming cavities',
    sim: sdfMengerBloom.sim,
    final: sdfMengerBloom.final,
    includeInSlideshow: false,
  },
  sdfOrbitalBlobs: {
    name: 'SDF Orbital Blobs',
    description: 'Metaball cluster of orbiting blobs and glossy highlights',
    sim: sdfOrbitalBlobs.sim,
    final: sdfOrbitalBlobs.final,
    includeInSlideshow: false,
  },
  sdfCappedColumns: {
    name: 'SDF Capped Columns',
    description: 'Repeating stone columns and arches in a raymarched hall',
    sim: sdfCappedColumns.sim,
    final: sdfCappedColumns.final,
    includeInSlideshow: false,
  },
  sdfKnotTunnel: {
    name: 'SDF Knot Tunnel',
    description: 'Interlocked torus knots repeating down a tunnel',
    sim: sdfKnotTunnel.sim,
    final: sdfKnotTunnel.final,
    includeInSlideshow: false,
  },
  aizawaSpiralNest: {
    name: 'Aizawa Spiral Nest',
    description: '3D-perspective ribbon from the Aizawa strange attractor',
    sim: aizawaSpiralNest.sim,
    final: aizawaSpiralNest.final,
  },
  aizawaTwinOrbit: {
    name: 'Aizawa Twin Orbit',
    description: 'Mirrored attractor threads with offset parameter drift',
    sim: aizawaTwinOrbit.sim,
    final: aizawaTwinOrbit.final,
  },
  aizawaInkMap: {
    name: 'Aizawa Ink Map',
    description: 'Planar contour rendering inspired by inked topographic lines',
    sim: aizawaInkMap.sim,
    final: aizawaInkMap.final,
  },
  aizawaPhaseField: {
    name: 'Aizawa Phase Field',
    description: 'Flattened phase portrait with woven color interference',
    sim: aizawaPhaseField.sim,
    final: aizawaPhaseField.final,
  },
  sdfAizawaFilament: {
    name: 'SDF Aizawa Filament',
    description: 'Raymarched tubular attractor interpreted as glowing filament geometry',
    sim: sdfAizawaFilament.sim,
    final: sdfAizawaFilament.final,
  },
  sdfAizawaRelief: {
    name: 'SDF Aizawa Relief',
    description: 'Planar carved slab using attractor-driven signed-distance grooves',
    sim: sdfAizawaRelief.sim,
    final: sdfAizawaRelief.final,
  },
};

export const sketchIds = Object.keys(sketches);
export const slideshowSketchIds = sketchIds.filter((id) => sketches[id].includeInSlideshow !== false);
export const defaultSketchId = 'ripple';

export function getSketch(id: string): Sketch {
  return sketches[id] || sketches[defaultSketchId];
}
