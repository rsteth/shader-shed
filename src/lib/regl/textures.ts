import type regl from 'regl';
import type { TextureSource } from '@/shaders/sketches/types';

type ReglInstance = regl.Regl;

export interface SketchTexture {
  texture: regl.Texture2D;
  /** Pixel size of the loaded source; [1, 1] while an image is still loading. */
  size: [number, number];
}

export interface SketchTextureSet {
  textures: Record<string, SketchTexture>;
  destroy: () => void;
}

const DEFAULT_TEXT_FONT = '700 Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';

/** Prefix root-relative URLs with the deploy base path (GitHub Pages previews live in a subfolder). */
export function resolveAssetUrl(src: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return src.startsWith('/') && !src.startsWith('//') ? `${basePath}${src}` : src;
}

function make2dCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to create a 2D context for a sketch texture.');
  }
  return [canvas, ctx];
}

/** Splits a CSS font shorthand without a size ("700 Inter, sans-serif") into [style/weight, family]. */
function splitFont(font: string): [string, string] {
  const match = font.match(/^((?:(?:italic|oblique|normal|bold|bolder|lighter|\d{3})\s+)*)(.+)$/);
  return match ? [match[1].trim(), match[2]] : ['', font];
}

function drawText(source: Extract<TextureSource, { kind: 'text' }>): HTMLCanvasElement {
  const [prefix, family] = splitFont(source.font ?? DEFAULT_TEXT_FONT);
  const fontAt = (px: number) => `${prefix} ${px}px ${family}`.trim();

  // Measure at a reference size first; the texture is then sized to hug the line.
  const reference = 200;
  const [, measureCtx] = make2dCanvas(1, 1);
  measureCtx.font = fontAt(reference);
  const metrics = measureCtx.measureText(source.text);
  const ascent = metrics.actualBoundingBoxAscent || reference * 0.72;
  const descent = metrics.actualBoundingBoxDescent || 0;
  const textWidth = Math.max(metrics.width, 1);
  const textHeight = Math.max(ascent + descent, 1);

  // 4% side margins and 10% top/bottom, so linear filtering never bleeds off an edge.
  const width = source.width ?? 2048;
  const height = source.height ?? Math.min(width, Math.ceil(((width * 0.96) / textWidth) * textHeight / 0.8));
  const scale = Math.min((width * 0.96) / textWidth, (height * 0.8) / textHeight);

  const [canvas, ctx] = make2dCanvas(width, height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.font = fontAt(reference * scale);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(source.text, width / 2, height / 2 + ((ascent - descent) / 2) * scale);

  return canvas;
}

/**
 * Create the textures a sketch declares. Canvas and text sources are ready immediately;
 * images start as a 1x1 black pixel and are swapped in place when they load.
 */
export function createSketchTextures(
  reglInstance: ReglInstance,
  sources: Record<string, TextureSource> | undefined
): SketchTextureSet {
  const textures: Record<string, SketchTexture> = {};
  let destroyed = false;

  for (const [name, source] of Object.entries(sources ?? {})) {
    const options = {
      mag: source.filter ?? 'linear',
      min: source.filter ?? 'linear',
      wrapS: source.wrap ?? 'clamp',
      wrapT: source.wrap ?? 'clamp',
      // Match vUv: origin at the bottom-left.
      flipY: true,
    } as const;

    if (source.kind === 'image') {
      const entry: SketchTexture = {
        texture: reglInstance.texture({ width: 1, height: 1, data: new Uint8Array([0, 0, 0, 255]) }),
        size: [1, 1],
      };
      textures[name] = entry;

      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (destroyed) return;
        entry.texture({ ...options, data: image });
        entry.size = [image.naturalWidth || image.width, image.naturalHeight || image.height];
      };
      image.onerror = () => {
        if (destroyed) return;
        console.warn(`[textures] Could not load "${source.src}" for ${name}; the sketch keeps a black placeholder.`);
      };
      image.src = resolveAssetUrl(source.src);
      continue;
    }

    let canvas: HTMLCanvasElement;
    if (source.kind === 'text') {
      canvas = drawText(source);
    } else {
      const [target, ctx] = make2dCanvas(source.width, source.height);
      source.draw(ctx, source.width, source.height);
      canvas = target;
    }

    textures[name] = {
      texture: reglInstance.texture({ ...options, data: canvas }),
      size: [canvas.width, canvas.height],
    };
  }

  return {
    textures,
    destroy: () => {
      destroyed = true;
      for (const entry of Object.values(textures)) {
        entry.texture.destroy();
      }
    },
  };
}
