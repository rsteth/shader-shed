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
  /shaders
    common.glsl     # Shared functions (Noise, Math)
    frame.vert      # Fullscreen Quad Vertex Shader
    sim.frag        # Simulation logic (Fluid/Reaction-Diffusion)
    final.frag      # Composite/Post-processing
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
