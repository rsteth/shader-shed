# Shader Forge: Next.js + Regl Scaffold

A production-ready scaffold for building high-performance, fullscreen, multipass shader systems using **Regl (WebGL2)** within **Next.js**.

## Features

- **Framework**: Next.js 14 (App Router)
- **Graphics**: Regl (Functional WebGL wrapper)
- **Architecture**:
  - Fullscreen multipass pipeline (Ping-Pong buffers for simulation)
  - Modular GLSL Shader organization
  - Centralized Uniform Management
  - Resize & DPR handling
  - React Component wrapper (`<ShaderCanvas />`)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open**: `http://localhost:3000`

## Project Structure

```
/src
  /app              # Next.js App Router
  /components
    ShaderCanvas.tsx # Main React entry point
  /lib/regl
    context.ts      # Context utilities
    pipeline.ts     # Multipass Render Logic (The "Engine")
    uniforms.ts     # Central State Store
    pingpong.ts     # Ping-pong helper for multi-pass sims
  /shaders
    common.glsl     # Shared functions (Noise, Math)
    frame.vert      # Fullscreen Quad Vertex Shader
    fluid/          # Option A fluid sim + render passes
    sim.frag        # Simulation logic (legacy sketches)
    final.frag      # Composite/Post-processing (legacy sketches)
    sketches/       # Sketch registry + swapper
```

## How to Customize

### 1. Adding New Shaders

Place your `.glsl` files in `src/shaders`.
Import them in `src/lib/regl/pipeline.ts`:

```typescript
import myShader from '@/shaders/my-shader.frag';
```

### 2. Modifying the Pipeline

Edit `src/lib/regl/pipeline.ts`. This file orchestrates the render passes.

**To add a new pass:**
1. Create a new Framebuffer in the constructor.
2. Create a new `regl` command (e.g., `this.cmdBlur`).
3. Call the command in the `render()` loop.

### 3. Adding Uniforms

1. Edit `src/lib/regl/uniforms.ts` to add the property to the `Uniforms` interface and initial state.
2. Add a setter method (e.g., `setStrength(v)`).
3. In `pipeline.ts`, bind the uniform in the regl command:
   ```typescript
   uniforms: {
     uStrength: () => this.uniforms.state.uStrength
   }
   ```

## Options Flow (Option A) Notes

The **Options Flow** sketch implements the “one simulation, two renderers” pipeline:

**Passes**
1. **FORCE**: velocity += metric gradient + curl noise, with damping.
2. **ADVECT_VEL**: semi-Lagrangian velocity advection.
3. **INJECT_DYE**: injects color/density where metric changes.
4. **ADVECT_DYE**: advects and fades dye.
5. **FINAL**: SOLID + LINES renderers with crossfade via `uMode`.

**Uniforms (core)**
- `uMode` / `uModeTarget`: crossfade between SOLID (0) and LINES (1)
- `uSnap`: snapshot blend (0 → t0, 0.5 → t1, 1 → t2)
- `uForce`, `uDamp`, `uInject`, `uFade`: sim controls
- `uLineDensity`, `uLineSharpness`: line-art controls
- `uMetricMode`: 0 = dPrice/dStrike, 1 = extrinsic ratio, 2 = |Δmid|
- `uDebug`: 0 = off, 1 = velocity magnitude, 2 = metric field

**Controls (demo defaults)**
- `M` → toggle SOLID/LINES
- `D` → cycle debug views
- `N` → cycle metric modes

**Options Texture Hookup**
- The shader expects a 2D texture with 3 stacked snapshots (height × 3).
- Wire real data by updating `optionsTex` in `src/lib/regl/pipeline.ts` and set `uOptionsTexEnabled = 1.0`.

## GitHub Pages Branch Previews

This repo can publish a static export to GitHub Pages, including branch previews.

### Setup

1. Enable GitHub Pages for the repository:
   - Source: **Deploy from a branch**
   - Branch: `gh-pages` / `/ (root)`
2. Ensure the default branch is `main`.
3. Push any branch to trigger a deploy.

### Preview URLs

- `main` deploys to the root: `https://<org>.github.io/<repo>/`
- Other branches deploy to: `https://<org>.github.io/<repo>/previews/<branch-slug>/`

Branch slugs are lowercased with `/` replaced by `-`.

### Preview URL Metadata

Each deployment writes a `preview-info.json` file into the published site that includes the
branch name and resolved preview URL. You can fetch it from:

- `https://<org>.github.io/<repo>/preview-info.json` (main)
- `https://<org>.github.io/<repo>/previews/<branch-slug>/preview-info.json` (branches)

### Repository Visibility

GitHub Pages requires the repository to be **public** on the GitHub Free plan. Private
repository Pages are available on GitHub Pro/Team/Enterprise plans.

## React Three Fiber (R3F) Portability

This system is designed to be easily ported to R3F.

| Shader Forge (Current) | React Three Fiber Equivalent |
|------------------------|------------------------------|
| `ShaderCanvas.tsx`     | `<Canvas />`                 |
| `pipeline.ts`          | `<useFrame>` + `useFBO`      |
| `sim.frag`             | `<shaderMaterial />`         |
| `uniforms.ts`          | React State or Zustand Store |

**Migration Strategy:**
1. Copy `.glsl` files directly (they are standard GLSL).
2. Replace `pipeline.ts` logic with R3F's `useFBO` for ping-ponging.
3. Replace `frame.vert` with a standard Plane geometry vertex shader or R3F's default.

## License

MIT
