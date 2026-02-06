import regl from 'regl';
import { UniformManager } from './uniforms';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';

// Importing common shader utilities
import commonShader from '@/shaders/common.glsl';
import frameVert from '@/shaders/frame.vert';

// Default sketches for backwards compatibility
import { getSketch, defaultSketchId, type Sketch } from '@/shaders/sketches';

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

  // Current sketch
  currentSketchId: string;

  // Internal state
  tickCount: number = 0;

  constructor(
    reglInstance: ReglInstance,
    uniforms: UniformManager,
    caps: Caps,
    initialSketchId: string = defaultSketchId
  ) {
    this.regl = reglInstance;
    this.uniforms = uniforms;
    this.caps = caps;
    this.currentSketchId = initialSketchId;

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

    // Compile initial commands
    const sketch = getSketch(initialSketchId);
    this.cmdSim = this.createSimCommand(sketch);
    this.cmdFinal = this.createFinalCommand(sketch);
  }

  /**
   * Create the simulation pass command from sketch shaders
   */
  private createSimCommand(sketch: Sketch): regl.DrawCommand {
    const simSource = commonShader + '\n' + sketch.sim;

    return this.regl({
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
  }

  /**
   * Create the final composite pass command from sketch shaders
   */
  private createFinalCommand(sketch: Sketch): regl.DrawCommand {
    const finalSource = commonShader + '\n' + sketch.final;

    return this.regl({
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

  /**
   * Switch to a different sketch by ID.
   * Recompiles shaders and clears the render targets.
   */
  setSketch(sketchId: string) {
    if (sketchId === this.currentSketchId) return;

    const sketch = getSketch(sketchId);
    console.log(`[pipeline] Switching to sketch: ${sketch.name}`);

    // Recompile commands
    this.cmdSim = this.createSimCommand(sketch);
    this.cmdFinal = this.createFinalCommand(sketch);
    this.currentSketchId = sketchId;

    // Clear render targets to avoid ghosting from previous sketch
    this.clearTargets();
  }

  /**
   * Clear both render targets
   */
  clearTargets() {
    this.regl({ framebuffer: this.rt1.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
    });
    this.regl({ framebuffer: this.rt2.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
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
