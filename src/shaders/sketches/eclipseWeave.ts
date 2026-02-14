/**
 * ECLIPSE WEAVE SKETCH
 * Earth/sky corridor with distinct floor and ceiling planes fading into atmospheric haze.
 */

export const sim = /* glsl */ `
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
`;

export const final = /* glsl */ `
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
`;
