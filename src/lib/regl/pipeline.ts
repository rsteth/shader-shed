import regl from 'regl';
import { UniformManager } from './uniforms';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';
import { createSketchTextures, type SketchTextureSet } from './textures';

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

function createShaderSource(source: string, caps: Caps, stage: 'vertex' | 'fragment'): string {
  if (caps.isWebGL2) {
    return source;
  }

  let glsl100 = source
    .replace(/^\s*#version\s+300\s+es\s*\n/, '')
    .replace(/\btexture\s*\(/g, 'texture2D(');

  if (stage === 'vertex') {
    glsl100 = glsl100
      .replace(/\bin\s+vec2\s+position\s*;/, 'attribute vec2 position;')
      .replace(/\bout\s+vec2\s+vUv\s*;/, 'varying vec2 vUv;');
  } else {
    glsl100 = glsl100
      .replace(/\bin\s+vec2\s+vUv\s*;/g, 'varying vec2 vUv;')
      .replace(/\bout\s+vec4\s+fragColor\s*;/g, '')
      .replace(/\bfragColor\b/g, 'gl_FragColor');
  }

  return glsl100;
}

/**
 * Turn a sketch's `defines` into a `#define` block. Numbers are always written as
 * floats so `ROWS: 18` can be used in float expressions without a cast.
 */
function createDefineBlock(defines: Sketch['defines']): string {
  return Object.entries(defines ?? {})
    .filter(([, value]) => value !== false)
    .map(([key, value]) => {
      if (value === true) return `#define ${key}`;
      if (typeof value === 'number') {
        return `#define ${key} ${Number.isInteger(value) ? value.toFixed(1) : String(value)}`;
      }
      return `#define ${key} ${value}`;
    })
    .join('\n');
}

/** common.glsl + the sketch's defines + the sketch's own source. */
function composeFragmentSource(body: string, sketch: Sketch): string {
  return [commonShader, createDefineBlock(sketch.defines), body].join('\n');
}

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
  sketchTextures: SketchTextureSet;

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
    this.sketchTextures = createSketchTextures(reglInstance, sketch.textures);
    this.cmdSim = this.createSimCommand(sketch);
    this.cmdFinal = this.createFinalCommand(sketch);
    this.cmdAscii = this.createAsciiCommand();
  }

  /**
   * Uniforms every sketch shader can declare, in both passes: time, resolution,
   * pointer, scroll, whether the ASCII pass is on, and the sketch's own textures.
   * A shader only pays for the ones it declares.
   */
  private createInputUniforms(): Record<string, any> {
    const textureSet = this.sketchTextures;
    const uniforms: Record<string, any> = {
      uTime: () => this.uniforms.state.uTime,
      uDt: () => this.uniforms.state.uDt,
      uResolution: () => this.uniforms.state.uResolution,
      uMouse: () => this.uniforms.state.uMouse,
      uMouseVelocity: () => this.uniforms.state.uMouseVelocity,
      uMouseActive: () => this.uniforms.state.uMouseActive,
      uScroll: () => this.uniforms.state.uScroll,
      uScrollVelocity: () => this.uniforms.state.uScrollVelocity,
      uAscii: () => (this.asciiEnabled ? 1 : 0),
    };

    for (const name of Object.keys(textureSet.textures)) {
      uniforms[name] = () => textureSet.textures[name].texture;
      uniforms[`${name}Size`] = () => textureSet.textures[name].size;
    }

    return uniforms;
  }

  /**
   * Create the simulation pass command from sketch shaders
   */
  private createSimCommand(sketch: Sketch): regl.DrawCommand {
    const simSource = createShaderSource(composeFragmentSource(sketch.sim, sketch), this.caps, 'fragment');
    const vertexSource = createShaderSource(frameVert, this.caps, 'vertex');

    return this.regl({
      frag: simSource,
      vert: vertexSource,
      attributes: {
        position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]]
      },
      count: 6,
      uniforms: {
        ...this.createInputUniforms(),
        uPrevState: this.regl.prop<any, any>('inputTexture'),
      },
      framebuffer: this.regl.prop<any, any>('outputFbo')
    });
  }

  /**
   * Create the final composite pass command from sketch shaders
   */
  private createFinalCommand(sketch: Sketch): regl.DrawCommand {
    const finalSource = createShaderSource(composeFragmentSource(sketch.final, sketch), this.caps, 'fragment');
    const vertexSource = createShaderSource(frameVert, this.caps, 'vertex');

    return this.regl({
      frag: finalSource,
      vert: vertexSource,
      attributes: {
        position: [[-1, -1], [1, -1], [-1, 1], [-1, 1], [1, -1], [1, 1]]
      },
      count: 6,
      uniforms: {
        ...this.createInputUniforms(),
        uTexture: this.regl.prop<any, any>('inputTexture'),
        uOpacity: () => this.uniforms.state.uOpacity,
      },
      framebuffer: this.regl.prop<any, any>('outputFbo'),
      depth: { enable: false }
    });
  }

  /**
   * Create optional ASCII post-process command.
   */
  private createAsciiCommand(): regl.DrawCommand {
    const asciiSource = createShaderSource(asciiPostFrag, this.caps, 'fragment');
    const vertexSource = createShaderSource(frameVert, this.caps, 'vertex');

    return this.regl({
      frag: asciiSource,
      vert: vertexSource,
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
      framebuffer: this.regl.prop<any, any>('outputFbo'),
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

    // Swap texture inputs, then recompile commands against the new set
    const previousTextures = this.sketchTextures;
    this.sketchTextures = createSketchTextures(this.regl, sketch.textures);
    this.cmdSim = this.createSimCommand(sketch);
    this.cmdFinal = this.createFinalCommand(sketch);
    this.currentSketchId = sketchId;
    previousTextures.destroy();

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
        outputFbo: null,
      });
    }
  }

  dispose() {
    this.rt1.destroy();
    this.rt2.destroy();
    this.postRt.destroy();
    this.asciiGlyphAtlas.destroy();
    this.sketchTextures.destroy();
  }
}
