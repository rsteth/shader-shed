/**
 * Bulletproof Render-Target Ladder for regl
 *
 * Automatically selects the best available render target format:
 * 1) WebGL2 + half-float RTT
 * 2) WebGL2 + float RTT
 * 3) WebGL1 + half-float RTT
 * 4) WebGL1 + float RTT
 * 5) RGBA8 uint8 fallback (always works)
 *
 * Extensions checked:
 * - EXT_color_buffer_float: Required for float RTT in WebGL2
 * - EXT_color_buffer_half_float: Required for half-float RTT
 * - WEBGL_color_buffer_float: Required for float RTT in WebGL1
 * - OES_texture_float: Required for float textures in WebGL1
 * - OES_texture_half_float: Required for half-float textures in WebGL1
 * - OES_texture_float_linear: Enables linear filtering on float textures
 * - OES_texture_half_float_linear: Enables linear filtering on half-float textures (WebGL1)
 */

import regl from 'regl';

type ReglInstance = regl.Regl;

// ============================================================================
// Types
// ============================================================================

export type RTType = 'half float' | 'float' | 'uint8';
export type FilterPolicy = 'linear' | 'nearest';

export interface Caps {
  isWebGL2: boolean;
  extensions: string[];
  canTexFloat: boolean;
  canTexHalfFloat: boolean;
  canRTTFloat: boolean;
  canRTTHalfFloat: boolean;
  canLinearFloat: boolean;
  canLinearHalfFloat: boolean;
  chosenRTType: RTType;
  chosenFilterPolicy: FilterPolicy;
}

export interface ReglWithCaps {
  regl: ReglInstance;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  caps: Caps;
}

export interface CreateReglOptions {
  canvas?: HTMLCanvasElement;
  preferWebGL2?: boolean;
  attributes?: WebGLContextAttributes;
}

export interface RenderTargetOptions {
  width: number;
  height: number;
  linear?: boolean;
  forceType?: RTType;
}

export interface RenderTarget {
  fbo: regl.Framebuffer2D;
  colorTex: regl.Texture2D;
  type: RTType;
  filter: FilterPolicy;
  fallbackFrom?: RTType[];
  /** Custom resize function that preserves float format in WebGL2 */
  resize: (width: number, height: number) => void;
  /** Destroy the render target */
  destroy: () => void;
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Safely get an extension, returning null if not available.
 */
function safeGetExtension(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  name: string
): unknown | null {
  try {
    return gl.getExtension(name);
  } catch {
    return null;
  }
}

/**
 * Get all supported extensions from a list.
 */
function getSupportedExtensions(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  names: string[]
): string[] {
  const supported: string[] = [];
  for (const name of names) {
    if (safeGetExtension(gl, name)) {
      supported.push(name);
    }
  }
  return supported;
}

/**
 * Test if we can actually render to an FBO with the given texture type.
 * This is necessary because some devices report extension support but
 * fail framebuffer completeness checks (especially Safari).
 */
function testRTTSupport(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  isWebGL2: boolean,
  textureType: 'float' | 'half float'
): boolean {
  const gl2 = gl as WebGL2RenderingContext;

  let internalFormat: number;
  let format: number;
  let type: number;

  if (isWebGL2) {
    format = gl.RGBA;
    if (textureType === 'float') {
      internalFormat = gl2.RGBA32F;
      type = gl.FLOAT;
    } else {
      internalFormat = gl2.RGBA16F;
      type = gl2.HALF_FLOAT;
    }
  } else {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    if (textureType === 'float') {
      type = gl.FLOAT;
    } else {
      // In WebGL1, half float type comes from extension
      const ext = safeGetExtension(gl, 'OES_texture_half_float') as { HALF_FLOAT_OES?: number } | null;
      if (!ext || !ext.HALF_FLOAT_OES) {
        return false;
      }
      type = ext.HALF_FLOAT_OES;
    }
  }

  // Create test texture and framebuffer
  const tex = gl.createTexture();
  const fbo = gl.createFramebuffer();

  if (!tex || !fbo) {
    return false;
  }

  let success = false;

  try {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Allocate texture
    if (isWebGL2) {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    }

    // Check for GL errors after texImage2D
    const texError = gl.getError();
    if (texError !== gl.NO_ERROR) {
      return false;
    }

    // Bind framebuffer and attach texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    // Check framebuffer completeness
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    success = status === gl.FRAMEBUFFER_COMPLETE;

    // Extra validation: try a clear operation
    if (success) {
      gl.viewport(0, 0, 4, 4);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const clearError = gl.getError();
      if (clearError !== gl.NO_ERROR) {
        success = false;
      }
    }
  } catch {
    success = false;
  } finally {
    // Cleanup
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(tex);
    gl.deleteFramebuffer(fbo);
  }

  return success;
}

/**
 * Test if linear filtering works for a given texture type.
 */
function testLinearFiltering(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  isWebGL2: boolean,
  textureType: 'float' | 'half float'
): boolean {
  const gl2 = gl as WebGL2RenderingContext;

  let internalFormat: number;
  let format: number;
  let type: number;

  if (isWebGL2) {
    format = gl.RGBA;
    if (textureType === 'float') {
      internalFormat = gl2.RGBA32F;
      type = gl.FLOAT;
    } else {
      internalFormat = gl2.RGBA16F;
      type = gl2.HALF_FLOAT;
    }
  } else {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    if (textureType === 'float') {
      type = gl.FLOAT;
    } else {
      const ext = safeGetExtension(gl, 'OES_texture_half_float') as { HALF_FLOAT_OES?: number } | null;
      if (!ext || !ext.HALF_FLOAT_OES) {
        return false;
      }
      type = ext.HALF_FLOAT_OES;
    }
  }

  const tex = gl.createTexture();
  if (!tex) return false;

  let success = false;

  try {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    if (isWebGL2) {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    }

    // Check for GL errors - if linear filtering isn't supported, some drivers error here
    const error = gl.getError();
    success = error === gl.NO_ERROR;
  } catch {
    success = false;
  } finally {
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(tex);
  }

  return success;
}

/**
 * Determine capabilities of the GL context.
 */
function detectCapabilities(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  isWebGL2: boolean
): Caps {
  // All extensions we care about
  const extensionNames = [
    'EXT_color_buffer_float',
    'EXT_color_buffer_half_float',
    'WEBGL_color_buffer_float',
    'OES_texture_float',
    'OES_texture_half_float',
    'OES_texture_float_linear',
    'OES_texture_half_float_linear',
  ];

  const extensions = getSupportedExtensions(gl, extensionNames);
  const hasExt = (name: string) => extensions.includes(name);

  // Texture support
  // In WebGL2, float and half-float textures are core - no extensions needed.
  // In WebGL1, we need OES_texture_float / OES_texture_half_float.
  const canTexFloat = isWebGL2 || hasExt('OES_texture_float');
  const canTexHalfFloat = isWebGL2 || hasExt('OES_texture_half_float');

  // RTT support - check extensions first, then validate with actual test
  let canRTTFloat = false;
  let canRTTHalfFloat = false;

  if (isWebGL2) {
    // WebGL2: EXT_color_buffer_float enables both float and half-float RTT
    if (hasExt('EXT_color_buffer_float')) {
      // Test float RTT - only if regl can create float textures
      if (canTexFloat && testRTTSupport(gl, isWebGL2, 'float')) {
        canRTTFloat = true;
      }
      // Test half-float RTT - only if regl can create half-float textures
      if (canTexHalfFloat && testRTTSupport(gl, isWebGL2, 'half float')) {
        canRTTHalfFloat = true;
      }
    }
    // Some implementations have half-float RTT without full float RTT
    if (!canRTTHalfFloat && canTexHalfFloat && hasExt('EXT_color_buffer_half_float')) {
      if (testRTTSupport(gl, isWebGL2, 'half float')) {
        canRTTHalfFloat = true;
      }
    }
  } else {
    // WebGL1
    if (canTexFloat && hasExt('WEBGL_color_buffer_float')) {
      if (testRTTSupport(gl, isWebGL2, 'float')) {
        canRTTFloat = true;
      }
    }
    if (canTexHalfFloat && hasExt('EXT_color_buffer_half_float')) {
      if (testRTTSupport(gl, isWebGL2, 'half float')) {
        canRTTHalfFloat = true;
      }
    }
  }

  // Linear filtering support
  let canLinearFloat = false;
  let canLinearHalfFloat = false;

  if (isWebGL2) {
    // Half-float linear is core in WebGL2
    canLinearHalfFloat = canTexHalfFloat && testLinearFiltering(gl, isWebGL2, 'half float');
    // Float linear still needs extension
    if (hasExt('OES_texture_float_linear')) {
      canLinearFloat = canTexFloat && testLinearFiltering(gl, isWebGL2, 'float');
    }
  } else {
    if (hasExt('OES_texture_float_linear') && canTexFloat) {
      canLinearFloat = testLinearFiltering(gl, isWebGL2, 'float');
    }
    if (hasExt('OES_texture_half_float_linear') && canTexHalfFloat) {
      canLinearHalfFloat = testLinearFiltering(gl, isWebGL2, 'half float');
    }
  }

  // Determine best available RT type following the priority ladder
  let chosenRTType: RTType;
  if (isWebGL2 && canRTTHalfFloat) {
    chosenRTType = 'half float';
  } else if (isWebGL2 && canRTTFloat) {
    chosenRTType = 'float';
  } else if (!isWebGL2 && canRTTHalfFloat) {
    chosenRTType = 'half float';
  } else if (!isWebGL2 && canRTTFloat) {
    chosenRTType = 'float';
  } else {
    chosenRTType = 'uint8';
  }

  // Determine filter policy based on chosen RT type
  let chosenFilterPolicy: FilterPolicy;
  if (chosenRTType === 'half float' && canLinearHalfFloat) {
    chosenFilterPolicy = 'linear';
  } else if (chosenRTType === 'float' && canLinearFloat) {
    chosenFilterPolicy = 'linear';
  } else if (chosenRTType === 'uint8') {
    chosenFilterPolicy = 'linear'; // uint8 always supports linear
  } else {
    chosenFilterPolicy = 'nearest';
  }

  return {
    isWebGL2,
    extensions,
    canTexFloat,
    canTexHalfFloat,
    canRTTFloat,
    canRTTHalfFloat,
    canLinearFloat,
    canLinearHalfFloat,
    chosenRTType,
    chosenFilterPolicy,
  };
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Create a regl instance with detected capabilities.
 * Prefers WebGL2 when available and requested.
 */
export function createReglWithCaps(options: CreateReglOptions = {}): ReglWithCaps {
  const {
    canvas = document.createElement('canvas'),
    preferWebGL2 = true,
    attributes = {},
  } = options;

  const contextAttributes: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    ...attributes,
  };

  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let isWebGL2 = false;

  // Try WebGL2 first if preferred
  if (preferWebGL2) {
    try {
      gl = canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext | null;
      if (gl) {
        isWebGL2 = true;
      }
    } catch {
      // WebGL2 not available, fall through
    }
  }

  // Fall back to WebGL1
  if (!gl) {
    try {
      gl = canvas.getContext('webgl', contextAttributes) as WebGLRenderingContext | null;
      if (!gl) {
        gl = canvas.getContext('experimental-webgl', contextAttributes) as WebGLRenderingContext | null;
      }
    } catch {
      // WebGL not available
    }
  }

  if (!gl) {
    throw new Error('WebGL is not supported in this browser');
  }

  // Log context type for verification
  console.log(`[regl] Context: ${gl.constructor.name}`);

  // Enforce WebGL2 if it was preferred but we got WebGL1
  if (preferWebGL2 && !isWebGL2) {
    throw new Error('WebGL2 was requested but only WebGL1 is available');
  }

  // All float-related extensions we want to enable
  const allFloatExtensions = [
    'OES_texture_float',
    'OES_texture_half_float',
    'OES_texture_float_linear',
    'OES_texture_half_float_linear',
    'EXT_color_buffer_float',
    'EXT_color_buffer_half_float',
    'WEBGL_color_buffer_float',
  ];

  // IMPORTANT: Explicitly enable extensions on the GL context BEFORE creating regl.
  // This is necessary because:
  // 1. regl checks for extension objects to be present when using float/half-float types
  // 2. In WebGL2, calling getExtension() for these often still works (browser provides
  //    compatibility shims) even though the functionality is core
  // 3. By enabling them here, they'll be available when regl queries for them
  for (const extName of allFloatExtensions) {
    try {
      gl.getExtension(extName);
    } catch {
      // Extension not available, continue
    }
  }

  // Create regl with the existing GL context
  // Also pass extensions to optionalExtensions so regl registers them
  const reglInstance = regl({
    gl,
    optionalExtensions: allFloatExtensions,
  });

  // Verify regl is using the context we provided
  if (reglInstance._gl !== gl) {
    console.warn('[regl] WARNING: regl._gl !== gl passed to constructor');
  }
  console.log(`[regl] regl._gl: ${reglInstance._gl.constructor.name}`);

  // Detect capabilities AFTER regl is created (regl may have enabled extensions)
  const caps = detectCapabilities(gl, isWebGL2);

  return { regl: reglInstance, gl, canvas, caps };
}

/**
 * Create a render target (FBO) using the best available format.
 * Automatically falls back through the capability ladder if needed.
 */
/**
 * Reinitialize a regl texture's underlying WebGL texture to use float/half-float format.
 * This bypasses regl's extension checks for WebGL2.
 */
function reinitTextureAsFloat(
  gl: WebGL2RenderingContext,
  reglTex: regl.Texture2D,
  width: number,
  height: number,
  rtType: 'half float' | 'float',
  filter: FilterPolicy
): boolean {
  // Access regl's internal texture handle
  const rawTex = (reglTex as any)._texture?.texture;
  if (!rawTex) {
    console.warn('[render-target] Could not access regl texture internals');
    return false;
  }

  const glFilter = filter === 'linear' ? gl.LINEAR : gl.NEAREST;
  const internalFormat = rtType === 'half float' ? gl.RGBA16F : gl.RGBA32F;
  const type = rtType === 'half float' ? gl.HALF_FLOAT : gl.FLOAT;

  try {
    gl.bindTexture(gl.TEXTURE_2D, rawTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, gl.RGBA, type, null);

    const err = gl.getError();
    gl.bindTexture(gl.TEXTURE_2D, null);

    if (err !== gl.NO_ERROR) {
      console.warn(`[render-target] GL error reinitializing texture: ${err}`);
      return false;
    }

    return true;
  } catch (e) {
    gl.bindTexture(gl.TEXTURE_2D, null);
    console.warn('[render-target] Exception reinitializing texture:', e);
    return false;
  }
}

export function createRenderTarget(
  reglInstance: ReglInstance,
  caps: Caps,
  options: RenderTargetOptions
): RenderTarget {
  const { width, height, linear = false, forceType } = options;
  const fallbackFrom: RTType[] = [];
  const gl = reglInstance._gl;

  // Build the ladder of types to try based on capabilities
  const typesToTry: RTType[] = [];

  if (forceType) {
    typesToTry.push(forceType);
    if (forceType !== 'uint8') {
      typesToTry.push('uint8');
    }
  } else {
    // Add types in priority order (only those that caps says are available)
    if (caps.isWebGL2) {
      if (caps.canRTTHalfFloat) typesToTry.push('half float');
      if (caps.canRTTFloat) typesToTry.push('float');
    } else {
      if (caps.canRTTHalfFloat) typesToTry.push('half float');
      if (caps.canRTTFloat) typesToTry.push('float');
    }
    // uint8 is always the final fallback
    typesToTry.push('uint8');
  }

  for (const rtType of typesToTry) {
    // Determine filter based on request and capability
    let filter: FilterPolicy;
    if (linear) {
      if (rtType === 'half float' && caps.canLinearHalfFloat) {
        filter = 'linear';
      } else if (rtType === 'float' && caps.canLinearFloat) {
        filter = 'linear';
      } else if (rtType === 'uint8') {
        filter = 'linear'; // uint8 always supports linear
      } else {
        filter = 'nearest'; // Requested linear but not supported
      }
    } else {
      filter = 'nearest';
    }

    const minFilter = filter === 'linear' ? 'linear' : 'nearest';
    const magFilter = filter === 'linear' ? 'linear' : 'nearest';

    try {
      let colorTex: regl.Texture2D;

      // For WebGL2 float types, create uint8 texture then reinitialize to float format
      // This bypasses regl's OES extension checks
      if (caps.isWebGL2 && (rtType === 'half float' || rtType === 'float')) {
        // Create a placeholder uint8 texture via regl
        colorTex = reglInstance.texture({
          width,
          height,
          type: 'uint8',
          format: 'rgba',
          min: minFilter,
          mag: magFilter,
          wrap: 'clamp',
        });

        // Reinitialize the underlying WebGL texture to float format
        const success = reinitTextureAsFloat(
          gl as WebGL2RenderingContext,
          colorTex,
          width,
          height,
          rtType,
          filter
        );

        if (!success) {
          colorTex.destroy();
          fallbackFrom.push(rtType);
          console.warn(`[render-target] Failed to reinit texture as ${rtType}`);
          continue;
        }
      } else {
        // WebGL1 or uint8: use regl's built-in texture creation
        colorTex = reglInstance.texture({
          width,
          height,
          type: rtType,
          format: 'rgba',
          min: minFilter,
          mag: magFilter,
          wrap: 'clamp',
        });
      }

      // Create framebuffer
      const fbo = reglInstance.framebuffer({
        color: colorTex,
        depth: false,
        stencil: false,
      });

      // Validate framebuffer by attempting to use it
      let valid = true;
      try {
        // Use regl's scoping to bind the framebuffer
        (fbo as any).use(() => {
          reglInstance.clear({ color: [0, 0, 0, 1] });
        });
      } catch {
        valid = false;
      }

      // Also check raw GL status
      if (valid) {
        const rawFbo = (fbo as any)._framebuffer?.framebuffer;
        if (rawFbo) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, rawFbo);
          const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          if (status !== gl.FRAMEBUFFER_COMPLETE) {
            valid = false;
          }
        }
      }

      if (!valid) {
        // Clean up and try next type
        fbo.destroy();
        colorTex.destroy();
        fallbackFrom.push(rtType);
        console.warn(`[render-target] ${rtType} FBO validation failed, trying next format`);
        continue;
      }

      // Success! Create resize/destroy closures
      const isWebGL2Float = caps.isWebGL2 && (rtType === 'half float' || rtType === 'float');

      const resize = (newWidth: number, newHeight: number) => {
        if (isWebGL2Float) {
          // For WebGL2 float, resize via regl then reinit to float
          fbo.resize(newWidth, newHeight);
          reinitTextureAsFloat(
            gl as WebGL2RenderingContext,
            colorTex,
            newWidth,
            newHeight,
            rtType as 'half float' | 'float',
            filter
          );
        } else {
          // Standard regl resize
          fbo.resize(newWidth, newHeight);
        }
      };

      const destroy = () => {
        fbo.destroy();
        colorTex.destroy();
      };

      return {
        fbo,
        colorTex,
        type: rtType,
        filter,
        fallbackFrom: fallbackFrom.length > 0 ? fallbackFrom : undefined,
        resize,
        destroy,
      };
    } catch (err) {
      fallbackFrom.push(rtType);
      console.warn(`[render-target] Failed to create ${rtType} FBO:`, err);
      continue;
    }
  }

  // This should never happen since uint8 is always last, but just in case
  throw new Error('Failed to create any render target format');
}

/**
 * Print a concise capabilities report for debugging.
 */
export function printCapsReport(caps: Caps): void {
  const webglVersion = caps.isWebGL2 ? 'WebGL2' : 'WebGL1';
  const rtInfo = `RT: ${caps.chosenRTType}`;
  const filterInfo = `filter: ${caps.chosenFilterPolicy}`;

  const rttCaps: string[] = [];
  if (caps.canRTTHalfFloat) rttCaps.push('half');
  if (caps.canRTTFloat) rttCaps.push('float');
  if (rttCaps.length === 0) rttCaps.push('uint8-only');

  const linearCaps: string[] = [];
  if (caps.canLinearHalfFloat) linearCaps.push('half');
  if (caps.canLinearFloat) linearCaps.push('float');

  console.log(
    `[caps] ${webglVersion} | ${rtInfo} (${filterInfo}) | ` +
    `RTT: [${rttCaps.join(',')}] | Linear: [${linearCaps.join(',') || 'uint8-only'}]`
  );
  console.log(`[caps] Extensions: ${caps.extensions.join(', ') || 'none'}`);
}

/**
 * Get a one-line summary of capabilities.
 */
export function getCapsOneLiner(caps: Caps): string {
  const webglVersion = caps.isWebGL2 ? 'GL2' : 'GL1';
  return `${webglVersion} ${caps.chosenRTType}/${caps.chosenFilterPolicy}`;
}
