#version 300 es
precision highp float;

#define PI 3.14159265359

// ---------------------------------------------------------------------------
// Shared helpers, prepended to every sketch shader.
// Written for Shader Shed. No third-party code.
// ---------------------------------------------------------------------------

// Pseudo-random value in [0, 1) for a 2D point.
//
// Meant for points on a grid: cell ids, row numbers, pixel coordinates. Inputs a
// whole step apart give unrelated outputs. Inputs much closer than that give
// related outputs, so for per-pixel grain pass floor(gl_FragCoord.xy), not vUv.
//
// How it works: the point is projected onto two irrational directions and wrapped
// to [0, 1), which gives every grid point its own spot in the unit square. Three
// rounds of "multiply the two numbers, scale up, keep the fraction" then pull
// neighbouring spots apart until no pattern is left.
float random(vec2 p) {
    vec2 q = fract(vec2(
        dot(p, vec2(0.4142136, 0.7320508)),   // sqrt(2) - 1, sqrt(3) - 1
        dot(p, vec2(0.6457513, 0.2360680))    // sqrt(7) - 2, sqrt(5) - 2
    ));
    q = fract((q + vec2(0.31, 0.73)) * (q.yx + vec2(1.9, 2.7)) * 43.0);
    q = fract((q + vec2(0.57, 0.19)) * (q.yx + vec2(3.1, 1.3)) * 61.0);
    return fract((q.x + 0.4) * (q.y + 2.3) * 17.0);
}

// Smooth noise in [0, 1): one random value per grid point, blended across each cell.
// The blend eases in and out of every grid point, so cell edges leave no creases.
float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 t = p - cell;
    t = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);

    float bottom = mix(random(cell), random(cell + vec2(1.0, 0.0)), t.x);
    float top = mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0, 1.0)), t.x);
    return mix(bottom, top, t.y);
}

// Fractal noise in [0, 0.97): five layers of noise(), each at twice the frequency
// and half the strength of the one before. The grid turns 30 degrees between
// layers so their cells never line up.
float fbm(vec2 p) {
    // Twice a 30 degree rotation: doubles the frequency and turns the grid in one step.
    mat2 nextLayer = mat2(1.7320508, 1.0, -1.0, 1.7320508);

    float total = 0.0;
    float strength = 0.5;
    for (int layer = 0; layer < 5; layer++) {
        total += strength * noise(p);
        p = nextLayer * p + 11.5;
        strength *= 0.5;
    }
    return total;
}

// Smooth union of two distances: like min(a, b), except that where the two are
// within `width` of each other the crease between them is rounded off, so shapes
// melt into one another.
//
// min(a, b) is (a + b - |a - b|) / 2. This swaps |a - b| for a curve that is
// rounded at zero and rejoins |x| exactly at +/-width: the one even quartic that
// meets |x| there with matching value, slope and curvature. Matching all three
// is what keeps the start of the blend from showing as a seam in lighting.
float smoothUnion(float a, float b, float width) {
    float gap = abs(a - b);
    float u = min(gap / width, 1.0);
    float rounded = width * (0.375 + u * u * (0.75 - 0.125 * u * u));
    return min(a, b) - 0.5 * max(rounded - gap, 0.0);
}
