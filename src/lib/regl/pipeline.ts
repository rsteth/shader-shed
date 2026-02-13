import regl from 'regl';
import { UniformManager } from './uniforms';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';

// Importing common shader utilities
import commonShader from '@/shaders/common.glsl';
import frameVert from '@/shaders/frame.vert';
import asciiPostFrag from '@/shaders/asciiPost.frag';

// Default sketches for backwards compatibility
import { getSketch, defaultSketchId, type Sketch } from '@/shaders/sketches';

type ReglInstance = regl.Regl;

const ASCII_CELL_WIDTH = 10;
const ASCII_CELL_HEIGHT = 16;
const ASCII_GLYPHS = ` .'\`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`;
const ATLAS_COLUMNS = 16;

function createAsciiGlyphAtlas(reglInstance: ReglInstance): {
  texture: regl.Texture2D;
  atlasGrid: [number, number];
  glyphCount: number;
} {
  const glyphCount = ASCII_GLYPHS.length;
  const rows = Math.ceil(glyphCount / ATLAS_COLUMNS);

  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_COLUMNS * ASCII_CELL_WIDTH;
  canvas.height = rows * ASCII_CELL_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create 2D context for ASCII glyph atlas.');
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = `${ASCII_CELL_HEIGHT - 2}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < glyphCount; i++) {
    const col = i % ATLAS_COLUMNS;
    const row = Math.floor(i / ATLAS_COLUMNS);
    const x = col * ASCII_CELL_WIDTH + ASCII_CELL_WIDTH * 0.5;
    const y = row * ASCII_CELL_HEIGHT + ASCII_CELL_HEIGHT * 0.5;
    ctx.fillText(ASCII_GLYPHS[i], x, y);
  }

  const texture = reglInstance.texture({
    data: canvas,
    mag: 'nearest',
    min: 'nearest',
    wrapS: 'clamp',
    wrapT: 'clamp',
  });

  return {
    texture,
    atlasGrid: [ATLAS_COLUMNS, rows],
    glyphCount,
  };
}

export class MultipassSystem {
  regl: ReglInstance;
  uniforms: UniformManager;
  caps: Caps;

  // Buffers for ping-pong (using render-target ladder)
  rt1: RenderTarget;
  rt2: RenderTarget;
  postRt: RenderTarget;

  // ASCII resources
  asciiGlyphAtlas: regl.Texture2D;
  asciiAtlasGrid: [number, number];
  asciiGlyphCount: number;

  // Commands
  cmdSim: regl.DrawCommand;
  cmdFinal: regl.DrawCommand;
  cmdAscii: regl.DrawCommand;

  // Current sketch
  currentSketchId: string;

  // Internal state
  tickCount: number = 0;
  asciiEnabled: boolean = false;

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
    this.postRt = createRenderTarget(reglInstance, caps, {
      width: 1,
      height: 1,
      linear: false,
      forceType: 'uint8',
    });

    const glyphAtlas = createAsciiGlyphAtlas(reglInstance);
    this.asciiGlyphAtlas = glyphAtlas.texture;
    this.asciiAtlasGrid = glyphAtlas.atlasGrid;
    this.asciiGlyphCount = glyphAtlas.glyphCount;

    // Log what render target type we got
    console.log(`[pipeline] Using RT type: ${this.rt1.type}, filter: ${this.rt1.filter}` +
      (this.rt1.fallbackFrom ? ` (fallback from: ${this.rt1.fallbackFrom.join(', ')})` : ''));

    // Compile initial commands
    const sketch = getSketch(initialSketchId);
    this.cmdSim = this.createSimCommand(sketch);
    this.cmdFinal = this.createFinalCommand(sketch);
    this.cmdAscii = this.createAsciiCommand();
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
      framebuffer: this.regl.prop<any, any>('outputFbo'),
      depth: { enable: false }
    });
  }

  /**
   * Create optional ASCII post-process command.
   */
  private createAsciiCommand(): regl.DrawCommand {
    return this.regl({
      frag: asciiPostFrag,
      vert: frameVert,
      attributes: {
        position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]]
      },
      count: 6,
      uniforms: {
        uTexture: this.regl.prop<any, any>('inputTexture'),
        uGlyphAtlas: () => this.asciiGlyphAtlas,
        uResolution: () => this.uniforms.state.uResolution,
        uCellSize: () => [ASCII_CELL_WIDTH, ASCII_CELL_HEIGHT],
        uAtlasGrid: () => this.asciiAtlasGrid,
        uGlyphCount: () => this.asciiGlyphCount,
      },
      depth: { enable: false },
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

  setAsciiEnabled(enabled: boolean) {
    this.asciiEnabled = enabled;
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
    this.postRt.resize(width, height);
    this.uniforms.resize(width, height);
  }

  render() {
    this.tickCount++;

    // Ping-pong logic
    const input = this.tickCount % 2 === 0 ? this.rt1 : this.rt2;
    const output = this.tickCount % 2 === 0 ? this.rt2 : this.rt1;

    // 1. Simulation Pass
    this.cmdSim({
      inputTexture: input.colorTex,
      outputFbo: output.fbo
    });

    // 2. Final Composite Pass
    this.cmdFinal({
      inputTexture: output.colorTex,
      outputFbo: this.asciiEnabled ? this.postRt.fbo : null,
    });

    if (this.asciiEnabled) {
      this.cmdAscii({
        inputTexture: this.postRt.colorTex,
      });
    }
  }

  dispose() {
    this.rt1.destroy();
    this.rt2.destroy();
    this.postRt.destroy();
    this.asciiGlyphAtlas.destroy();
  }
}
