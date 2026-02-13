#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uCellSize;

in vec2 vUv;
out vec4 fragColor;

float rectMask(vec2 uv, vec2 center, vec2 halfSize) {
  vec2 d = abs(uv - center);
  return step(d.x, halfSize.x) * step(d.y, halfSize.y);
}

float hBar(vec2 uv, float y, float halfWidth, float thickness) {
  return rectMask(uv, vec2(0.5, y), vec2(halfWidth, thickness));
}

float vBar(vec2 uv, float x, float halfHeight, float thickness) {
  return rectMask(uv, vec2(x, 0.5), vec2(thickness, halfHeight));
}

float glyphForIndex(float index, vec2 uv) {
  float g = 0.0;

  if (index < 0.5) {
    g = 0.0;
  } else if (index < 1.5) {
    g = rectMask(uv, vec2(0.5), vec2(0.06));
  } else if (index < 2.5) {
    g = hBar(uv, 0.5, 0.22, 0.045);
  } else if (index < 3.5) {
    g = hBar(uv, 0.28, 0.2, 0.04) + hBar(uv, 0.72, 0.2, 0.04);
  } else if (index < 4.5) {
    g = hBar(uv, 0.25, 0.23, 0.04) + hBar(uv, 0.5, 0.23, 0.04) + hBar(uv, 0.75, 0.23, 0.04);
  } else if (index < 5.5) {
    g = vBar(uv, 0.28, 0.28, 0.04) + vBar(uv, 0.72, 0.28, 0.04) + hBar(uv, 0.5, 0.22, 0.04);
  } else if (index < 6.5) {
    g = vBar(uv, 0.28, 0.36, 0.04) + vBar(uv, 0.72, 0.36, 0.04) + hBar(uv, 0.2, 0.22, 0.04) + hBar(uv, 0.5, 0.22, 0.04) + hBar(uv, 0.8, 0.22, 0.04);
  } else {
    g = rectMask(uv, vec2(0.5), vec2(0.26, 0.36));
  }

  return clamp(g, 0.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = max(uCellSize, vec2(1.0));

  vec2 cellOrigin = floor(frag / cell) * cell;
  vec2 center = cellOrigin + 0.5 * cell;
  vec2 sampleUv = center / uResolution;

  vec3 color = texture(uTexture, sampleUv).rgb;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));

  float idx = floor(clamp(luminance, 0.0, 0.999) * 8.0);

  vec2 local = fract(frag / cell);
  float glyph = glyphForIndex(idx, local);

  vec3 bg = vec3(0.03, 0.05, 0.04);
  vec3 fg = mix(vec3(0.75, 1.0, 0.75), vec3(1.0), luminance);
  vec3 finalColor = mix(bg, fg, glyph);

  fragColor = vec4(finalColor, 1.0);
}
