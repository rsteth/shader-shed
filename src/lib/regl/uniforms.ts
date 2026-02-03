export interface Uniforms {
  uTime: number;
  uResolution: [number, number];
  uMouse: [number, number];
  uScroll: number;
  uOpacity: number;
  uDt: number;
  [key: string]: any;
}

export class UniformManager {
  state: Uniforms;

  constructor() {
    this.state = {
      uTime: 0,
      uResolution: [1, 1],
      uMouse: [0.5, 0.5],
      uScroll: 0,
      uOpacity: 1.0,
      uDt: 0.016,
    };
  }

  update(dt: number) {
    this.state.uTime += dt;
    this.state.uDt = dt;
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
}
