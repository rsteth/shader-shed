/**
 * VORONOI CELLS SKETCH
 * Animated cellular patterns with distance-based coloring
 */

export const sim = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

// Voronoi distance
vec2 voronoi(vec2 x, float t) {
    vec2 n = floor(x);
    vec2 f = fract(x);

    float minDist = 8.0;
    vec2 minPoint = vec2(0.0);

    for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
            vec2 neighbor = vec2(float(i), float(j));

            // Random point in cell
            vec2 p = n + neighbor;
            vec2 o = vec2(
                random(p),
                random(p + 100.0)
            );

            // Animate the points
            o = 0.5 + 0.4 * sin(t * 0.5 + 6.2831 * o);

            vec2 diff = neighbor + o - f;
            float dist = length(diff);

            if (dist < minDist) {
                minDist = dist;
                minPoint = p;
            }
        }
    }

    return vec2(minDist, random(minPoint));
}

void main() {
    vec2 st = vUv;
    float t = uTime;

    // Scale and offset based on resolution aspect
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = st * vec2(aspect, 1.0) * 5.0;

    // Mouse influence on voronoi center
    vec2 mouseOffset = (uMouse - 0.5) * 0.5;
    uv += mouseOffset;

    // Compute voronoi
    vec2 v = voronoi(uv, t);
    float dist = v.x;
    float cellId = v.y;

    // Color based on cell ID and distance
    vec3 color;

    // Base color from cell ID
    color.r = sin(cellId * 12.0 + t * 0.3) * 0.5 + 0.5;
    color.g = sin(cellId * 15.0 + t * 0.2 + 2.0) * 0.5 + 0.5;
    color.b = sin(cellId * 18.0 + t * 0.4 + 4.0) * 0.5 + 0.5;

    // Edge highlight
    float edge = 1.0 - smoothstep(0.0, 0.05, dist);
    color = mix(color, vec3(1.0), edge * 0.8);

    // Distance-based darkening
    color *= 0.6 + 0.4 * (1.0 - dist);

    // Subtle feedback for trails
    vec4 prev = texture(uPrevState, st);
    color = mix(prev.rgb * 0.3, color, 0.85);

    fragColor = vec4(color, 1.0);
}
`;

export const final = /* glsl */ `
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Slight saturation boost
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray), color, 1.2);

    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.9, 0.2, dist);

    fragColor = vec4(color, uOpacity);
}
`;
