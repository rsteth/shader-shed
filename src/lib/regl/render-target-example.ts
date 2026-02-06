/**
 * Example: Multipass ping-pong setup using the render-target ladder
 *
 * This demonstrates:
 * - Initializing regl with capability detection
 * - Creating ping-pong render targets with automatic format selection
 * - Running a simulation pass that writes to one buffer while reading the other
 * - Swapping buffers each frame
 */

import {
  createReglWithCaps,
  createRenderTarget,
  printCapsReport,
  getCapsOneLiner,
  type RenderTarget,
  type Caps,
} from './render-target';
import type regl from 'regl';

// Simple fullscreen quad vertex shader
const QUAD_VERT = `
precision highp float;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Simulation fragment shader (example: simple diffusion/blur)
const SIM_FRAG = `
precision highp float;
uniform sampler2D uPrevState;
uniform vec2 uResolution;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 texel = 1.0 / uResolution;

  // Sample neighbors for simple blur/diffusion
  vec4 center = texture2D(uPrevState, vUv);
  vec4 left   = texture2D(uPrevState, vUv - vec2(texel.x, 0.0));
  vec4 right  = texture2D(uPrevState, vUv + vec2(texel.x, 0.0));
  vec4 up     = texture2D(uPrevState, vUv + vec2(0.0, texel.y));
  vec4 down   = texture2D(uPrevState, vUv - vec2(0.0, texel.y));

  // Diffusion step
  vec4 avg = (center * 0.5 + left * 0.125 + right * 0.125 + up * 0.125 + down * 0.125);

  // Add some noise/stimulus at mouse position or center
  vec2 centerPos = vec2(0.5);
  float dist = length(vUv - centerPos);
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  float stimulus = smoothstep(0.1, 0.0, dist) * pulse * 0.02;

  gl_FragColor = avg + vec4(stimulus, stimulus * 0.5, stimulus * 0.2, 0.0);
}
`;

// Final composite shader (renders to screen)
const FINAL_FRAG = `
precision highp float;
uniform sampler2D uTexture;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color.rgb, color.a * uOpacity);
}
`;

// Fullscreen quad geometry
const QUAD_POSITIONS: [number, number][] = [
  [-1, -1], [1, -1], [-1, 1],
  [-1, 1], [1, -1], [1, 1]
];

interface PingPongBuffers {
  rt1: RenderTarget;
  rt2: RenderTarget;
  current: 0 | 1;
}

interface SimulationState {
  time: number;
  resolution: [number, number];
}

/**
 * Example multipass system using the render-target ladder.
 */
export class MultipassExample {
  private regl: regl.Regl;
  private caps: Caps;
  private buffers: PingPongBuffers;
  private state: SimulationState;

  private cmdSim: regl.DrawCommand;
  private cmdFinal: regl.DrawCommand;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize regl with capability detection
    const { regl, caps } = createReglWithCaps({
      canvas,
      preferWebGL2: true,
      attributes: {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      },
    });

    this.regl = regl;
    this.caps = caps;

    // Print capabilities for debugging
    printCapsReport(caps);
    console.log(`[example] One-liner: ${getCapsOneLiner(caps)}`);

    // Initial resolution
    const width = canvas.width || 512;
    const height = canvas.height || 512;

    this.state = {
      time: 0,
      resolution: [width, height],
    };

    // Create ping-pong render targets
    // Request linear filtering for smoother sampling
    const rt1 = createRenderTarget(regl, caps, {
      width,
      height,
      linear: true,
    });

    const rt2 = createRenderTarget(regl, caps, {
      width,
      height,
      linear: true,
    });

    this.buffers = { rt1, rt2, current: 0 };

    // Log what we got
    console.log(`[example] RT1: type=${rt1.type}, filter=${rt1.filter}` +
      (rt1.fallbackFrom ? `, fallbackFrom=[${rt1.fallbackFrom.join(',')}]` : ''));
    console.log(`[example] RT2: type=${rt2.type}, filter=${rt2.filter}` +
      (rt2.fallbackFrom ? `, fallbackFrom=[${rt2.fallbackFrom.join(',')}]` : ''));

    // Create simulation command
    this.cmdSim = regl({
      frag: SIM_FRAG,
      vert: QUAD_VERT,
      attributes: {
        position: QUAD_POSITIONS,
      },
      count: 6,
      uniforms: {
        uPrevState: regl.prop<{ inputTexture: regl.Texture2D }, 'inputTexture'>('inputTexture'),
        uTime: () => this.state.time,
        uResolution: () => this.state.resolution,
      },
      framebuffer: regl.prop<{ outputFbo: regl.Framebuffer2D }, 'outputFbo'>('outputFbo'),
      depth: { enable: false },
    });

    // Create final composite command
    this.cmdFinal = regl({
      frag: FINAL_FRAG,
      vert: QUAD_VERT,
      attributes: {
        position: QUAD_POSITIONS,
      },
      count: 6,
      uniforms: {
        uTexture: regl.prop<{ inputTexture: regl.Texture2D }, 'inputTexture'>('inputTexture'),
        uOpacity: 1.0,
      },
      depth: { enable: false },
    });
  }

  /**
   * Resize render targets.
   */
  resize(width: number, height: number): void {
    this.state.resolution = [width, height];
    this.buffers.rt1.fbo.resize(width, height);
    this.buffers.rt2.fbo.resize(width, height);
  }

  /**
   * Render one frame.
   */
  render(dt: number): void {
    this.state.time += dt;

    // Get input/output for this frame
    const input = this.buffers.current === 0 ? this.buffers.rt1 : this.buffers.rt2;
    const output = this.buffers.current === 0 ? this.buffers.rt2 : this.buffers.rt1;

    // Simulation pass: read from input, write to output
    this.cmdSim({
      inputTexture: input.colorTex,
      outputFbo: output.fbo,
    });

    // Final pass: render output to screen
    this.cmdFinal({
      inputTexture: output.colorTex,
    });

    // Swap buffers
    this.buffers.current = this.buffers.current === 0 ? 1 : 0;
  }

  /**
   * Get current capabilities.
   */
  getCaps(): Caps {
    return this.caps;
  }

  /**
   * Clean up resources.
   */
  dispose(): void {
    this.buffers.rt1.fbo.destroy();
    this.buffers.rt1.colorTex.destroy();
    this.buffers.rt2.fbo.destroy();
    this.buffers.rt2.colorTex.destroy();
    this.regl.destroy();
  }
}

/**
 * Quick start function for testing.
 */
export function runExample(canvas: HTMLCanvasElement): () => void {
  const example = new MultipassExample(canvas);

  let lastTime = performance.now();
  let animationId: number;

  const loop = () => {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    example.render(dt);
    animationId = requestAnimationFrame(loop);
  };

  // Handle resize
  const handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      example.resize(width, height);
    }
  };

  // Initial resize
  handleResize();
  window.addEventListener('resize', handleResize);

  // Start loop
  animationId = requestAnimationFrame(loop);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    example.dispose();
  };
}
