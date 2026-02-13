#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uGlyphAtlas;
uniform vec2 uResolution;
uniform vec2 uCellSize;
uniform vec2 uAtlasGrid;
uniform float uGlyphCount;

in vec2 vUv;
out vec4 fragColor;

float sampleGlyph(vec2 localUv, float glyphIndex) {
  float col = mod(glyphIndex, uAtlasGrid.x);
  float row = floor(glyphIndex / uAtlasGrid.x);

  vec2 cellOrigin = vec2(col, row) / uAtlasGrid;
  vec2 cellUv = (localUv / uAtlasGrid) + cellOrigin;

  return texture(uGlyphAtlas, cellUv).r;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = max(uCellSize, vec2(1.0));

  vec2 cellOriginPx = floor(frag / cell) * cell;
  vec2 cellCenterPx = cellOriginPx + 0.5 * cell;
  vec2 sceneUv = cellCenterPx / uResolution;

  vec3 sourceColor = texture(uTexture, sceneUv).rgb;
  float luminance = dot(sourceColor, vec3(0.2126, 0.7152, 0.0722));

  float clampedLum = clamp(luminance, 0.0, 0.99999);
  float glyphIndex = floor(clampedLum * uGlyphCount);

  vec2 localUv = fract(frag / cell);
  float glyphMask = sampleGlyph(localUv, glyphIndex);

  vec3 bg = vec3(0.03, 0.05, 0.04);
  vec3 fg = mix(vec3(0.78, 1.0, 0.78), vec3(1.0), luminance);
  vec3 color = mix(bg, fg, glyphMask);

  fragColor = vec4(color, 1.0);
}
