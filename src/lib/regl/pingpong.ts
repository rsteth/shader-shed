import type regl from 'regl';
import { createRenderTarget, type Caps, type RenderTarget } from './render-target';

type ReglInstance = regl.Regl;

export interface PingPongTarget {
  read: RenderTarget;
  write: RenderTarget;
  swap: () => void;
  resize: (width: number, height: number) => void;
  destroy: () => void;
}

interface PingPongOptions {
  width: number;
  height: number;
  linear?: boolean;
}

export function createPingPongTarget(
  reglInstance: ReglInstance,
  caps: Caps,
  options: PingPongOptions
): PingPongTarget {
  const first = createRenderTarget(reglInstance, caps, options);
  const second = createRenderTarget(reglInstance, caps, options);

  const target: PingPongTarget = {
    read: first,
    write: second,
    swap: () => {
      const temp = target.read;
      target.read = target.write;
      target.write = temp;
    },
    resize: (width: number, height: number) => {
      target.read.resize(width, height);
      target.write.resize(width, height);
    },
    destroy: () => {
      target.read.destroy();
      target.write.destroy();
    },
  };

  return target;
}
