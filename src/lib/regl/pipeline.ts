import regl from 'regl';
import { UniformManager } from './uniforms';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';
import { createPingPongTarget, type PingPongTarget } from './pingpong';

// Importing common shader utilities
import commonShader from '@/shaders/common.glsl';
import frameVert from '@/shaders/frame.vert';

// Default sketches for backwards compatibility
import { getSketch, defaultSketchId, type Sketch, isFluidSketch } from '@/shaders/sketches';

import metricShader from '@/shaders/fluid/metric.glsl';
import renderSolid from '@/shaders/fluid/render-solid.glsl';
import renderLines from '@/shaders/fluid/render-lines.glsl';

type ReglInstance = regl.Regl;

type FluidCommands = {
  force: regl.DrawCommand;
  advectVel: regl.DrawCommand;
  injectDye: regl.DrawCommand;
  advectDye: regl.DrawCommand;
  render: regl.DrawCommand;
};

export class MultipassSystem {
  regl: ReglInstance;
  uniforms: UniformManager;
  caps: Caps;

  // Buffers for ping-pong (using render-target ladder)
  rt1: RenderTarget;
  rt2: RenderTarget;

  // Commands
  cmdSim: regl.DrawCommand | null = null;
  cmdFinal: regl.DrawCommand | null = null;
  cmdFluid: FluidCommands | null = null;

  // Current sketch
  currentSketchId: string;
  currentPipeline: 'single' | 'fluid' = 'single';

  // Internal state
  tickCount: number = 0;

  // Fluid sim resources
  velPingPong: PingPongTarget | null = null;
  dyePingPong: PingPongTarget | null = null;
  optionsTex: regl.Texture2D | null = null;
  simResolution: [number, number] = [1, 1];

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
    this.configureForSketch(sketch);
  }

  /**
   * Create the simulation pass command from sketch shaders
   */
  private createSimCommand(sketch: Sketch): regl.DrawCommand {
    if (isFluidSketch(sketch)) {
      throw new Error('[pipeline] createSimCommand called with fluid sketch');
    }
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
    if (isFluidSketch(sketch)) {
      throw new Error('[pipeline] createFinalCommand called with fluid sketch');
    }
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

  private buildShaderSource(...parts: string[]): string {
    return [commonShader, ...parts].join('\n');
  }

  private ensureFluidResources() {
    if (!this.velPingPong) {
      this.velPingPong = createPingPongTarget(this.regl, this.caps, {
        width: this.simResolution[0],
        height: this.simResolution[1],
        linear: true,
      });
    }

    if (!this.dyePingPong) {
      this.dyePingPong = createPingPongTarget(this.regl, this.caps, {
        width: this.simResolution[0],
        height: this.simResolution[1],
        linear: true,
      });
    }

    if (!this.optionsTex) {
      const width = 128;
      const height = 128 * 3;
      const data = new Uint8Array(width * height * 4);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const slice = Math.floor(y / 128);
          const u = x / (width - 1);
          const v = (y % 128) / 127;
          data[idx] = Math.floor(255 * u);
          data[idx + 1] = Math.floor(255 * v);
          data[idx + 2] = Math.floor(255 * (slice / 2));
          data[idx + 3] = Math.floor(255 * (1.0 - u * v));
        }
      }
      this.optionsTex = this.regl.texture({
        width,
        height,
        data,
        wrap: 'clamp',
        min: 'linear',
        mag: 'linear',
      });
      this.uniforms.state.uOptionsTexSize = [width, height];
    }
  }

  private createFluidCommands(passes: {
    force: string;
    advectVel: string;
    injectDye: string;
    advectDye: string;
    render: string;
  }): FluidCommands {
    const simUniforms = {
      uTime: () => this.uniforms.state.uTime,
      uDt: () => this.uniforms.state.uDt,
      uSimResolution: () => this.uniforms.state.uSimResolution,
      uForce: () => this.uniforms.state.uForce,
      uDamp: () => this.uniforms.state.uDamp,
      uInject: () => this.uniforms.state.uInject,
      uFade: () => this.uniforms.state.uFade,
      uPaletteBias: () => this.uniforms.state.uPaletteBias,
      uSnap: () => this.uniforms.state.uSnap,
      uMetricMode: () => this.uniforms.state.uMetricMode,
      uOptionsTexEnabled: () => this.uniforms.state.uOptionsTexEnabled,
      uOptionsTexSize: () => this.uniforms.state.uOptionsTexSize,
      uOptionsTex: () => this.optionsTex,
    };

    const forceSource = this.buildShaderSource(metricShader, passes.force);
    const advectVelSource = this.buildShaderSource(metricShader, passes.advectVel);
    const injectDyeSource = this.buildShaderSource(metricShader, passes.injectDye);
    const advectDyeSource = this.buildShaderSource(metricShader, passes.advectDye);
    const renderSource = this.buildShaderSource(metricShader, renderSolid, renderLines, passes.render);

    return {
      force: this.regl({
        frag: forceSource,
        vert: frameVert,
        attributes: {
          position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]],
        },
        count: 6,
        uniforms: {
          ...simUniforms,
          uVelocity: this.regl.prop<any, any>('velocityTex'),
        },
        framebuffer: this.regl.prop<any, any>('outputFbo'),
      }),
      advectVel: this.regl({
        frag: advectVelSource,
        vert: frameVert,
        attributes: {
          position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]],
        },
        count: 6,
        uniforms: {
          ...simUniforms,
          uVelocity: this.regl.prop<any, any>('velocityTex'),
        },
        framebuffer: this.regl.prop<any, any>('outputFbo'),
      }),
      injectDye: this.regl({
        frag: injectDyeSource,
        vert: frameVert,
        attributes: {
          position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]],
        },
        count: 6,
        uniforms: {
          ...simUniforms,
          uDye: this.regl.prop<any, any>('dyeTex'),
        },
        framebuffer: this.regl.prop<any, any>('outputFbo'),
      }),
      advectDye: this.regl({
        frag: advectDyeSource,
        vert: frameVert,
        attributes: {
          position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]],
        },
        count: 6,
        uniforms: {
          ...simUniforms,
          uDye: this.regl.prop<any, any>('dyeTex'),
          uVelocity: this.regl.prop<any, any>('velocityTex'),
        },
        framebuffer: this.regl.prop<any, any>('outputFbo'),
      }),
      render: this.regl({
        frag: renderSource,
        vert: frameVert,
        attributes: {
          position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]],
        },
        count: 6,
        uniforms: {
          uDye: this.regl.prop<any, any>('dyeTex'),
          uVelocity: this.regl.prop<any, any>('velocityTex'),
          uMode: () => this.uniforms.state.uMode,
          uOpacity: () => this.uniforms.state.uOpacity,
          uLineDensity: () => this.uniforms.state.uLineDensity,
          uLineSharpness: () => this.uniforms.state.uLineSharpness,
          uDebug: () => this.uniforms.state.uDebug,
          uTime: () => this.uniforms.state.uTime,
          uSimResolution: () => this.uniforms.state.uSimResolution,
          uOptionsTexEnabled: () => this.uniforms.state.uOptionsTexEnabled,
          uOptionsTexSize: () => this.uniforms.state.uOptionsTexSize,
          uSnap: () => this.uniforms.state.uSnap,
          uMetricMode: () => this.uniforms.state.uMetricMode,
          uOptionsTex: () => this.optionsTex,
        },
        depth: { enable: false },
      }),
    };
  }

  private configureForSketch(sketch: Sketch) {
    if (isFluidSketch(sketch)) {
      this.currentPipeline = 'fluid';
      const [width, height] = this.uniforms.state.uResolution;
      const { simWidth, simHeight } = this.computeSimResolution(width, height);
      this.simResolution = [simWidth, simHeight];
      this.uniforms.state.uSimResolution = [simWidth, simHeight];
      this.ensureFluidResources();
      this.velPingPong?.resize(this.simResolution[0], this.simResolution[1]);
      this.dyePingPong?.resize(this.simResolution[0], this.simResolution[1]);
      this.cmdFluid = this.createFluidCommands(sketch.passes);
    } else {
      this.currentPipeline = 'single';
      this.cmdFluid = null;
      this.cmdSim = this.createSimCommand(sketch);
      this.cmdFinal = this.createFinalCommand(sketch);
    }
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
    this.configureForSketch(sketch);
    this.currentSketchId = sketchId;

    // Clear render targets to avoid ghosting from previous sketch
    if (this.currentPipeline === 'fluid') {
      this.clearFluidTargets();
    } else {
      this.clearTargets();
    }
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

    if (this.currentPipeline === 'fluid') {
      const { simWidth, simHeight } = this.computeSimResolution(width, height);
      this.simResolution = [simWidth, simHeight];
      this.uniforms.state.uSimResolution = [simWidth, simHeight];
      this.velPingPong?.resize(simWidth, simHeight);
      this.dyePingPong?.resize(simWidth, simHeight);
    }
  }

  private computeSimResolution(width: number, height: number) {
    const maxDim = Math.max(width, height);
    const targetMax = Math.min(1024, Math.max(512, Math.floor(maxDim * 0.55)));
    const aspect = width / height;
    const simWidth = aspect >= 1 ? targetMax : Math.floor(targetMax * aspect);
    const simHeight = aspect >= 1 ? Math.floor(targetMax / aspect) : targetMax;
    return { simWidth, simHeight };
  }

  render() {
    this.tickCount++;

    if (this.currentPipeline === 'fluid' && this.cmdFluid && this.velPingPong && this.dyePingPong) {
      const velocity = this.velPingPong;
      const dye = this.dyePingPong;

      // A) FORCE pass
      this.cmdFluid.force({
        velocityTex: velocity.read.colorTex,
        outputFbo: velocity.write.fbo,
      });
      velocity.swap();

      // B) ADVECT_VEL pass
      this.cmdFluid.advectVel({
        velocityTex: velocity.read.colorTex,
        outputFbo: velocity.write.fbo,
      });
      velocity.swap();

      // C) INJECT_DYE pass
      this.cmdFluid.injectDye({
        dyeTex: dye.read.colorTex,
        outputFbo: dye.write.fbo,
      });
      dye.swap();

      // D) ADVECT_DYE pass
      this.cmdFluid.advectDye({
        dyeTex: dye.read.colorTex,
        velocityTex: velocity.read.colorTex,
        outputFbo: dye.write.fbo,
      });
      dye.swap();

      // Final render
      this.cmdFluid.render({
        dyeTex: dye.read.colorTex,
        velocityTex: velocity.read.colorTex,
      });
      return;
    }

    // Ping-pong logic
    const input = this.tickCount % 2 === 0 ? this.rt1 : this.rt2;
    const output = this.tickCount % 2 === 0 ? this.rt2 : this.rt1;

    // 1. Simulation Pass
    // We render into 'output', reading from 'input'
    this.cmdSim?.({
      inputTexture: input.colorTex,
      outputFbo: output.fbo
    });

    // 2. Final Composite Pass to Screen
    // We read from 'output' (the result of sim) and render to default framebuffer (null)
    this.cmdFinal?.({
      inputTexture: output.colorTex
    });
  }

  private clearFluidTargets() {
    if (!this.velPingPong || !this.dyePingPong) return;
    this.regl({ framebuffer: this.velPingPong.read.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
    });
    this.regl({ framebuffer: this.velPingPong.write.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
    });
    this.regl({ framebuffer: this.dyePingPong.read.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
    });
    this.regl({ framebuffer: this.dyePingPong.write.fbo })(() => {
      this.regl.clear({ color: [0, 0, 0, 0] });
    });
  }

  dispose() {
    this.rt1.destroy();
    this.rt2.destroy();
    this.velPingPong?.destroy();
    this.dyePingPong?.destroy();
    this.optionsTex?.destroy();
  }
}
