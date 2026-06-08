"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[65],{410:(e,t,o)=>{o.d(t,{Jz:()=>a,$m:()=>n,h:()=>i,$$:()=>r,jI:()=>l});let r={ripple:{name:"Ripple Flow",description:"Interactive fluid ripples with curl noise",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;

    // Read previous state
    vec4 old = texture(uPrevState, st);

    // Simple diffusion / decay
    float decay = 0.99;

    // Interactive ripple at mouse position
    float dist = distance(st, uMouse);
    float ripple = smoothstep(0.05, 0.0, dist) * 2.0;

    // Fluid-like curl noise displacement
    vec2 flow = vec2(
        fbm(st * 3.0 + uTime * 0.1),
        fbm(st * 3.0 + uTime * 0.1 + 10.0)
    ) * 2.0 - 1.0;

    vec2 offset = flow * pixel * 2.0;
    vec4 displaced = texture(uPrevState, st - offset);

    vec3 color = displaced.rgb * decay;
    color += vec3(ripple);

    fragColor = vec4(color, 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.8, 0.2, dist);

    fragColor = vec4(color, uOpacity);
}
`,includeInSlideshow:!1},plasma:{name:"Plasma",description:"Classic plasma effect with sine waves",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    float t = uTime * 0.5;

    // Classic plasma: sum of sine waves at different frequencies
    float v = 0.0;

    // Layer 1: horizontal waves
    v += sin(st.x * 10.0 + t);

    // Layer 2: vertical waves
    v += sin(st.y * 10.0 + t * 0.8);

    // Layer 3: diagonal
    v += sin((st.x + st.y) * 10.0 + t * 0.6);

    // Layer 4: radial from center
    float cx = st.x - 0.5;
    float cy = st.y - 0.5;
    v += sin(sqrt(cx * cx + cy * cy) * 20.0 - t * 2.0);

    // Layer 5: radial from mouse
    float mx = st.x - uMouse.x;
    float my = st.y - uMouse.y;
    v += sin(sqrt(mx * mx + my * my) * 15.0 - t * 3.0) * 0.5;

    // Normalize to 0-1
    v = (v + 5.0) / 10.0;

    // Map to colors using sine for smooth cycling
    vec3 color;
    color.r = sin(v * 3.14159 * 2.0) * 0.5 + 0.5;
    color.g = sin(v * 3.14159 * 2.0 + 2.094) * 0.5 + 0.5;
    color.b = sin(v * 3.14159 * 2.0 + 4.188) * 0.5 + 0.5;

    fragColor = vec4(color, 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Slight contrast boost
    color = pow(color, vec3(0.9));

    // Soft vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.9, 0.3, dist);

    fragColor = vec4(color, uOpacity);
}
`,includeInSlideshow:!1},gradient:{name:"Gradient Drift",description:"Smooth flowing color gradients",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

// Rotate a 2D vector
vec2 rotate(vec2 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

void main() {
    vec2 st = vUv;
    vec2 pixel = 1.0 / uResolution;
    float t = uTime * 0.3;

    // Generate flowing gradient based on noise
    float n1 = fbm(st * 2.0 + t * 0.2);
    float n2 = fbm(st * 2.0 - t * 0.15 + 100.0);
    float n3 = fbm(st * 3.0 + vec2(t * 0.1, -t * 0.12));

    // Color palette using smooth interpolation
    vec3 c1 = vec3(0.1, 0.2, 0.5);  // Deep blue
    vec3 c2 = vec3(0.4, 0.1, 0.5);  // Purple
    vec3 c3 = vec3(0.1, 0.4, 0.4);  // Teal
    vec3 c4 = vec3(0.5, 0.2, 0.3);  // Mauve

    // Mix colors based on noise
    vec3 color = mix(c1, c2, n1);
    color = mix(color, c3, n2);
    color = mix(color, c4, n3 * 0.5);

    // Read previous frame with slight offset for trails
    vec2 flowDir = rotate(vec2(1.0, 0.0), n1 * 6.28);
    vec4 prev = texture(uPrevState, st - flowDir * pixel * 1.5);

    // Blend with previous for smooth trails
    color = mix(prev.rgb * 0.95, color, 0.15);

    // Mouse interaction - brighten near cursor
    float mouseDist = distance(st, uMouse);
    float mouseGlow = smoothstep(0.15, 0.0, mouseDist);
    color += mouseGlow * vec3(0.3, 0.2, 0.4);

    fragColor = vec4(color, 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;
uniform vec2 uResolution;

void main() {
    vec4 tex = texture(uTexture, vUv);
    vec3 color = tex.rgb;

    // Subtle brightness variation
    color *= 1.0 + sin(uTime * 0.2) * 0.1;

    // Clamp to prevent blowout
    color = clamp(color, 0.0, 1.0);

    // Vignette
    float dist = distance(vUv, vec2(0.5));
    color *= smoothstep(0.85, 0.25, dist);

    fragColor = vec4(color, uOpacity);
}
`,includeInSlideshow:!1},voronoi:{name:"Voronoi Cells",description:"Animated cellular pattern",sim:`
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
`,final:`
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
`,includeInSlideshow:!1},eclipseWeave:{name:"Eclipse Weave",description:"Earth and sky corridor fading into atmospheric haze",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

void main() {
    vec2 st = vUv;
    vec2 px = 1.0 / uResolution;
    float t = uTime;

    float horizon = 0.5 + (uMouse.y - 0.5) * 0.08;
    float signedHeight = st.y - horizon;
    float planeSel = step(0.0, signedHeight); // 0=floor, 1=ceiling

    float depth = 1.0 / (abs(signedHeight) + 0.035);
    depth = clamp(depth, 0.0, 26.0);

    vec2 world = vec2((st.x - 0.5) * depth, depth + t * 0.45);

    vec2 drift = vec2(
        fbm(world * vec2(0.18, 0.12) + vec2(0.0, t * 0.08)),
        fbm(world.yx * vec2(0.12, 0.21) + vec2(12.0, -t * 0.07))
    ) - 0.5;

    vec2 weaveWorld = world + drift * 2.6;

    float floorGrid = sin(weaveWorld.x * 1.7 + t * 0.4) * sin(weaveWorld.y * 0.34 - t * 0.7);
    float floorRidges = fbm(weaveWorld * vec2(0.45, 0.25) + vec2(3.0, 0.0));

    float skyBands = sin(weaveWorld.x * 1.15 - t * 0.22 + fbm(weaveWorld * 0.17) * 3.0);
    float skyCloud = fbm(weaveWorld * vec2(0.22, 0.18) - vec2(9.0, t * 0.05));

    vec3 floorCol = mix(vec3(0.06, 0.08, 0.12), vec3(0.45, 0.33, 0.22), floorRidges);
    floorCol += vec3(0.2, 0.16, 0.12) * smoothstep(0.2, 0.9, floorGrid * 0.5 + 0.5);

    vec3 skyCol = mix(vec3(0.03, 0.07, 0.16), vec3(0.35, 0.6, 0.95), skyCloud);
    skyCol += vec3(0.35, 0.5, 0.8) * smoothstep(0.4, 0.95, skyBands * 0.5 + 0.5);

    vec3 planeColor = mix(floorCol, skyCol, planeSel);

    float haze = smoothstep(2.0, 18.0, depth);
    vec3 fogCol = mix(vec3(0.22, 0.2, 0.18), vec3(0.62, 0.68, 0.76), planeSel);
    planeColor = mix(planeColor, fogCol, haze * 0.82);

    float horizonGlow = exp(-abs(signedHeight) * 55.0);
    planeColor += vec3(0.35, 0.32, 0.28) * horizonGlow * (1.0 - 0.45 * planeSel);

    vec2 flow = vec2(drift.y, -drift.x);
    vec2 carry = flow * px * (8.0 + depth * 0.6);
    vec3 prev = texture(uPrevState, st - carry).rgb * (0.972 - 0.16 * uDt);

    float transfer = smoothstep(0.28, 0.0, distance(st, uMouse));
    float inject = 0.07 + 0.11 * transfer + 0.08 * smoothstep(4.0, 16.0, depth);
    vec3 color = mix(prev, planeColor, inject);

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    float grain = fract(sin(dot(vUv + uTime * 0.001, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.012;

    float vignette = smoothstep(0.98, 0.16, distance(vUv, vec2(0.5, 0.53)));
    color *= vignette;

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`},sdfTwistedLinks:{name:"SDF Twisted Links",description:"Raymarched chain-like torus links with orbital twist",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(0.6 * q.y + uTime * 0.35);

    float d = 1e5;
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec3 r = q;
        r.xz *= rot(fi * 2.094 + uTime * 0.2);
        r.x -= 0.85;
        d = min(d, sdTorus(r, vec2(0.36, 0.12)));
    }

    float core = length(q) - 0.33;
    return min(d, core);
}

vec3 shade(vec3 ro, vec3 rd) {
    float t = 0.0;
    float hit = -1.0;

    for (int i = 0; i < 96; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) {
            hit = t;
            break;
        }
        t += d * 0.75;
        if (t > 12.0) break;
    }

    vec3 sky = mix(vec3(0.02, 0.03, 0.07), vec3(0.08, 0.11, 0.2), rd.y * 0.5 + 0.5);
    if (hit < 0.0) return sky;

    vec3 p = ro + rd * hit;
    vec2 e = vec2(0.002, 0.0);
    vec3 n = normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));

    vec3 l = normalize(vec3(-0.4, 0.8, 0.35));
    float diff = max(dot(n, l), 0.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);

    vec3 base = mix(vec3(0.2, 0.15, 0.5), vec3(0.8, 0.35, 0.55), sin(p.y * 5.0 + uTime) * 0.5 + 0.5);
    return base * (0.18 + diff * 0.82) + rim * vec3(0.6, 0.45, 0.9) + sky * 0.15;
}

void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= uResolution.x / uResolution.y;

    vec2 mouse = (uMouse - 0.5) * vec2(2.4, 1.8);
    vec3 ro = vec3(0.0 + mouse.x * 0.15, 0.0 + mouse.y * 0.15, 3.6);
    vec3 ta = vec3(0.0);

    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.7);

    vec3 color = shade(ro, rd);

    vec2 px = 1.0 / uResolution;
    vec3 prev = texture(uPrevState, vUv - vec2(px.x, 0.0) * 0.6).rgb;
    color = mix(prev * (0.97 - uDt * 0.08), color, 0.18);

    fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = pow(color, vec3(0.92));
    color += (sin((vUv.y + uTime * 0.08) * 420.0) * 0.5 + 0.5) * 0.01;
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,includeInSlideshow:!1},sdfGyroidPulse:{name:"SDF Gyroid Pulse",description:"Oscillating gyroid shell with neon cavity lighting",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float gyroid(vec3 p) {
    return dot(sin(p), cos(p.zxy));
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(uTime * 0.25);
    float shell = abs(length(q) - 1.35) - 0.18;
    float maze = abs(gyroid(q * 3.4 + uTime * 0.35)) / 3.4 - 0.05;
    return max(shell, -maze);
}

vec3 render(vec3 ro, vec3 rd) {
    float t = 0.0;
    float h = -1.0;

    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) {
            h = t;
            break;
        }
        t += d * 0.9;
        if (t > 14.0) break;
    }

    vec3 bg = mix(vec3(0.015, 0.02, 0.04), vec3(0.09, 0.16, 0.25), rd.y * 0.5 + 0.5);
    if (h < 0.0) return bg;

    vec3 p = ro + rd * h;
    vec2 e = vec2(0.002, 0.0);
    vec3 n = normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));

    vec3 l1 = normalize(vec3(0.6, 0.8, 0.2));
    vec3 l2 = normalize(vec3(-0.4, 0.3, -0.9));
    float diff = max(dot(n, l1), 0.0) + max(dot(n, l2), 0.0) * 0.35;
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.5);

    float pulse = sin(7.0 * gyroid(p * 2.2) + uTime * 2.0) * 0.5 + 0.5;
    vec3 base = mix(vec3(0.1, 0.5, 0.5), vec3(0.8, 0.9, 0.35), pulse);

    return base * (0.12 + diff) + fres * vec3(0.55, 0.9, 1.0);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(3.1415, 1.4);
    vec3 ro = vec3(0.0, 0.0, 3.3);
    ro.xz *= rot(m.x * 0.35);
    ro.y += m.y * 0.3;
    vec3 rd = normalize(vec3(uv, -1.6));

    vec3 col = render(ro, rd);
    vec3 prev = texture(uPrevState, vUv).rgb;
    col = mix(prev * (0.965 - uDt * 0.08), col, 0.2);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = smoothstep(0.0, 1.0, color);
    fragColor = vec4(color, uOpacity);
}
`,includeInSlideshow:!1},sdfMengerBloom:{name:"SDF Menger Bloom",description:"Folded octahedral crystal shell with blooming highlights",sim:`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float sdOcta(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

vec3 foldSort(vec3 p) {
    // Branch-light coordinate sorting to reduce driver sensitivity.
    p = abs(p);
    float a = max(p.x, p.y);
    float b = min(p.x, p.y);
    float c = max(b, p.z);
    float d = min(b, p.z);
    return vec3(a, c, d);
}

float latticeField(vec3 p) {
    float d = 1e4;
    float scale = 1.0;

    for (int i = 0; i < 4; i++) {
        p = foldSort(p);
        p = p * 2.0 - vec3(1.15, 0.95, 0.85);
        p.yz *= rot(0.45 + float(i) * 0.22 + uTime * 0.06);

        float cell = sdOcta(p, 1.18) / scale;
        d = min(d, cell);
        scale *= 2.0;
    }

    return d;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.xz *= rot(uTime * 0.22);
    q.yz *= rot(0.3 + sin(uTime * 0.45) * 0.2);

    float lattice = latticeField(q * 0.88);
    float shell = abs(length(q) - 1.55) - 0.2;
    return max(lattice, shell);
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(2.6, 1.5);
    vec3 ro = vec3(0.0, 0.15 + m.y * 0.32, 3.7);
    ro.xz *= rot(m.x * 0.42 + uTime * 0.12);

    vec3 ta = vec3(0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.85);

    float t = 0.0;
    float hit = -1.0;

    for (int i = 0; i < 110; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.0012) {
            hit = t;
            break;
        }
        t += d * 0.88;
        if (t > 14.0) break;
    }

    vec3 bg = mix(vec3(0.012, 0.014, 0.032), vec3(0.075, 0.03, 0.11), vUv.y + 0.1);
    vec3 col = bg;

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(0.45, 0.82, -0.35));

        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 24.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.8);

        // Avoid re-running latticeField in shading; use cheap animated sparkle signal.
        float sparkle = sin((p.x + p.y + p.z) * 8.0 - uTime * 3.2) * 0.5 + 0.5;
        vec3 base = mix(vec3(0.2, 0.24, 0.72), vec3(0.9, 0.44, 0.8), sparkle);

        col = base * (0.16 + diff * 0.86);
        col += spec * vec3(1.0, 0.95, 1.0);
        col += fres * vec3(0.42, 0.78, 1.0);
        col = mix(bg, col, exp(-hit * 0.1));
    }

    vec2 carry = vec2(1.0 / uResolution.x, 1.0 / uResolution.y) * 0.6;
    vec3 prev = texture(uPrevState, vUv - carry).rgb;
    col = mix(prev * (0.969 - uDt * 0.07), col, 0.22);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = pow(color, vec3(0.94, 0.96, 0.98));
    color += vec3(0.01, 0.006, 0.015) * (sin(uTime * 0.9 + vUv.x * 12.0) * 0.5 + 0.5);
    color *= smoothstep(0.98, 0.22, distance(vUv, vec2(0.5)));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,includeInSlideshow:!1},sdfOrbitalBlobs:{name:"SDF Orbital Blobs",description:"Metaball cluster of orbiting blobs and glossy highlights",sim:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float sphere(vec3 p, float r) { return length(p) - r; }

float mapScene(vec3 p) {
    float d = 1e5;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang = fi * 1.047 + uTime * (0.4 + fi * 0.03);
        vec3 c = vec3(cos(ang), sin(ang * 1.2), sin(ang)) * vec3(0.9, 0.45, 0.9);
        float r = 0.26 + 0.05 * sin(uTime * 2.0 + fi * 1.7);
        d = smin(d, sphere(p - c, r), 0.5);
    }
    d = smin(d, sphere(p, 0.42), 0.6);
    return d;
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * 2.0;
    vec3 ro = vec3(m.x * 0.9, m.y * 0.4, 3.2);
    vec3 rd = normalize(vec3(uv, -1.7));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 90; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.85;
        if (t > 12.0) break;
    }

    vec3 col = mix(vec3(0.01, 0.01, 0.03), vec3(0.08, 0.04, 0.1), vUv.y + 0.2);
    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(-0.6, 0.75, 0.45));
        float diff = max(dot(n, l), 0.0);
        float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 24.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
        vec3 base = mix(vec3(0.2, 0.55, 0.95), vec3(0.95, 0.25, 0.8), p.y * 0.7 + 0.5);
        col = base * (0.18 + diff * 0.8) + spec * vec3(1.0) * 0.9 + fres * vec3(0.45, 0.85, 1.0);
    }

    vec2 drift = vec2(1.0 / uResolution.x, -1.0 / uResolution.y) * 0.8;
    vec3 prev = texture(uPrevState, vUv - drift).rgb;
    col = mix(prev * (0.97 - uDt * 0.06), col, 0.2);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = pow(color, vec3(1.05, 1.0, 0.95));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,includeInSlideshow:!1},sdfCappedColumns:{name:"SDF Capped Columns",description:"Spiraling capped columns with floating bridge rings",sim:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float sdCappedCylinder(vec3 p, float h, float r) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.y += 0.4;

    // Spiral columns around the center axis.
    float floorId = floor((q.y + 1.5) / 0.9);
    float twist = floorId * 0.38 + uTime * 0.28;
    q.xz *= rot(twist);

    float a = atan(q.z, q.x);
    float ringRadius = 1.35 + 0.12 * sin(floorId * 1.7 + uTime * 0.9);
    vec2 ring = vec2(cos(a), sin(a)) * ringRadius;

    vec3 local = q;
    local.xz -= ring;
    float column = sdCappedCylinder(local, 0.45, 0.16);

    // Ornamental caps.
    float topCap = length(local - vec3(0.0, 0.47, 0.0)) - 0.2;
    float bottomCap = length(local - vec3(0.0, -0.47, 0.0)) - 0.18;

    // Floating bridge rings between column layers.
    vec3 bridge = q;
    bridge.y = mod(bridge.y + 0.45, 0.9) - 0.45;
    float bridgeRing = sdTorus(bridge, vec2(1.35, 0.05));

    // Thin central core for silhouette structure.
    float core = sdCappedCylinder(p, 2.8, 0.09);

    return min(min(min(column, topCap), bottomCap), min(bridgeRing, core));
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(2.0, 1.2);
    vec3 ro = vec3(2.0 * sin(uTime * 0.17 + m.x), m.y * 0.9, 2.0 * cos(uTime * 0.17 + m.x));
    vec3 ta = vec3(0.0, 0.2, 0.0);

    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uu * uv.x + vv * uv.y + ww * 1.8);

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 110; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.82;
        if (t > 16.0) break;
    }

    vec3 fogCol = vec3(0.02, 0.025, 0.05);
    vec3 col = fogCol + vec3(0.02, 0.015, 0.04) / (0.3 + length(uv));

    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l1 = normalize(vec3(0.4, 0.85, 0.3));
        vec3 l2 = normalize(vec3(-0.6, 0.4, -0.5));

        float diff = max(dot(n, l1), 0.0) + 0.35 * max(dot(n, l2), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

        float band = sin((p.y + atan(p.z, p.x)) * 6.0 + uTime * 1.4) * 0.5 + 0.5;
        vec3 stone = mix(vec3(0.18, 0.2, 0.28), vec3(0.62, 0.54, 0.42), band);

        col = stone * (0.14 + diff * 0.82) + fres * vec3(0.65, 0.78, 0.95) * 0.65;
        col = mix(fogCol, col, exp(-hit * 0.1));
    }

    vec2 drift = vec2(1.0 / uResolution.x, -1.0 / uResolution.y) * 0.45;
    vec3 prev = texture(uPrevState, vUv - drift).rgb;
    col = mix(prev * (0.973 - uDt * 0.06), col, 0.2);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    float glow = sin((vUv.y + uTime * 0.08) * 220.0) * 0.5 + 0.5;
    color += vec3(0.012, 0.01, 0.02) * glow;
    color *= smoothstep(0.97, 0.2, distance(vUv, vec2(0.5)));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,includeInSlideshow:!1},sdfKnotTunnel:{name:"SDF Knot Tunnel",description:"Interlocked torus knots repeating down a tunnel",sim:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float mapScene(vec3 p) {
    vec3 q = p;
    q.z += uTime * 2.0;
    q.z = mod(q.z + 1.4, 2.8) - 1.4;

    q.xy *= rot(sin(p.z * 0.8 + uTime) * 0.8);

    float a = sdTorus(q, vec2(0.75, 0.11));
    vec3 r = q;
    r.yz *= rot(1.57);
    float b = sdTorus(r, vec2(0.75, 0.11));

    float knot = min(a, b);
    float shell = abs(length(p.xy) - 1.25) - 0.03;
    return min(knot, shell);
}

vec3 normal(vec3 p) {
    vec2 e = vec2(0.002, 0.0);
    return normalize(vec3(
        mapScene(p + e.xyy) - mapScene(p - e.xyy),
        mapScene(p + e.yxy) - mapScene(p - e.yxy),
        mapScene(p + e.yyx) - mapScene(p - e.yyx)
    ));
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec2 m = (uMouse - 0.5) * vec2(1.8, 1.0);
    vec3 ro = vec3(m.x * 0.4, m.y * 0.4, 3.0);
    vec3 rd = normalize(vec3(uv * vec2(0.95, 0.8), -1.4));

    float t = 0.0;
    float hit = -1.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = mapScene(p);
        if (d < 0.001) { hit = t; break; }
        t += d * 0.82;
        if (t > 16.0) break;
    }

    vec3 col = vec3(0.01, 0.015, 0.03) + 0.02 / (0.3 + length(uv));
    if (hit > 0.0) {
        vec3 p = ro + rd * hit;
        vec3 n = normal(p);
        vec3 l = normalize(vec3(-0.5, 0.7, 0.45));
        float diff = max(dot(n, l), 0.0);
        float fres = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);
        vec3 base = mix(vec3(0.12, 0.45, 0.8), vec3(0.85, 0.2, 0.65), sin(p.z * 4.0 + uTime * 3.0) * 0.5 + 0.5);
        col = base * (0.16 + diff * 0.88) + fres * vec3(0.8, 0.95, 1.0);
        col = mix(vec3(0.03, 0.04, 0.06), col, exp(-hit * 0.08));
    }

    vec2 shift = vec2(1.0 / uResolution.x, 0.0) * sin(uTime * 0.5);
    vec3 prev = texture(uPrevState, vUv - shift).rgb;
    col = mix(prev * (0.972 - uDt * 0.06), col, 0.2);

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,final:`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = color * 1.03 + vec3(0.004, 0.003, 0.008);
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,includeInSlideshow:!1}},i=Object.keys(r),l=i.filter(e=>!1!==r[e].includeInSlideshow),a="ripple";function n(e){return r[e]||r[a]}},4065:(e,t,o)=>{o.d(t,{default:()=>T});var r=o(5155),i=o(2115);class l{constructor(){this.state={uTime:0,uResolution:[1,1],uMouse:[.5,.5],uScroll:0,uOpacity:1,uDt:.016}}update(e){this.state.uTime+=e,this.state.uDt=e}resize(e,t){this.state.uResolution=[e,t]}setMouse(e,t){this.state.uMouse=[e,1-t]}setScroll(e){this.state.uScroll=e}}var a=o(8867),n=o.n(a);function c(e,t){try{return e.getExtension(t)}catch{return null}}function s(e,t,o){let r,i,l;if(t)i=e.RGBA,"float"===o?(r=e.RGBA32F,l=e.FLOAT):(r=e.RGBA16F,l=e.HALF_FLOAT);else if(r=e.RGBA,i=e.RGBA,"float"===o)l=e.FLOAT;else{let t=c(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;l=t.HALF_FLOAT_OES}let a=e.createTexture(),n=e.createFramebuffer();if(!a||!n)return!1;let s=!1;try{if(e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,l,null),e.getError()!==e.NO_ERROR)return!1;e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),(s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE)&&(e.viewport(0,0,4,4),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.getError()!==e.NO_ERROR&&(s=!1))}catch{s=!1}finally{e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(a),e.deleteFramebuffer(n)}return s}function u(e,t,o){let r,i,l;if(t)i=e.RGBA,"float"===o?(r=e.RGBA32F,l=e.FLOAT):(r=e.RGBA16F,l=e.HALF_FLOAT);else if(r=e.RGBA,i=e.RGBA,"float"===o)l=e.FLOAT;else{let t=c(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;l=t.HALF_FLOAT_OES}let a=e.createTexture();if(!a)return!1;let n=!1;try{e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,l,null),n=e.getError()===e.NO_ERROR}catch{n=!1}finally{e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(a)}return n}function v(e,t,o,r,i,l){let a=t._texture?.texture;if(!a)return console.warn("[render-target] Could not access regl texture internals"),!1;let n="linear"===l?e.LINEAR:e.NEAREST,c="half float"===i?e.RGBA16F:e.RGBA32F,s="half float"===i?e.HALF_FLOAT:e.FLOAT;try{e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,c,o,r,0,e.RGBA,s,null);let t=e.getError();if(e.bindTexture(e.TEXTURE_2D,null),t!==e.NO_ERROR)return console.warn(`[render-target] GL error reinitializing texture: ${t}`),!1;return!0}catch(t){return e.bindTexture(e.TEXTURE_2D,null),console.warn("[render-target] Exception reinitializing texture:",t),!1}}function f(e,t,o){let{width:r,height:i,linear:l=!1}=o,a=[],n=e._gl,c=[];for(let o of(t.isWebGL2,t.canRTTHalfFloat&&c.push("half float"),t.canRTTFloat&&c.push("float"),c.push("uint8"),c)){let c,u="linear"==(c=l&&("half float"===o&&t.canLinearHalfFloat||"float"===o&&t.canLinearFloat||"uint8"===o)?"linear":"nearest")?"linear":"nearest",f="linear"===c?"linear":"nearest";try{let l;if(t.isWebGL2&&("half float"===o||"float"===o)){if(l=e.texture({width:r,height:i,type:"uint8",format:"rgba",min:u,mag:f,wrap:"clamp"}),!v(n,l,r,i,o,c)){l.destroy(),a.push(o),console.warn(`[render-target] Failed to reinit texture as ${o}`);continue}}else l=e.texture({width:r,height:i,type:o,format:"rgba",min:u,mag:f,wrap:"clamp"});let m=e.framebuffer({color:l,depth:!1,stencil:!1}),p=!0;try{m.use(()=>{e.clear({color:[0,0,0,1]})})}catch{p=!1}if(p){var s;let e=(s=m,s._framebuffer?.framebuffer);if(e){n.bindFramebuffer(n.FRAMEBUFFER,e);let t=n.checkFramebufferStatus(n.FRAMEBUFFER);n.bindFramebuffer(n.FRAMEBUFFER,null),t!==n.FRAMEBUFFER_COMPLETE&&(p=!1)}}if(!p){m.destroy(),l.destroy(),a.push(o),console.warn(`[render-target] ${o} FBO validation failed, trying next format`);continue}let d=t.isWebGL2&&("half float"===o||"float"===o),h={},x=(t,r)=>{if(d){m.destroy(),l.destroy();let i=e.texture({width:t,height:r,type:"uint8",format:"rgba",min:u,mag:f,wrap:"clamp"});v(n,i,t,r,o,c);let a=e.framebuffer({color:i,depth:!1,stencil:!1});l=i,m=a,h.fbo=a,h.colorTex=i}else m.resize(t,r)},g=()=>{m.destroy(),l.destroy()};return h.fbo=m,h.colorTex=l,h.type=o,h.filter=c,h.fallbackFrom=a.length>0?a:void 0,h.resize=x,h.destroy=g,h}catch(e){a.push(o),console.warn(`[render-target] Failed to create ${o} FBO:`,e);continue}}throw Error("Failed to create any render target format")}let m="#version 300 es\nprecision highp float;\n\n#define PI 3.14159265359\n\n// Common utility functions for noise and math\nfloat random(vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\n// 2D Noise based on Morgan McGuire @morgan3d\n// https://www.shadertoy.com/view/4dS3Wd\nfloat noise (in vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n\n    // Four corners in 2D of a tile\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n\n    vec2 u = f * f * (3.0 - 2.0 * f);\n\n    return mix(a, b, u.x) +\n            (c - a)* u.y * (1.0 - u.x) +\n            (d - b) * u.x * u.y;\n}\n\nfloat fbm (in vec2 st) {\n    float value = 0.0;\n    float amplitude = .5;\n    // Loop of octaves\n    for (int i = 0; i < 5; i++) {\n        value += amplitude * noise(st);\n        st *= 2.;\n        amplitude *= .5;\n    }\n    return value;\n}",p="#version 300 es\nprecision highp float;\n\nin vec2 position;\nout vec2 vUv;\n\nvoid main() {\n  vUv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}";var d=o(410);let h=" .'`^\\\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";function x(e,t,o){if(t.isWebGL2)return e;let r=e.replace(/^\s*#version\s+300\s+es\s*\n/,"").replace(/\btexture\s*\(/g,"texture2D(");return"vertex"===o?r.replace(/\bin\s+vec2\s+position\s*;/,"attribute vec2 position;").replace(/\bout\s+vec2\s+vUv\s*;/,"varying vec2 vUv;"):r.replace(/\bin\s+vec2\s+vUv\s*;/g,"varying vec2 vUv;").replace(/\bout\s+vec4\s+fragColor\s*;/g,"").replace(/\bfragColor\b/g,"gl_FragColor")}class g{constructor(e,t,o,r=d.Jz){this.tickCount=0,this.asciiEnabled=!1,this.regl=e,this.uniforms=t,this.caps=o,this.currentSketchId=r,this.rt1=f(e,o,{width:1,height:1,linear:!0}),this.rt2=f(e,o,{width:1,height:1,linear:!0}),this.postRt=f(e,o,{width:1,height:1,linear:!1});const i=function(e){let t=h.length,o=Math.ceil(t/16),r=document.createElement("canvas");r.width=160,r.height=16*o;let i=r.getContext("2d");if(!i)throw Error("Unable to create 2D context for ASCII glyph atlas.");i.clearRect(0,0,r.width,r.height),i.fillStyle="#ffffff",i.font="14px monospace",i.textAlign="center",i.textBaseline="middle";for(let e=0;e<t;e++){let t=e%16*10+5,o=16*Math.floor(e/16)+8;i.fillText(h[e],t,o)}return{texture:e.texture({data:r,mag:"nearest",min:"nearest",wrapS:"clamp",wrapT:"clamp"}),atlasGrid:[16,o],glyphCount:t}}(e);this.asciiGlyphAtlas=i.texture,this.asciiAtlasGrid=i.atlasGrid,this.asciiGlyphCount=i.glyphCount,console.log(`[pipeline] Using RT type: ${this.rt1.type}, filter: ${this.rt1.filter}`+(this.rt1.fallbackFrom?` (fallback from: ${this.rt1.fallbackFrom.join(", ")})`:""));const l=(0,d.$m)(r);this.cmdSim=this.createSimCommand(l),this.cmdFinal=this.createFinalCommand(l),this.cmdAscii=this.createAsciiCommand()}createSimCommand(e){let t=x(m+"\n"+e.sim,this.caps,"fragment"),o=x(p,this.caps,"vertex");return this.regl({frag:t,vert:o,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uPrevState:this.regl.prop("inputTexture"),uTime:()=>this.uniforms.state.uTime,uResolution:()=>this.uniforms.state.uResolution,uMouse:()=>this.uniforms.state.uMouse,uDt:()=>this.uniforms.state.uDt},framebuffer:this.regl.prop("outputFbo")})}createFinalCommand(e){let t=x(m+"\n"+e.final,this.caps,"fragment"),o=x(p,this.caps,"vertex");return this.regl({frag:t,vert:o,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uTexture:this.regl.prop("inputTexture"),uTime:()=>this.uniforms.state.uTime,uOpacity:()=>this.uniforms.state.uOpacity,uResolution:()=>this.uniforms.state.uResolution},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}createAsciiCommand(){let e=x("#version 300 es\nprecision highp float;\n\nuniform sampler2D uTexture;\nuniform sampler2D uGlyphAtlas;\nuniform vec2 uResolution;\nuniform vec2 uCellSize;\nuniform vec2 uAtlasGrid;\nuniform float uGlyphCount;\n\nin vec2 vUv;\nout vec4 fragColor;\n\nfloat sampleGlyph(vec2 localUv, float glyphIndex) {\n  float col = mod(glyphIndex, uAtlasGrid.x);\n  float row = floor(glyphIndex / uAtlasGrid.x);\n\n  vec2 cellOrigin = vec2(col, row) / uAtlasGrid;\n  vec2 cellUv = (localUv / uAtlasGrid) + cellOrigin;\n\n  return texture(uGlyphAtlas, cellUv).r;\n}\n\nvoid main() {\n  vec2 frag = gl_FragCoord.xy;\n  vec2 cell = max(uCellSize, vec2(1.0));\n\n  vec2 cellOriginPx = floor(frag / cell) * cell;\n  vec2 cellCenterPx = cellOriginPx + 0.5 * cell;\n  vec2 sceneUv = cellCenterPx / uResolution;\n\n  vec3 sourceColor = texture(uTexture, sceneUv).rgb;\n  float luminance = dot(sourceColor, vec3(0.2126, 0.7152, 0.0722));\n\n  float clampedLum = clamp(luminance, 0.0, 0.99999);\n  float glyphIndex = floor(clampedLum * uGlyphCount);\n\n  vec2 localUv = fract(frag / cell);\n  float glyphMask = sampleGlyph(localUv, glyphIndex);\n\n  vec3 bg = vec3(0.0);\n  vec3 color = mix(bg, sourceColor, glyphMask);\n\n  fragColor = vec4(color, 1.0);\n}\n",this.caps,"fragment"),t=x(p,this.caps,"vertex");return this.regl({frag:e,vert:t,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uTexture:this.regl.prop("inputTexture"),uGlyphAtlas:()=>this.asciiGlyphAtlas,uResolution:()=>this.uniforms.state.uResolution,uCellSize:()=>[10,16],uAtlasGrid:()=>this.asciiAtlasGrid,uGlyphCount:()=>this.asciiGlyphCount},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}setSketch(e){if(e===this.currentSketchId)return;let t=(0,d.$m)(e);console.log(`[pipeline] Switching to sketch: ${t.name}`),this.cmdSim=this.createSimCommand(t),this.cmdFinal=this.createFinalCommand(t),this.currentSketchId=e,this.clearTargets()}setAsciiEnabled(e){this.asciiEnabled=e}clearTargets(){this.regl({framebuffer:this.rt1.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})}),this.regl({framebuffer:this.rt2.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})})}resize(e,t){this.rt1.resize(e,t),this.rt2.resize(e,t),this.postRt.resize(e,t),this.uniforms.resize(e,t)}render(){this.tickCount++;let e=this.tickCount%2==0?this.rt1:this.rt2,t=this.tickCount%2==0?this.rt2:this.rt1;this.cmdSim({inputTexture:e.colorTex,outputFbo:t.fbo}),this.cmdFinal({inputTexture:t.colorTex,outputFbo:this.asciiEnabled?this.postRt.fbo:null}),this.asciiEnabled&&this.cmdAscii({inputTexture:this.postRt.colorTex,outputFbo:null})}dispose(){this.rt1.destroy(),this.rt2.destroy(),this.postRt.destroy(),this.asciiGlyphAtlas.destroy()}}let y=(0,i.forwardRef)(({mode:e="contained",sketch:t=d.Jz,asciiMode:o=!1,onLoaded:a,className:v="",style:f},m)=>{let p,h=(0,i.useRef)(null),x=(0,i.useRef)(null),[y,T]=(0,i.useState)(null),b=(0,i.useRef)(null);return(0,i.useImperativeHandle)(m,()=>({setSketch:e=>{b.current&&b.current.pipeline.setSketch(e)},getCurrentSketch:()=>b.current?.pipeline.currentSketchId||d.Jz}),[]),(0,i.useEffect)(()=>{b.current&&t&&b.current.pipeline.setSketch(t)},[t]),(0,i.useEffect)(()=>{b.current&&b.current.pipeline.setAsciiEnabled(o)},[o]),(0,i.useEffect)(()=>{if(h.current&&x.current)try{let r,i,v,f,m,p=x.current,{regl:d,caps:y}=function(e={}){let{canvas:t=document.createElement("canvas"),preferWebGL2:o=!0,requireWebGL2:r=!1,attributes:i={}}=e,l={alpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,...i},a=null,v=!1;if(o)try{(a=t.getContext("webgl2",l))&&(v=!0)}catch{}if(!a)try{(a=t.getContext("webgl",l))||(a=t.getContext("experimental-webgl",l))}catch{}if(!a)throw Error("WebGL is not supported in this browser");if(console.log(`[regl] Context: ${a.constructor.name}`),r&&!v)throw Error("WebGL2 was requested but only WebGL1 is available");let f=["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear","EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float"];for(let e of f)try{a.getExtension(e)}catch{}let m=n()({gl:a,optionalExtensions:f});m._gl!==a&&console.warn("[regl] WARNING: regl._gl !== gl passed to constructor"),console.log(`[regl] regl._gl: ${m._gl.constructor.name}`);let p=function(e,t){let o,r,i=function(e,t){let o=[];for(let r of t)c(e,r)&&o.push(r);return o}(e,["EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float","OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear"]),l=t||i.includes("OES_texture_float"),a=t||i.includes("OES_texture_half_float"),n=!1,v=!1;if(t)i.includes("EXT_color_buffer_float")&&(l&&s(e,t,"float")&&(n=!0),a&&s(e,t,"half float")&&(v=!0)),!v&&a&&i.includes("EXT_color_buffer_half_float")&&s(e,t,"half float")&&(v=!0);else l&&i.includes("WEBGL_color_buffer_float")&&s(e,t,"float")&&(n=!0),a&&i.includes("EXT_color_buffer_half_float")&&s(e,t,"half float")&&(v=!0);let f=!1,m=!1;if(t)m=a&&u(e,t,"half float"),i.includes("OES_texture_float_linear")&&(f=l&&u(e,t,"float"));else i.includes("OES_texture_float_linear")&&l&&(f=u(e,t,"float")),i.includes("OES_texture_half_float_linear")&&a&&(m=u(e,t,"half float"));return r="half float"==(o=t&&v?"half float":t&&n?"float":!t&&v?"half float":!t&&n?"float":"uint8")&&m||"float"===o&&f||"uint8"===o?"linear":"nearest",{isWebGL2:t,extensions:i,canTexFloat:l,canTexHalfFloat:a,canRTTFloat:n,canRTTHalfFloat:v,canLinearFloat:f,canLinearHalfFloat:m,chosenRTType:o,chosenFilterPolicy:r}}(a,v);return{regl:m,gl:a,canvas:t,caps:p}}({canvas:h.current,preferWebGL2:!0,attributes:{alpha:!0,antialias:!1,stencil:!1,depth:!1,preserveDrawingBuffer:!1}});r=y.isWebGL2?"WebGL2":"WebGL1",i=`RT: ${y.chosenRTType}`,v=`filter: ${y.chosenFilterPolicy}`,f=[],y.canRTTHalfFloat&&f.push("half"),y.canRTTFloat&&f.push("float"),0===f.length&&f.push("uint8-only"),m=[],y.canLinearHalfFloat&&m.push("half"),y.canLinearFloat&&m.push("float"),console.log(`[caps] ${r} | ${i} (${v}) | RTT: [${f.join(",")}] | Linear: [${m.join(",")||"uint8-only"}]`),console.log(`[caps] Extensions: ${y.extensions.join(", ")||"none"}`);let E=new l,R=new g(d,E,y,t);R.setAsciiEnabled(o);let _=e=>{let{clientX:t,clientY:o}=e,{innerWidth:r,innerHeight:i}=window;E.setMouse(t/r,o/i)},w=e=>{let t=p.getBoundingClientRect();0!==t.width&&0!==t.height&&E.setMouse((e.clientX-t.left)/t.width,(e.clientY-t.top)/t.height)};"contained"!==e?window.addEventListener("mousemove",_,{passive:!0}):p.addEventListener("mousemove",w,{passive:!0});let S=0,C=0,U=()=>{if(!x.current||!h.current)return;let e=x.current.clientWidth,t=x.current.clientHeight;if(0===e||0===t)return;let o=Math.max(1,Math.min(window.devicePixelRatio||1,2)),r=Math.round(e*o),i=Math.round(t*o);(r!==S||i!==C)&&(S=r,C=i,h.current.width=S,h.current.height=C,d.poll(),R.resize(S,C))},F=new ResizeObserver(U);F.observe(p),U();let D=!1,A=performance.now(),O=0,z=()=>{if(D)return;let e=performance.now(),t=(e-A)/1e3;A=e,E.update(t),d.clear({color:[0,0,0,0],depth:1}),R.render(),O=requestAnimationFrame(z)};return O=requestAnimationFrame(z),b.current={regl:d,uniforms:E,pipeline:R,caps:y,rafId:O,observer:F},T(null),a?.(),()=>{D=!0,cancelAnimationFrame(O),F.disconnect(),R.dispose(),d.destroy(),"contained"!==e?window.removeEventListener("mousemove",_):p.removeEventListener("mousemove",w),b.current=null}}catch(e){T(e instanceof Error?e.message:"Unable to initialize the shader renderer."),console.error("[shader-canvas] Renderer initialization failed:",e)}},[]),(0,r.jsxs)("div",{ref:x,style:(p={...f},"background"===e?{...p,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:y?0:-1,pointerEvents:y?"auto":"none"}:"overlay"===e?{...p,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:50,pointerEvents:"none"}:{...p,position:"relative",width:"100%",height:"100%",overflow:"hidden"}),className:v,children:[(0,r.jsx)("canvas",{ref:h,style:{width:"100%",height:"100%",display:"block"}}),y&&(0,r.jsx)("div",{role:"status",className:"absolute inset-0 grid place-items-center bg-black px-6 text-center text-sm text-zinc-200",children:(0,r.jsxs)("div",{className:"max-w-sm rounded-lg border border-white/15 bg-zinc-950/90 p-4 shadow-2xl",children:[(0,r.jsx)("p",{className:"font-semibold text-white",children:"Shader renderer unavailable"}),(0,r.jsx)("p",{className:"mt-2 text-zinc-300",children:y})]})})]})});y.displayName="ShaderCanvas";let T=y}}]);