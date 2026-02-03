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

// Helper to check for extensions
export const requiredExtensions = [
    'OES_texture_float_linear', 
    'EXT_color_buffer_float'
];
