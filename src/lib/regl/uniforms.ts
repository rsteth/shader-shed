export interface Uniforms {
  uTime: number;
  uResolution: [number, number];
  /** Pointer position, 0..1 with the origin at the bottom-left (matches vUv). */
  uMouse: [number, number];
  /** Smoothed pointer velocity in uv units per second. */
  uMouseVelocity: [number, number];
  /** 0..1, eases to 1 while a pointer is over the canvas and back to 0 when it leaves. */
  uMouseActive: number;
  /** Scroll progress, 0..1. What it measures depends on ShaderCanvas' scrollSource. */
  uScroll: number;
  /** Smoothed scroll speed in viewport heights per second (signed, positive = scrolling down). */
  uScrollVelocity: number;
  uOpacity: number;
  uDt: number;
  [key: string]: any;
}

/** Exponential smoothing factor that behaves the same at any frame rate. */
function smoothing(rate: number, dt: number): number {
  return 1 - Math.exp(-rate * dt);
}

export class UniformManager {
  state: Uniforms;

  private lastMouse: [number, number] = [0.5, 0.5];
  private mouseActiveTarget = 0;
  private scrollPosition = 0;
  private lastScrollPosition = 0;
  private hasScrollSample = false;

  constructor() {
    this.state = {
      uTime: 0,
      uResolution: [1, 1],
      uMouse: [0.5, 0.5],
      uMouseVelocity: [0, 0],
      uMouseActive: 0,
      uScroll: 0,
      uScrollVelocity: 0,
      uOpacity: 1.0,
      uDt: 0.016,
    };
  }

  update(dt: number) {
    const state = this.state;
    state.uTime += dt;
    state.uDt = dt;

    if (dt <= 0) return;

    // Pointer velocity and presence
    const [mx, my] = state.uMouse;
    const k = smoothing(12, dt);
    const rawVx = (mx - this.lastMouse[0]) / dt;
    const rawVy = (my - this.lastMouse[1]) / dt;
    state.uMouseVelocity = [
      state.uMouseVelocity[0] + (rawVx - state.uMouseVelocity[0]) * k,
      state.uMouseVelocity[1] + (rawVy - state.uMouseVelocity[1]) * k,
    ];
    this.lastMouse = [mx, my];
    state.uMouseActive += (this.mouseActiveTarget - state.uMouseActive) * smoothing(6, dt);

    // Scroll velocity
    const rawScrollV = (this.scrollPosition - this.lastScrollPosition) / dt;
    state.uScrollVelocity += (rawScrollV - state.uScrollVelocity) * smoothing(10, dt);
    this.lastScrollPosition = this.scrollPosition;
  }

  resize(width: number, height: number) {
    this.state.uResolution = [width, height];
  }

  /** x, y are 0..1 from the top-left of the tracked area (DOM convention); y is flipped for GLSL. */
  setMouse(x: number, y: number) {
    const next: [number, number] = [x, 1.0 - y];
    if (this.mouseActiveTarget === 0 && this.state.uMouseActive < 0.01) {
      // Pointer just arrived: don't report the jump from its old position as velocity.
      this.lastMouse = next;
    }
    this.state.uMouse = next;
    this.mouseActiveTarget = 1;
  }

  setMouseActive(active: boolean) {
    this.mouseActiveTarget = active ? 1 : 0;
  }

  /**
   * @param progress 0..1 scroll progress (page or element, see ShaderCanvas' scrollSource)
   * @param position scroll offset in viewport heights; only used to derive uScrollVelocity
   */
  setScroll(progress: number, position: number = progress) {
    this.state.uScroll = Math.min(1, Math.max(0, progress));
    this.scrollPosition = position;
    if (!this.hasScrollSample) {
      this.lastScrollPosition = position;
      this.hasScrollSample = true;
    }
  }
}
