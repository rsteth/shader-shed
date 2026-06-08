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
      'Ripple Flow is not a physical wave solver. It is a feedback texture that is sampled through moving fbm noise, decayed slightly, and brightened around the cursor.',
    equation:
      `$$\\begin{aligned}
\\mathbf{f}(\\mathbf{x},t)&=2\\big(\\operatorname{fbm}(3\\mathbf{x}+0.1t),\\operatorname{fbm}(3\\mathbf{x}+0.1t+10)\\big)-1\\\\
\\mathbf{x}'&=\\mathbf{x}-2\\mathbf{f}/\\mathbf{R}\\\\
S_{t+1}(\\mathbf{x})&=0.99S_t(\\mathbf{x}')+2\\operatorname{smoothstep}(0.05,0,\\lVert\\mathbf{x}-\\mathbf{m}\\rVert)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{R}=uResolution$ and $\\mathbf{m}=uMouse$.
$S_t$: previous feedback texture.
$\\mathbf{f}$: two-channel noise displacement field.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Each frame looks slightly upstream in the previous frame, using a noise vector as the offset. That makes the stored brightness smear and curl while the $0.99$ multiplier slowly fades old energy.',
      },
      {
        heading: 'Key variables',
        body: 'The visible rhythm comes from noise scale $(3)$, displacement size $(2/\\mathbf{R})$, decay $(0.99)$, and cursor injection radius $(0.05)$.',
      },
    ],
  },
  plasma: {
    intro:
      'Plasma layers sinusoidal bands in different directions and frequencies, then maps the result to vivid color ramps.',
    equation:
      `$$\\begin{aligned}
v&=\\sin(10x+0.5t)+\\sin(10y+0.4t)+\\sin(10(x+y)+0.3t)\\\\
&\\quad+\\sin(20r_c-t)+0.5\\sin(15r_m-1.5t)\\\\
v_n&=(v+5)/10,\\quad C_k=0.5+0.5\\sin(2\\pi v_n+\\phi_k)
\\end{aligned}$$`,
    symbols:
      `$r_c=\\lVert\\mathbf{x}-(0.5,0.5)\\rVert$, $r_m=\\lVert\\mathbf{x}-uMouse\\rVert$.
$\\phi=(0,2.094,4.188)$ offsets the RGB channels.`,
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
      'Gradient Drift builds a palette from layered fbm noise, then feeds the previous frame through a small rotating offset to create slow color trails.',
    equation:
      `$$\\begin{aligned}
n_1&=\\operatorname{fbm}(2\\mathbf{x}+0.06t),\\quad n_2=\\operatorname{fbm}(2\\mathbf{x}-0.045t+100)\\\\
n_3&=\\operatorname{fbm}(3\\mathbf{x}+(0.03t,-0.036t))\\\\
C_b&=\\operatorname{mix}(\\operatorname{mix}(\\operatorname{mix}(c_1,c_2,n_1),c_3,n_2),c_4,0.5n_3)\\\\
S_{t+1}&=\\operatorname{mix}(0.95S_t(\\mathbf{x}-1.5\\mathbf{d}/\\mathbf{R}),C_b,0.15)+g_m(0.3,0.2,0.4)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{d}=\\operatorname{rotate}((1,0),6.28n_1)$.
$g_m=\\operatorname{smoothstep}(0.15,0,\\lVert\\mathbf{x}-uMouse\\rVert)$ is the cursor glow.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The base image is a smooth noise-selected palette. The feedback lookup shifts by a tiny direction derived from $n_1$, so color boundaries drift without becoming a full fluid simulation.',
      },
      {
        heading: 'Key variables',
        body: 'Noise frequencies set the size of color regions, feedback decay $(0.95)$ sets trail persistence, and the $0.15$ blend controls how quickly new palette color replaces old state.',
      },
    ],
  },
  voronoi: {
    intro:
      'Voronoi Cells computes nearest animated seed points to partition space into living cellular regions.',
    equation:
      `$$\\begin{aligned}
\\mathbf{u}&=5(xR_x/R_y,y)+(uMouse-0.5)\\cdot0.5\\\\
\\mathbf{o}_i(t)&=0.5+0.4\\sin(0.5t+2\\pi\\operatorname{rand}(\\mathbf{p}_i))\\\\
d_i&=\\lVert(\\mathbf{n}_i+\\mathbf{o}_i)-\\operatorname{fract}(\\mathbf{u})\\rVert,\\quad d=\\min_i d_i\\\\
C&=\\operatorname{mix}(0.3S_t, C_{cell}(d,\\operatorname{id},t),0.85)
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
      'Eclipse Weave places the viewer between two receding planes: an earthy floor and a luminous sky ceiling, both fading into atmospheric haze at depth.',
    equation:
      `$$\\begin{aligned}
\\delta&=y-h,\\quad z=\\operatorname{clamp}\\left(\\frac{1}{|\\delta|+0.035},0,26\\right)\\\\
\\mathbf{w}&=((x-0.5)z,z+0.45t)\\\\
\\mathbf{d}&=(\\operatorname{fbm}(\\mathbf{w}(0.18,0.12)+(0,0.08t)),\\operatorname{fbm}(\\mathbf{w}_{yx}(0.12,0.21)+(12,-0.07t)))-0.5\\\\
S_{t+1}&=\\operatorname{mix}((0.972-0.16\\Delta t)S_t(\\mathbf{x}-\\mathbf{u}_{flow}),C_{plane},\\beta)
\\end{aligned}$$`,
    symbols:
      `$h=0.5+0.08(uMouse_y-0.5)$ is horizon height.
$\\delta<0$ selects floor treatment; $\\delta>0$ selects ceiling treatment.
$\\beta=0.07+0.11\\,transfer+0.08\\,depthGlow$ controls how much new plane color enters the feedback.`,
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
  sdfTwistedLinks: {
    intro:
      'SDF Twisted Links raymarches three torus links arranged around a central core. The whole field twists around the vertical axis as height and time change.',
    equation:
      `$$\\begin{aligned}
q_{xz}&=\\operatorname{rot}(0.6q_y+0.35t)p_{xz}\\\\
d_i&=\\operatorname{sdTorus}(\\operatorname{rot}_{xz}(2.094i+0.2t)q-(0.85,0,0),(0.36,0.12))\\\\
D(p)&=\\min\\left(\\min_i d_i,\\lVert q\\rVert-0.33\\right)
\\end{aligned}$$`,
    symbols:
      `$D(p)$: signed distance field used for ray marching.
$\\operatorname{sdTorus}(p,(R,r))$: distance to a torus with major radius $R$ and minor radius $r$.
$q$: rotated local copy of the sample point.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The ray advances by the current distance estimate until it gets close to the torus/core surface. A normal is estimated from nearby distance samples, then diffuse and rim lighting turn the hit into color.',
      },
      {
        heading: 'Key variables',
        body: 'The threefold angle step $(2.094)$ spaces the links, the height twist $(0.6q_y)$ bends them into a chain-like bundle, and the feedback sample shifted by $0.6/uResolution_x$ leaves a gentle trail.',
      },
    ],
  },
  sdfGyroidPulse: {
    intro:
      'SDF Gyroid Pulse raymarches a spherical shell carved by a gyroid-like labyrinth, then uses the gyroid signal again to pulse the surface color.',
    equation:
      `$$\\begin{aligned}
g(p)&=\\sin(p_x)\\cos(p_y)+\\sin(p_y)\\cos(p_z)+\\sin(p_z)\\cos(p_x)\\\\
shell(p)&=\\left|\\lVert q\\rVert-1.35\\right|-0.18\\\\
maze(p)&=\\left|g(3.4q+0.35t)\\right|/3.4-0.05\\\\
D(p)&=\\max(shell(p),-maze(p))
\\end{aligned}$$`,
    symbols:
      `$q$ is $p$ rotated in the $xz$ plane by $0.25t$.
$D(p)$ keeps the spherical shell while cutting gyroid cavities through it.
$pulse=0.5+0.5\\sin(7g(2.2p)+2t)$ drives the teal-to-yellow color mix.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The shell distance defines a hollow sphere, while the negative gyroid term removes labyrinth-like channels. Raymarch hits are shaded with two lights and a Fresnel edge glow.',
      },
      {
        heading: 'Key variables',
        body: 'Shell radius $(1.35)$, shell thickness $(0.18)$, gyroid scale $(3.4)$, and carve threshold $(0.05)$ determine how dense and open the labyrinth feels.',
      },
    ],
  },
  sdfMengerBloom: {
    intro:
      'SDF Menger Bloom is a folded octahedral crystal shell. Despite the name, the current shader is not a boxy Menger sponge; it repeatedly sorts and folds coordinates into a faceted lattice.',
    equation:
      `$$\\begin{aligned}
\\operatorname{sdOcta}(p,s)&=(|p_x|+|p_y|+|p_z|-s)/\\sqrt{3}\\\\
p_{i+1}&=\\operatorname{rot}_{yz}(0.45+0.22i+0.06t)(2\\operatorname{foldSort}(p_i)-(1.15,0.95,0.85))\\\\
L(p)&=\\min_i \\operatorname{sdOcta}(p_i,1.18)/2^i\\\\
D(p)&=\\max(L(0.88q),\\left|\\lVert q\\rVert-1.55\\right|-0.2)
\\end{aligned}$$`,
    symbols:
      `$\\operatorname{foldSort}$ sorts absolute coordinate magnitudes into a stable folded octant.
$q$ is the camera-space point after slow $xz$ and $yz$ rotations.
$D(p)$ intersects the folded lattice with a spherical shell.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The shader folds space four times, measures octahedron distance at each scale, then clips the result to a shell. Hit points get diffuse, specular, and Fresnel lighting plus a cheap sparkle term.',
      },
      {
        heading: 'Key variables',
        body: 'Fold count $(4)$, octahedron size $(1.18)$, shell radius $(1.55)$, and shell thickness $(0.2)$ control the crystal density and silhouette.',
      },
    ],
  },
  sdfOrbitalBlobs: {
    intro:
      'SDF Orbital Blobs raymarches a smoothly blended cluster of six orbiting spheres plus a central sphere, producing a glossy metaball form.',
    equation:
      `$$\\begin{aligned}
c_i(t)&=(\\cos\\theta_i,\\sin(1.2\\theta_i),\\sin\\theta_i)(0.9,0.45,0.9)\\\\
r_i(t)&=0.26+0.05\\sin(2t+1.7i)\\\\
D(p)&=\\operatorname{smin}\\left(\\operatorname{smin}_i(\\lVert p-c_i\\rVert-r_i,0.5),\\lVert p\\rVert-0.42,0.6\\right)
\\end{aligned}$$`,
    symbols:
      `$\\theta_i=1.047i+t(0.4+0.03i)$.
$\\operatorname{smin}$ blends distance fields so spheres merge instead of intersecting sharply.
$D(p)$ is raymarched from a mouse-offset camera.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Each sphere contributes a signed distance, and smooth-min blending fuses nearby surfaces into a single elastic blob. Normals from the blended field support diffuse, specular, and Fresnel highlights.',
      },
      {
        heading: 'Key variables',
        body: 'The blend radii $(0.5,0.6)$ control how gooey the form is, while orbital radius, vertical scale, and animated sphere radius control the cluster motion.',
      },
    ],
  },
  sdfCappedColumns: {
    intro:
      'SDF Capped Columns raymarches a spiraling colonnade: capped cylinders orbit a central axis, bridge rings connect the layers, and a thin core anchors the silhouette.',
    equation:
      `$$\\begin{aligned}
k&=\\left\\lfloor(q_y+1.5)/0.9\\right\\rfloor,\\quad q_{xz}=\\operatorname{rot}(0.38k+0.28t)q_{xz}\\\\
r_k&=1.35+0.12\\sin(1.7k+0.9t)\\\\
D(p)&=\\min(column,topCap,bottomCap,bridgeRing,core)
\\end{aligned}$$`,
    symbols:
      `$column=\\operatorname{sdCappedCylinder}(local,0.45,0.16)$.
$bridgeRing=\\operatorname{sdTorus}(bridge,(1.35,0.05))$.
The camera orbits the structure with $ro=(2\\sin(0.17t+m_x),0.9m_y,2\\cos(0.17t+m_x))$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The scene distance is the minimum of columns, caps, bridge rings, and a central core. Raymarch hits are shaded like banded stone, then mixed with fog and a small feedback drift.',
      },
      {
        heading: 'Key variables',
        body: 'Layer height $(0.9)$, twist per layer $(0.38)$, column radius $(0.16)$, bridge radius $(1.35)$, and orbit speed $(0.17)$ define the colonnade shape.',
      },
    ],
  },
  sdfKnotTunnel: {
    intro:
      'SDF Knot Tunnel repeats paired torus rings down the ray direction, twists each cell, and adds a thin cylindrical shell to make a tunnel-like structure.',
    equation:
      `$$\\begin{aligned}
q_z&=\\operatorname{mod}(p_z+2t+1.4,2.8)-1.4\\\\
q_{xy}&=\\operatorname{rot}(0.8\\sin(0.8p_z+t))q_{xy}\\\\
knot&=\\min(\\operatorname{sdTorus}(q,(0.75,0.11)),\\operatorname{sdTorus}(\\operatorname{rot}_{yz}(1.57)q,(0.75,0.11)))\\\\
D(p)&=\\min(knot,\\left|\\lVert p_{xy}\\rVert-1.25\\right|-0.03)
\\end{aligned}$$`,
    symbols:
      `$D(p)$ repeats every $2.8$ units along $z$.
The two torus distances are perpendicular, creating a linked-ring cross-section.
The shell term adds the tunnel wall.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'The modulo operation makes the torus pair recur along depth. A sinusoidal rotation twists each repeated cell, while the camera looks forward through the repeating structure.',
      },
      {
        heading: 'Key variables',
        body: 'Repeat length $(2.8)$, torus radii $(0.75,0.11)$, shell radius $(1.25)$, and twist amount $(0.8)$ set the tunnel density and knot-like motion.',
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

  if (equation.includes('smin')) {
    legend.push('$\\operatorname{smin}(a,b,k)$: smooth minimum that blends nearby signed-distance surfaces.');
  }

  if (equation.includes('sdTorus')) {
    legend.push('$\\operatorname{sdTorus}$: signed-distance function for a torus.');
  }

  if (equation.includes('sdCappedCylinder')) {
    legend.push('$\\operatorname{sdCappedCylinder}$: signed-distance function for a finite cylinder with flat caps.');
  }

  return legend;
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

  const legendItems = buildOperatorLegend(about.equation);

  return {
    ...about,
    symbols: appendLegend(about.symbols, legendItems),
  };
}
