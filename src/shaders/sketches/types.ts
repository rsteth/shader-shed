/**
 * Sketch contract.
 *
 * A sketch is plain data: two fragment shader strings plus optional inputs.
 * Nothing in here depends on regl, React or Next, so a sketch file can be
 * copied into another renderer (R3F, raw WebGL) unchanged.
 */

/** Where a texture's pixels come from. */
export type TextureSource =
  /** An image URL. Root-relative paths ("/textures/x.jpg") are resolved against the site's base path. */
  | { kind: 'image'; src: string; filter?: TextureFilter; wrap?: TextureWrap }
  /**
   * A line of text rasterised white-on-black. Coverage is in every colour channel.
   * Width defaults to 2048; height defaults to whatever hugs the line, so `<name>Size`
   * gives the shader the text's real aspect ratio.
   */
  | {
      kind: 'text';
      text: string;
      /** CSS font shorthand without the size, e.g. '700 Inter, sans-serif'. */
      font?: string;
      width?: number;
      height?: number;
      filter?: TextureFilter;
      wrap?: TextureWrap;
    }
  /** Anything you can draw with the 2D canvas API. */
  | {
      kind: 'canvas';
      width: number;
      height: number;
      draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
      filter?: TextureFilter;
      wrap?: TextureWrap;
    };

export type TextureFilter = 'linear' | 'nearest';
/** 'repeat' needs power-of-two dimensions on WebGL1. */
export type TextureWrap = 'clamp' | 'repeat';

export interface Sketch {
  name: string;
  description: string;
  /** Simulation fragment shader. Renders into the ping-pong buffer; reads last frame from uPrevState. */
  sim: string;
  /** Final fragment shader. Reads the simulation buffer from uTexture and draws to the screen. */
  final: string;
  /**
   * Compile-time switches, emitted as `#define KEY VALUE` ahead of both shaders.
   * `true` emits a bare `#define KEY`; `false` emits nothing. Numbers are written
   * as floats. Use these to turn one pair of shaders into several presets.
   */
  defines?: Record<string, string | number | boolean>;
  /**
   * Texture inputs, keyed by sampler uniform name. For a key `uImage` both shaders can declare
   * `uniform sampler2D uImage;` and `uniform vec2 uImageSize;` (pixels; 1x1 until loaded).
   */
  textures?: Record<string, TextureSource>;
  /** The sketch is driven by uScroll. Hosts without a scrollable page should autoplay it. */
  scrollDriven?: boolean;
  includeInSlideshow?: boolean;
  meta?: {
    attribution?: string;
  };
}
