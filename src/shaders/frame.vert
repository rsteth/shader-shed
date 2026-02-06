#version 300 es
precision highp float;

in vec2 position;
out vec2 vUv;

void main() {
  vUv = 0.5 * (position + 1.0);
  gl_Position = vec4(position, 0, 1);
}