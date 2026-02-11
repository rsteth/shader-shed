export interface Uniforms {
  uTime: number;
  uResolution: [number, number];
  uSimResolution: [number, number];
  uMouse: [number, number];
  uScroll: number;
  uOpacity: number;
  uDt: number;
  uMode: number;
  uModeTarget: number;
  uSnap: number;
  uForce: number;
  uDamp: number;
  uInject: number;
  uFade: number;
  uLineDensity: number;
  uLineSharpness: number;
  uPaletteBias: number;
  uMetricMode: number;
  uOptionsTexEnabled: number;
  uOptionsTexSize: [number, number];
  uDebug: number;
  [key: string]: any;
}

export class UniformManager {
  state: Uniforms;

  constructor() {
    this.state = {
      uTime: 0,
      uResolution: [1, 1],
      uSimResolution: [1, 1],
      uMouse: [0.5, 0.5],
      uScroll: 0,
      uOpacity: 1.0,
      uDt: 0.016,
      uMode: 0.0,
      uModeTarget: 0.0,
      uSnap: 0.5,
      uForce: 1.0,
      uDamp: 0.06,
      uInject: 0.7,
      uFade: 0.015,
      uLineDensity: 1.2,
      uLineSharpness: 2.2,
      uPaletteBias: 0.1,
      uMetricMode: 0.0,
      uOptionsTexEnabled: 0.0,
      uOptionsTexSize: [1, 1],
      uDebug: 0.0,
    };
  }

  update(dt: number) {
    this.state.uTime += dt;
    this.state.uDt = dt;
    const mixSpeed = Math.min(1, dt * 3.0);
    this.state.uMode += (this.state.uModeTarget - this.state.uMode) * mixSpeed;
    this.state.uSnap = 0.5 + 0.5 * Math.sin(this.state.uTime * 0.2);
  }

  resize(width: number, height: number) {
    this.state.uResolution = [width, height];
  }

  setMouse(x: number, y: number) {
    // Normalize to 0..1, flip Y if needed usually done in shader or here
    // Here we assume x,y are 0..1
    this.state.uMouse = [x, 1.0 - y];
  }

  setScroll(y: number) {
    this.state.uScroll = y;
  }

  setModeTarget(value: number) {
    this.state.uModeTarget = Math.max(0, Math.min(1, value));
  }

  toggleMode() {
    const next = this.state.uModeTarget > 0.5 ? 0.0 : 1.0;
    this.setModeTarget(next);
  }

  cycleMetricMode() {
    this.state.uMetricMode = (this.state.uMetricMode + 1) % 3;
  }

  toggleDebug() {
    const next = this.state.uDebug >= 2 ? 0 : this.state.uDebug + 1;
    this.state.uDebug = next;
  }
}
