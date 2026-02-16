import type { Sketch } from '@/shaders/sketches';

export interface SketchAboutSection {
  heading: string;
  body: string;
}

export interface SketchAbout {
  intro: string;
  equation: string;
  symbols: string;
  sections: SketchAboutSection[];
}

export const defaultAbout: SketchAbout = {
  intro:
    'This sketch evolves a feedback buffer over time. The simulation pass writes a new state, and the final pass color-grades that state into the image you see.',
  equation:
    '$$S_{t+1}(\\mathbf{x}) = F\\big(S_t,\\mathbf{x},t;\\Theta\\big),\\qquad C(\\mathbf{x}) = G\\big(S_{t+1}(\\mathbf{x})\\big).$$',
  symbols:
    `$\\Theta$: hard-coded shader constants in the active sketch.
$t$: time-dependent uniforms such as $uTime$.
$\\mathbf{x}$: normalized screen coordinate.`,
  sections: [
    {
      heading: 'Core idea',
      body: 'We repeatedly update a field with an equation of the form $$S_{t+\Delta t}=F(S_t,\,\mathbf{x},\,t).$$ Tiny local changes accumulate into large patterns.',
    },
    {
      heading: 'Important controls',
      body: 'Watch frequency and amplitude terms like $\\omega$, $a$, and phase offsets: they shape rhythm, contrast, and spatial complexity.',
    },
  ],
};

export const sketchAbout: Record<string, SketchAbout> = {
  ripple: {
    intro:
      'Ripple Flow uses a feedback texture as a fluid-like height field, then advects it with curl-style motion so waves keep curling and spreading.',
    equation:
      `$$\\begin{aligned}\\mathbf{f}(\\mathbf{x},t)&=2\\,\\mathrm{fbm}(3\\mathbf{x}+0.1t,\\,3\\mathbf{x}+0.1t+10)-1\\\\
\\mathbf{x}_f&=\\mathbf{x}-2\\,\\mathbf{f}\\odot\\mathbf{p},\\quad \\mathbf{p}=1/\\mathbf{R}\\\\
S_{t+1}(\\mathbf{x})&=0.99\\,S_t(\\mathbf{x}_f)+2\\,\\mathrm{smoothstep}(0.05,0,\\lVert\\mathbf{x}-\\mathbf{m}\\rVert)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{R}=uResolution$, $\\mathbf{m}=uMouse$.
$S_t$: previous feedback state.
$t$: live time uniform ($uTime$).`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The state behaves like a damped wave: $$h_{t+1}(\\mathbf{x})\\approx h_t(\\mathbf{x}) + c\\,\\nabla^2 h_t(\\mathbf{x}) - \\lambda h_t(\\mathbf{x}).$$ Laplacian diffusion spreads ripples while damping keeps energy bounded.',
      },
      {
        heading: 'Key variables',
        body: 'Look for diffusion speed $c$, damping $\\lambda$, and feedback mix $m$. Increasing $c$ broadens rings, while higher $\\lambda$ shortens their lifetime.',
      },
    ],
  },
  plasma: {
    intro:
      'Plasma layers sinusoidal bands in different directions and frequencies, then maps the result to vivid color ramps.',
    equation:
      `$$\\begin{aligned}v&=\\sin(10x+0.5t)+\\sin(10y+0.4t)+\\sin(10(x+y)+0.3t)\\\\
&\\quad+\\sin(20r_c-t)+0.5\\sin(15r_m-1.5t),\\quad r_c=\\lVert\\mathbf{x}-(0.5,0.5)\\rVert,\\ r_m=\\lVert\\mathbf{x}-\\mathbf{m}\\rVert\\\\
v_n&=(v+5)/10,\\quad C_k=0.5+0.5\\sin(2\\pi v_n+\\phi_k),\\ \phi=(0,2.094,4.188)
\\end{aligned}$$`,
    symbols:
      `$t=uTime$ and $\\mathbf{m}=uMouse$.
All frequencies and phase offsets are hard-coded constants from the shader.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A classic plasma signal can be written as $$P(\\mathbf{x},t)=\\sum_i a_i\\sin(\\mathbf{k}_i\\cdot\\mathbf{x}+\\omega_i t+\\phi_i).$$ Interference between modes creates moving blobs and veins.',
      },
      {
        heading: 'Key variables',
        body: 'Wave vectors $\\mathbf{k}_i$ set pattern scale, amplitudes $a_i$ set contrast, and temporal frequencies $\\omega_i$ set drift speed.',
      },
    ],
  },
  gradient: {
    intro:
      'Gradient Drift starts from smooth spatial gradients, then adds slow temporal warping so color boundaries bend like silk.',
    equation:
      `$$\\begin{aligned}n_1&=\\mathrm{fbm}(2\\mathbf{x}+0.06t),\\ n_2=\\mathrm{fbm}(2\\mathbf{x}-0.045t+100),\\ n_3=\\mathrm{fbm}(3\\mathbf{x}+(0.03t,-0.036t))\\\\
C_b&=\\mathrm{mix}(\\mathrm{mix}(\\mathrm{mix}(c_1,c_2,n_1),c_3,n_2),c_4,0.5n_3)\\\\
S_{t+1}&=\\mathrm{mix}(0.95S_t(\\mathbf{x}-1.5\\mathbf{d}\\odot\\mathbf{p}),C_b,0.15)+g_m(0.3,0.2,0.4)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{d}=\\mathrm{rotate}((1,0),6.28n_1)$, $\\mathbf{p}=1/uResolution$.
$g_m=\\mathrm{smoothstep}(0.15,0,\\lVert\\mathbf{x}-uMouse\\rVert)$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Think of a warped coordinate map $$\\tilde{\\mathbf{x}}=\\mathbf{x}+\\alpha\\,\\mathbf{w}(\\mathbf{x},t),$$ where $\\mathbf{w}$ is low-frequency noise. Colors are sampled in $\\tilde{\\mathbf{x}}$-space, not raw screen space.',
      },
      {
        heading: 'Key variables',
        body: 'Warp strength $\\alpha$ and noise frequency are the stars: bigger $\\alpha$ gives dramatic folding, lower frequency gives broad cinematic motion.',
      },
    ],
  },
  voronoi: {
    intro:
      'Voronoi Cells computes nearest animated seed points to partition space into living cellular regions.',
    equation:
      `$$\\begin{aligned}\\mathbf{u}&=5(x\\,a,y)+(uMouse-0.5)\\cdot0.5,\\quad a=R_x/R_y\\\\
\\mathbf{o}_i(t)&=0.5+0.4\\sin(0.5t+2\\pi\\,\\mathrm{rand}(\\mathbf{p}_i))\\\\
d_i&=\\lVert(\\mathbf{n}_i+\\mathbf{o}_i)-\\mathrm{fract}(\\mathbf{u})\\rVert,\\quad d=\\min_i d_i\\\\
C&=\\mathrm{mix}(0.3S_t+0.0,\\ C_{cell}(d,\\mathrm{id},t),\\ 0.85)
\\end{aligned}$$`,
    symbols:
      `$R_x,R_y$: resolution components.
$C_{cell}$ includes the hard-coded channel oscillations $(12,15,18)$ and edge smoothstep $(0,0.05)$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Each pixel evaluates $$d_i=\\lVert\\mathbf{x}-\\mathbf{p}_i(t)\\rVert,\\quad V(\\mathbf{x})=\\arg\\min_i d_i.$$ Cell edges emerge where two nearest distances tie.',
      },
      {
        heading: 'Key variables',
        body: 'Seed density controls cell size, jitter amplitude controls wobble, and edge-thickness thresholds control how graph-like the structure feels.',
      },
    ],
  },
  eclipseWeave: {
    intro:
      'Eclipse Weave now places the viewer between two receding planes: an earthy floor and a luminous sky ceiling, both fading into atmospheric haze at depth.',
    equation:
      `$$\begin{aligned}
\delta&=y-h,\quad z=\frac{1}{|\delta|+0.035},\quad \mathbf{w}=((x-0.5)z,\,z+0.45t)\\
\mathbf{d}&=(\operatorname{fbm}(0.18\mathbf{w}+(0,0.08t)),\operatorname{fbm}(0.21\mathbf{w}_{yx}+(12,-0.07t)))-0.5\\
S_{t+1}&=\operatorname{mix}(0.972S_t(\mathbf{x}-\mathbf{u}_{flow}),\,\operatorname{mix}(C_{plane},C_{fog},\operatorname{smoothstep}(2,18,z)),\,\beta)
\end{aligned}$$`,
    symbols:
      `$h=0.5+0.08(uMouse_y-0.5)$ is horizon height; $\delta<0$ selects floor treatment and $\delta>0$ selects ceiling treatment.
$C_{plane}$ blends either floor-grid/ridge shading or sky-band/cloud shading; depth $z$ increases haze through $C_{fog}$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A perspective-style depth map is built from distance to horizon, then used to sample separate procedural worlds for ground and sky. Both worlds are gradually obscured by fog as they recede.',
      },
      {
        heading: 'Key variables',
        body: 'Horizon offset gain $(0.08)$, depth denominator bias $(0.035)$, and haze window $(2,18)$ most strongly control camera feel, vanishing-point compression, and atmospheric distance.',
      },
    ],
  },


};

function buildOperatorLegend(equation: string): string[] {
  const legend: string[] = [];

  if (equation.includes('fbm')) {
    legend.push('$\\operatorname{fbm}(\\mathbf{x})$: fractal Brownian motion noise (sum of octave noise layers).');
  }

  if (equation.includes('smoothstep')) {
    legend.push(
      '$\\operatorname{smoothstep}(e_0,e_1,x)$: cubic Hermite interpolation from 0 to 1 after clamping $x$ to $[e_0,e_1]$.'
    );
  }

  return legend;
}

function buildVariableLegend(equation: string): string[] {
  const definitions: Array<{ token: string; label: string }> = [
    { token: '\\mathbf{p}', label: "$\\mathbf{p}$: working position/sample coordinate in the sketch's transformed space." },
    { token: '\\mathbf{v}', label: '$\\mathbf{v}$: iterative warped coordinate/vector used inside harmonic loops.' },
    { token: '\\mathbf{a}', label: '$\\mathbf{a}$: auxiliary accumulator vector used for fold/cross-product dynamics.' },
    { token: '\\mathbf{u}', label: '$\\mathbf{u}$: normalized UV/sample coordinate used for feedback lookup.' },
    { token: '\\mathbf{f}', label: '$\\mathbf{f}$: fragment coordinate in pixels ($vUv \\odot uResolution$).' },
    { token: '\\mathbf{R}', label: '$\\mathbf{R}$: resolution vector ($uResolution$).' },
    { token: '$O$', label: '$O$: accumulated radiance/color term before final tone mapping.' },
    { token: '$z$', label: '$z$: raymarch depth/progress variable.' },
    { token: '$d$', label: '$d$: local step size / divisor term controlling march advance and intensity.' },
    { token: '$s$', label: '$s$: scalar shaping term (typically shell/fold strength) used by the active sketch.' },
    { token: '$q$', label: '$q$: secondary scalar derived from local geometry for weighting.' },
    { token: '$\\ell$', label: '$\\ell$: signed distance-like scalar used for weighting near structure boundaries.' },
  ];

  return definitions.filter(({ token }) => equation.includes(token)).map(({ label }) => label);
}

function appendLegend(base: string, items: string[]): string {
  const existing = new Set(base.split('\n').map((line) => line.trim()).filter(Boolean));
  const additions = items.filter((item) => !existing.has(item));
  return additions.length > 0 ? `${base}\n${additions.join('\n')}` : base;
}

export function getSketchAbout(id: string, sketch: Sketch): SketchAbout {
  const about =
    sketchAbout[id] ?? {
      intro: sketch.description,
      equation: defaultAbout.equation,
      symbols: defaultAbout.symbols,
      sections: defaultAbout.sections,
    };

  const legendItems = [...buildOperatorLegend(about.equation), ...buildVariableLegend(about.equation)];

  return {
    ...about,
    symbols: appendLegend(about.symbols, legendItems),
  };
}
