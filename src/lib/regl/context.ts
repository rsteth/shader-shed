import regl from 'regl';

export type ReglInstance = regl.Regl;

export interface ReglContextOptions {
    alpha?: boolean;
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    preserveDrawingBuffer?: boolean;
}

export const DEFAULT_CONTEXT_OPTIONS: ReglContextOptions = {
    alpha: true,
    antialias: false, 
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false
};

// WebGL2 extensions
// Note: OES_texture_float, OES_texture_half_float, and OES_texture_half_float_linear
// are built-in to WebGL2 and don't need to be requested as extensions.
// EXT_color_buffer_float is still required for rendering to float/half-float textures.
// OES_texture_float_linear is optional (enables linear filtering on float textures).
export const requiredExtensions = [
    'EXT_color_buffer_float',
];

export const optionalExtensions = [
    'OES_texture_float_linear',
    'OES_texture_half_float',        // Built-in to WebGL2, but regl checks for it
    'OES_texture_half_float_linear', // Built-in to WebGL2, but regl checks for it
];
