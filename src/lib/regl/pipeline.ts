import regl from 'regl';
import { UniformManager } from './uniforms';

// Importing raw shader strings (enabled by next.config.mjs)
import commonShader from '@/shaders/common.glsl';
import frameVert from '@/shaders/frame.vert';
import simFrag from '@/shaders/sim.frag';
import finalFrag from '@/shaders/final.frag';

type ReglInstance = regl.Regl;

export class MultipassSystem {
  regl: ReglInstance;
  uniforms: UniformManager;
  
  // Buffers for ping-pong
  fbo1: regl.Framebuffer2D;
  fbo2: regl.Framebuffer2D;
  
  // Commands
  cmdSim: regl.DrawCommand;
  cmdFinal: regl.DrawCommand;
  
  // Internal state
  tickCount: number = 0;

  constructor(reglInstance: ReglInstance, uniforms: UniformManager) {
    this.regl = reglInstance;
    this.uniforms = uniforms;

    // Initial FBO setup (will be resized immediately)
    this.fbo1 = this.regl.framebuffer({
        color: this.regl.texture({ width: 1, height: 1, min: 'linear', mag: 'linear', type: 'float' }),
        depth: false,
        stencil: false
    });
    this.fbo2 = this.regl.framebuffer({
        color: this.regl.texture({ width: 1, height: 1, min: 'linear', mag: 'linear', type: 'float' }),
        depth: false,
        stencil: false
    });

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
    this.fbo1.resize(width, height);
    this.fbo2.resize(width, height);
    this.uniforms.resize(width, height);
  }

  render() {
    this.tickCount++;
    
    // Ping-pong logic
    const input = this.tickCount % 2 === 0 ? this.fbo1 : this.fbo2;
    const output = this.tickCount % 2 === 0 ? this.fbo2 : this.fbo1;

    // 1. Simulation Pass
    // We render into 'output', reading from 'input'
    this.cmdSim({
      inputTexture: input,
      outputFbo: output
    });

    // 2. Final Composite Pass to Screen
    // We read from 'output' (the result of sim) and render to default framebuffer (null)
    this.cmdFinal({
      inputTexture: output
    });
  }

  dispose() {
    this.fbo1.destroy();
    this.fbo2.destroy();
    // Commands usually don't need explicit destroy in regl, but resources do
  }
}
