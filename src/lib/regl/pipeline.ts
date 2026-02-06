import regl from 'regl';
import { UniformManager } from './uniforms';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';

// Importing raw shader strings (enabled by next.config.mjs)
import commonShader from '@/shaders/common.glsl';
import frameVert from '@/shaders/frame.vert';
import simFrag from '@/shaders/sim.frag';
import finalFrag from '@/shaders/final.frag';

type ReglInstance = regl.Regl;

export class MultipassSystem {
  regl: ReglInstance;
  uniforms: UniformManager;
  caps: Caps;

  // Buffers for ping-pong (using render-target ladder)
  rt1: RenderTarget;
  rt2: RenderTarget;

  // Commands
  cmdSim: regl.DrawCommand;
  cmdFinal: regl.DrawCommand;

  // Internal state
  tickCount: number = 0;

  constructor(reglInstance: ReglInstance, uniforms: UniformManager, caps: Caps) {
    this.regl = reglInstance;
    this.uniforms = uniforms;
    this.caps = caps;

    // Initial FBO setup using render-target ladder (will be resized immediately)
    // Request linear filtering for smoother sampling
    this.rt1 = createRenderTarget(reglInstance, caps, {
      width: 1,
      height: 1,
      linear: true,
    });
    this.rt2 = createRenderTarget(reglInstance, caps, {
      width: 1,
      height: 1,
      linear: true,
    });

    // Log what render target type we got
    console.log(`[pipeline] Using RT type: ${this.rt1.type}, filter: ${this.rt1.filter}` +
      (this.rt1.fallbackFrom ? ` (fallback from: ${this.rt1.fallbackFrom.join(', ')})` : ''));

    // Prepend common code to fragment shaders
    const simSource = commonShader + '\n' + simFrag;
    const finalSource = commonShader + '\n' + finalFrag;

    // Compile commands
    this.cmdSim = this.regl({
      frag: simSource,
      vert: frameVert,
      attributes: {
        position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]]
      },
      count: 6,
      uniforms: {
        uPrevState: this.regl.prop<any, any>('inputTexture'),
        uTime: () => this.uniforms.state.uTime,
        uResolution: () => this.uniforms.state.uResolution,
        uMouse: () => this.uniforms.state.uMouse,
        uDt: () => this.uniforms.state.uDt
      },
      framebuffer: this.regl.prop<any, any>('outputFbo')
    });

    this.cmdFinal = this.regl({
      frag: finalSource,
      vert: frameVert,
      attributes: {
        position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]]
      },
      count: 6,
      uniforms: {
        uTexture: this.regl.prop<any, any>('inputTexture'),
        uTime: () => this.uniforms.state.uTime,
        uOpacity: () => this.uniforms.state.uOpacity,
        uResolution: () => this.uniforms.state.uResolution
      },
      depth: { enable: false }
    });
  }

  resize(width: number, height: number) {
    this.rt1.resize(width, height);
    this.rt2.resize(width, height);
    this.uniforms.resize(width, height);
  }

  render() {
    this.tickCount++;

    // Ping-pong logic
    const input = this.tickCount % 2 === 0 ? this.rt1 : this.rt2;
    const output = this.tickCount % 2 === 0 ? this.rt2 : this.rt1;

    // 1. Simulation Pass
    // We render into 'output', reading from 'input'
    this.cmdSim({
      inputTexture: input.colorTex,
      outputFbo: output.fbo
    });

    // 2. Final Composite Pass to Screen
    // We read from 'output' (the result of sim) and render to default framebuffer (null)
    this.cmdFinal({
      inputTexture: output.colorTex
    });
  }

  dispose() {
    this.rt1.destroy();
    this.rt2.destroy();
  }
}
