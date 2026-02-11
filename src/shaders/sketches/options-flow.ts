import force from '@/shaders/fluid/force.glsl';
import advectVel from '@/shaders/fluid/advect-vel.glsl';
import injectDye from '@/shaders/fluid/inject-dye.glsl';
import advectDye from '@/shaders/fluid/advect-dye.glsl';
import renderFinal from '@/shaders/fluid/render-final.glsl';

export const passes = {
  force,
  advectVel,
  injectDye,
  advectDye,
  render: renderFinal,
};
