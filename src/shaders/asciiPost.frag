#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uCellSize;

out vec4 fragColor;

// 5x7 bitmap glyph library.
// Chars used (ASCII decimal):
// [32 ' ', 46 '.', 58 ':', 45 '-', 61 '=', 43 '+', 42 '*', 111 'o', 97 'a', 101 'e', 35 '#', 64 '@']
// Intentionally avoids block-drawing ranges like 176-223.
uint glyphRowBits(int glyphIndex, int row) {
  if (glyphIndex == 0) { // ' '
    return 0u;
  }
  if (glyphIndex == 1) { // '.'
    return row == 6 ? 4u : 0u;
  }
  if (glyphIndex == 2) { // ':'
    return (row == 2 || row == 5) ? 4u : 0u;
  }
  if (glyphIndex == 3) { // '-'
    return row == 3 ? 14u : 0u;
  }
  if (glyphIndex == 4) { // '='
    return (row == 2 || row == 4) ? 14u : 0u;
  }
  if (glyphIndex == 5) { // '+'
    if (row == 3) return 14u;
    return (row >= 1 && row <= 5) ? 4u : 0u;
  }
  if (glyphIndex == 6) { // '*'
    if (row == 1 || row == 5) return 17u;
    if (row == 2 || row == 4) return 10u;
    if (row == 3) return 4u;
    return 0u;
  }
  if (glyphIndex == 7) { // 'o'
    if (row == 1 || row == 5) return 14u;
    return (row >= 2 && row <= 4) ? 17u : 0u;
  }
  if (glyphIndex == 8) { // 'a'
    if (row == 2) return 14u;
    if (row == 3) return 1u;
    if (row == 4) return 15u;
    if (row == 5) return 17u;
    if (row == 6) return 15u;
    return 0u;
  }
  if (glyphIndex == 9) { // 'e'
    if (row == 2) return 14u;
    if (row == 3) return 17u;
    if (row == 4) return 31u;
    if (row == 5) return 16u;
    if (row == 6) return 14u;
    return 0u;
  }
  if (glyphIndex == 10) { // '#'
    if (row == 1 || row == 5) return 10u;
    if (row == 2 || row == 4) return 31u;
    return 10u;
  }

  // '@' (glyphIndex == 11)
  if (row == 1 || row == 5) return 14u;
  if (row == 2 || row == 4) return 19u;
  if (row == 3) return 23u;
  return 0u;
}

float glyphMask(int glyphIndex, vec2 uv) {
  vec2 glyphGrid = vec2(5.0, 7.0);

  // Keep a small interior margin so glyphs read clearly in each fixed-size cell.
  vec2 insetUv = (uv - 0.08) / 0.84;
  if (insetUv.x < 0.0 || insetUv.x > 1.0 || insetUv.y < 0.0 || insetUv.y > 1.0) {
    return 0.0;
  }

  ivec2 p = ivec2(floor(insetUv * glyphGrid));
  p = clamp(p, ivec2(0), ivec2(4, 6));

  // Row 0 at top.
  int row = p.y;
  int bit = 4 - p.x;

  uint bits = glyphRowBits(glyphIndex, row);
  return float((bits >> uint(bit)) & 1u);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = max(uCellSize, vec2(1.0));

  // Fixed grid sampling => uniform character width/height.
  vec2 cellOrigin = floor(frag / cell) * cell;
  vec2 center = cellOrigin + 0.5 * cell;
  vec2 sampleUv = center / uResolution;

  vec3 color = texture(uTexture, sampleUv).rgb;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));

  // 12 glyphs from light to dense.
  const float glyphCount = 12.0;
  int glyphIndex = int(floor(clamp(luminance, 0.0, 0.9999) * glyphCount));

  vec2 local = fract(frag / cell);
  float glyph = glyphMask(glyphIndex, local);

  vec3 bg = vec3(0.03, 0.05, 0.04);
  vec3 fg = mix(vec3(0.72, 1.0, 0.72), vec3(1.0), luminance);
  vec3 finalColor = mix(bg, fg, glyph);

  fragColor = vec4(finalColor, 1.0);
}
