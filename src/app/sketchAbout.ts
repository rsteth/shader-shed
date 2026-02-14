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
  event2: {
    intro:
      'Event 2 builds a dense oscillatory field and samples feedback through quantized warps to create stepped motion.',
    equation:
      `$$\\begin{aligned}\\mathbf{p}&=\\frac{2\\mathbf{f}-\\mathbf{R}}{0.3R_y},\\ \\mathbf{v}_{f+1}=\\mathbf{v}_f+\\frac{\\sin(\\lceil f\\mathbf{v}_{yx}+0.3i\\rceil+\\mathbf{R}-0.5t)}{f}\\\\
\\ell&=\\lVert\\mathbf{p}\\rVert^2-5-\\frac{2}{v_y},\\quad O\\mathrel{+}=\\frac{0.1}{|\\ell|}\\left(\\cos\\left(\\frac{i}{3}+\\frac{0.1}{\\ell}+\\boldsymbol\\phi\\right)+1\\right)\\\\
S_{t+1}&=\\max\\!\\left(\\tanh\\left(O+S_t(\\mathbf{u}+0.04R_y\\sin(\\mathbf{u}+\\mathbf{u}_{yx}/0.6))^2\\right),0\\right)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{f}=vUv\\odot\\mathbf{R}$, $\\mathbf{u}=\\mathbf{f}/\\mathbf{R}$, $\\boldsymbol\\phi=(1,2,3,4)$.
$t=uTime$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A warped coordinate often includes staircase quantization $$\\mathbf{x}_q=\\frac{\\lfloor q\\,\\mathbf{x}\\rfloor}{q},$$ introducing deliberate digital plateaus before feedback sampling.',
      },
      {
        heading: 'Key variables',
        body: 'Quantization level $q$, feedback gain, and oscillation frequency decide whether motion reads as silky, jittery, or aggressively glitch-like.',
      },
    ],
  },
  rocaille: {
    intro:
      'Rocaille layers trigonometric filigree motifs with spatial phase offsets to produce ornate baroque flow.',
    equation:
      `$$\\begin{aligned}\\mathbf{p}&=\\frac{2\\mathbf{f}-\\mathbf{R}}{0.3R_y},\\quad \\mathbf{v}_{f+1}=\\mathbf{v}_f+\\frac{\\sin(\\mathbf{v}_{yx}f+i+\\mathbf{R}+t)}{f}\\\\
O&=\\sum_{i=1}^{10}\\frac{\\cos(i+\\boldsymbol\\phi)+1}{6\\max(\\lVert\\mathbf{v}\\rVert,10^{-3})},\\qquad S=\\tanh(O^2)
\\end{aligned}$$`,
    symbols:
      `$\\boldsymbol\\phi=(0,1,2,3)$ per color channel.
$i\\in[1,10],f\\in[1,9]$ are fixed loop ranges.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Patterns combine harmonic channels $$R(\\mathbf{x})=\\sum_n a_n\\cos(n\\theta(\\mathbf{x})+\\phi_n),$$ where phase offsets $\\phi_n$ shift ornament alignment across space.',
      },
      {
        heading: 'Key variables',
        body: 'Harmonic count and phase progression define filigree complexity. Small phase drifts create gentle weave; larger drifts cause decorative turbulence.',
      },
    ],
  },
  rocailleGlitch: {
    intro:
      'Rocaille Glitch fuses ornamental harmonics with stepped feedback distortion for a carved-then-fractured look.',
    equation:
      `$$\\begin{aligned}\\mathbf{v}_{f+1}&=\\mathbf{v}_f+\\frac{\\sin(\\lceil1.2f\\mathbf{v}_{yx}+0.37i\\rceil+0.003\\mathbf{R}+t(0.8,-0.6))}{f}\\\\
O&\\mathrel{+}=\\left(\\cos\\left(\\frac{i}{2.7}+\\boldsymbol\\psi\\right)+1\\right)\\left(\\frac{0.07}{\\lVert\\mathbf{v}\\rVert}+\\frac{0.03}{g}\\right),\\ g=\\max\\!\\left(|\\lVert\\mathbf{p}\\rVert^2-3.2-\\frac{1.6}{|v_y|}|,10^{-3}\\right)\\\\
S_{t+1}&=1-e^{-0.97\\max(\\tanh(0.9O^2)+0.42S_t(\\mathbf{u}+0.035R_y\\sin(\\mathbf{u}_{yx}/0.7+t(1.7,-1.3))),0)}
\\end{aligned}$$`,
    symbols:
      `$\\boldsymbol\\psi=(0,1.3,2.6,3.9)$.
Feedback gain/decay are hard coded as $0.42$ and $0.97$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'It composes a smooth motif $R(\\mathbf{x})$ with a glitch warp $G(\\mathbf{x})$, effectively sampling $R(G(\\mathbf{x}))$ so elegant curves fracture into electronic facets.',
      },
      {
        heading: 'Key variables',
        body: 'Glitch step size, feedback blend, and harmonic gain are the core triad controlling legibility versus distortion.',
      },
    ],
  },
  rocaille2Glitch: {
    intro:
      'Rocaille 2 Glitch keeps the Rocaille 2 motif language while applying stronger stepped warp logic in feedback.',
    equation:
      `$$\\begin{aligned}\\mathbf{v}_{f+1}&=\\mathbf{v}_f+\\frac{\\sin(\\lceil f\\mathbf{v}_{yx}+0.28i+0.15t\\rceil+t(0.9,-0.7))}{f}\\\\
O&\\mathrel{+}=\\left(\\cos(i+\\boldsymbol\\phi)+1\\right)\\left(\\frac{0.085}{\\lVert\\mathbf{v}\\rVert}+\\frac{0.02}{g}\\right),\\ g=\\max\\!\\left(|\\lVert\\mathbf{p}\\rVert^2-4.2-\\frac{1.4}{|v_y|}|,10^{-3}\\right)\\\\
S_{t+1}&=1-e^{-0.97\\max(\\tanh(O^2)+0.4S_t(\\mathbf{u}+0.04R_y\\sin(\\mathbf{u}+\\mathbf{u}_{yx}/0.6+t(1.2,-1.6))),0)}
\\end{aligned}$$`,
    symbols:
      `$\\boldsymbol\\phi=(0,1,2,3)$.
Rocaille-2 removes the extra $+\\mathbf{R}$ phase term used in Rocaille.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A reduced phase-offset filigree is passed through quantized coordinate maps, balancing organic loops against chopped temporal stepping.',
      },
      {
        heading: 'Key variables',
        body: 'Quantizer resolution and feedback persistence matter most: long persistence leaves ghost trails that reveal the warp history.',
      },
    ],
  },
  rocaille2: {
    intro:
      'Rocaille 2 is a cleaner Rocaille variant with less inner-loop phase offset, yielding smoother continuity.',
    equation:
      `$$\\begin{aligned}\\mathbf{p}&=\\frac{2\\mathbf{f}-\\mathbf{R}}{0.3R_y},\\quad \\mathbf{v}_{f+1}=\\mathbf{v}_f+\\frac{\\sin(\\mathbf{v}_{yx}f+i+t)}{f}\\\\
O&=\\sum_{i=1}^{10}\\frac{\\cos(i+\\boldsymbol\\phi)+1}{6\\max(\\lVert\\mathbf{v}\\rVert,10^{-3})},\\qquad S=\\tanh(O^2)
\\end{aligned}$$`,
    symbols:
      `$\\boldsymbol\\phi=(0,1,2,3)$.
Compared with Rocaille, the hard-coded $+\\mathbf{R}$ term is omitted.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'By reducing resolution-coupled phase terms, the harmonic stack remains closer to $$\\sum_n a_n\\cos(n\\theta + \\phi_n),$$ with fewer abrupt local phase inversions.',
      },
      {
        heading: 'Key variables',
        body: 'Relative harmonic amplitudes and global phase velocity govern whether the piece feels meditative, floral, or electrically alive.',
      },
    ],
  },
  cathedralMist: {
    intro:
      'Cathedral Mist uses layered cosine folds and refracted turbulence to evoke shafts of luminous fog inside vaulted space.',
    equation:
      `$$\\begin{aligned}\\mathbf{p}&=\\frac{z(2\\mathbf{f}-\\mathbf{R})}{R_y}+1,\\quad \\mathbf{w}\\leftarrow\\mathbf{p}+\\sum_{f=1}^{5}\\frac{\\sin(\\mathbf{w}_{zxy}f-9e^{-d/0.1}+t)}{f}\\\\
O&\\mathrel{+}=0.03d\\left|\\mathrm{mix}(\\mathbf{p},\\mathbf{w},0.1)_y+(0,1,2,3)/100\\right|^{-1}\\\\
d&=0.3(\\lVert\\cos(\\mathbf{p}_{xz})\\rVert-0.4),\\quad z\\leftarrow z+d,\\quad S=\\tanh(O)
\\end{aligned}$$`,
    symbols:
      `$z$: march depth, initialized to $0$.
Loop counts are hard-coded: outer $100$, inner $5$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A refracted sample direction resembles $$\\mathbf{r}=\\operatorname{refract}(\\mathbf{i},\\mathbf{n},\\eta),$$ then volumetric accumulation integrates density along pseudo-rays.',
      },
      {
        heading: 'Key variables',
        body: 'Refraction ratio $\\eta$, fold frequency, and fog attenuation set whether forms feel crystalline, smoky, or cathedral-soft.',
      },
    ],
  },
  eventideHelix: {
    intro:
      'Eventide Helix rotates oscillatory layers into helix-like trajectories and leaves delayed trails through feedback.',
    equation:
      `$$\\begin{aligned}\\mathbf{v}_{f+1}&=\\mathbf{v}_f+\\frac{\\sin(\\lceil f\\mathbf{v}_{yx}+0.7i\\rceil+\\mathbf{R}-0.5t)}{f}\\\\
\\ell&=\\lVert\\mathbf{p}\\rVert-2-\\frac{1}{\\max(v_y-v_x,10^{-3})},\\quad D=\\max(\\ell,-9\\ell)\\\\
O&\\mathrel{+}=\\frac{0.03}{D}\\left(\\cos\\left(\\frac{i}{3}+\\frac{0.1}{\\max(\\ell,10^{-3})}+\\boldsymbol\\phi\\right)+1\\right)\\\\
S_{t+1}&=\\max\\left(\\tanh\\left(O+S_t(\\mathbf{u}+0.03R_y\\sin(\\mathbf{u}+\\mathbf{u}_{yx}/0.6))\\,O\\right),0\\right)
\\end{aligned}$$`,
    symbols:
      `$\\boldsymbol\\phi=(0,1,2,3)$.
Feedback warp amplitude is fixed at $0.03R_y$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Helical motion can be read through rotating coordinates $$\\theta(t)=\\omega t,\\quad \\mathbf{x}^{\\prime}=R(\\theta)\\mathbf{x}.$$ Sampling prior frames in this moving frame creates corkscrew persistence.',
      },
      {
        heading: 'Key variables',
        body: 'Rotation rate $\\omega$, trail decay, and sine warp amplitude determine whether the helix is silky ribbon or strobing coil.',
      },
    ],
  },
  emberArray: {
    intro:
      'Ember Array stacks orbital folds and chromatic accumulation so the scene reads like sparks suspended in dense heat.',
    equation:
      `$$\\begin{aligned}h&=\\mathbf{p}\\cdot\\frac{\\mathbf{p}}{|\\mathbf{p}|}-t,\\quad \\mathbf{a}=\\mathrm{mix}(\\langle\\mathbf{a}+0.5,\\mathbf{p}\\rangle(\\mathbf{a}+0.5),\\mathbf{p},\\sin h)+\\cos h\\,(\\mathbf{a}+0.5)\\times\\mathbf{p}\\\\
\\mathbf{a}&\\leftarrow\\mathbf{a}+0.3\\sum_{j=1}^{9}\\sin(j\\mathbf{a})_{zxy},\\quad d=\\max(\\lVert\\mathbf{a}_{xz}\\rVert/15,10^{-3})\\\\
O&\\mathrel{+}=\\frac{(9,5,h+t,1)}{d},\\quad z\\leftarrow z+d,\\quad S=\\tanh(O/10^4)
\\end{aligned}$$`,
    symbols:
      `Outer loop count is $80$ steps.
Camera depth offset is hard-coded as $p_z\!+=9$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'A ray-march-style accumulation uses $$C=\\sum_{k=0}^{N-1} w_k\\,c(\\mathbf{x}_k),$$ where channel-dependent weights $w_k$ induce chromatic separation.',
      },
      {
        heading: 'Key variables',
        body: 'March count $N$, channel weights, and fold gain are the headline controls for ember density and color fire.',
      },
    ],
  },
  silkSpindle: {
    intro:
      'Silk Spindle builds a drifting lattice from cross-product geometry, then perturbs it with quantized cosine pulses.',
    equation:
      `$$\\begin{aligned}h&=t-\\lVert\\mathbf{p}\\odot\\mathbf{p}_{yzx}\\rVert,\\quad \\mathbf{a}=\\mathrm{mix}(\\langle\\mathbf{a},\\mathbf{p}\\rangle\\mathbf{a},\\mathbf{p},\\sin h)+\\cos h\\,(\\mathbf{a}\\times\\mathbf{p})\\\\
\\mathbf{a}&\\leftarrow\\mathbf{a}-\\sum_{j=1}^{9}\\frac{\\cos(\\mathrm{round}(j\\mathbf{a})+t)_{zxy}}{j},\\quad d=\\max(0.1\\lVert\\mathbf{a}_{xz}\\rVert,10^{-3})\\\\
O&\\mathrel{+}=\\frac{(h,1,4,1)}{d},\\quad z\\leftarrow z+d,\\quad S=\\tanh(O/2000)
\\end{aligned}$$`,
    symbols:
      `$\\mathbf{a}$ starts as $(0,1,0)$ each march step.
Outer loop count is fixed at $40$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Cross-product terms like $\\mathbf{a}\\times\\mathbf{b}$ create directional tension fields; cosine pulses modulate them in stepped bursts for woven texture.',
      },
      {
        heading: 'Key variables',
        body: 'Pulse quantization, drift rate, and lattice scale govern whether the structure reads as fabric strands or crystalline scaffolding.',
      },
    ],
  },
  axialChoir: {
    intro:
      'Axial Choir rotates ray bundles through anisotropic depth fields and harmonically tints their accumulated energy.',
    equation:
      `$$\\begin{aligned}\\mathbf{v}&=\\mathrm{normalize}(\\cos((t+i)/2+(6,1,4))),\\quad \\mathbf{p}\\leftarrow(\\mathbf{v}\\cdot\\mathbf{p})\\mathbf{v}+\\mathbf{v}\\times\\mathbf{p}\\\\
d&=\\max\\left(0.2\\left\\lVert\\left(p_x,\\frac{p_y}{9}\\right)\\right\\rVert,10^{-3}\\right),\\quad O\\mathrel{+}=\\frac{(3,z,6,1)}{d\\max(z,10^{-3})}\\\\
z&\\leftarrow z+d,\\quad S=\\tanh(O/200)
\\end{aligned}$$`,
    symbols:
      `Outer march loop is hard-coded to $50$ steps.
Depth seed is $p_z\!+=9$ before rotation.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Anisotropy weights axes unequally, e.g. $$d=\\sqrt{x^2+\\beta y^2+\\gamma z^2},$$ so rotation exposes changing cross-sections like choral voices entering in layers.',
      },
      {
        heading: 'Key variables',
        body: 'Axis weights $(\\beta,\\gamma)$, rotation cadence, and harmonic color mapping are the major compositional levers.',
      },
    ],
  },
  prismTangle: {
    intro:
      'Prism Tangle folds rounded filigree volumes and grades them radially to mimic refractive prism facets.',
    equation:
      `$$\\begin{aligned}\\mathbf{a}&=\\mathbf{p}-0.9\\mathbf{p}_{xzy},\\quad \\mathbf{a}\\leftarrow\\mathbf{a}+\\sum_{j=1}^{9}\\frac{\\sin(\\mathrm{round}(j\\mathbf{a})_{yzx}+t)}{j}\\\\
d&=\\max\\left(\\frac{\\left\\lVert(0.3\\sin(\\mathbf{a}^2),\\cos(\\lVert\\mathbf{p}\\rVert/0.3))\\right\\rVert}{6},10^{-3}\\right),\\quad z\\leftarrow z+d\\\\
O&\\mathrel{+}=\\frac{(\\lVert\\mathbf{p}\\rVert,2,z,1)}{d\\max(\\lVert\\mathbf{p}\\rVert,10^{-3})\\max(z,10^{-3})},\\quad S=\\tanh(O^2/10^6)
\\end{aligned}$$`,
    symbols:
      `Outer loop count is $60$.
The fold coefficient $0.9$ and radial divisor $0.3$ are hard-coded.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Rounded folds repeatedly clamp and reflect coordinates, then radial grading applies a term like $g(r)$ with $r=\\lVert\\mathbf{x}\\rVert$ for prism-like hue separation.',
      },
      {
        heading: 'Key variables',
        body: 'Fold softness, radial falloff curve, and hue-phase mapping determine whether the look skews glassy, pearlescent, or neon.',
      },
    ],
  },
  noctilucentArc: {
    intro:
      'Noctilucent Arc grows luminous shells with phase-shifted sinusoidal modulation and airy volumetric trails.',
    equation:
      `$$\\begin{aligned}s&=-t-z,\\quad \\mathbf{a}=\\mathrm{mix}(\\langle(-1,0,0),\\mathbf{p}\\rangle(-1,0,0),\\mathbf{p},\\sin s)+\\cos s\\,((-1,0,0)\\times\\mathbf{p})\\\\
\\mathbf{a}&\\leftarrow\\mathbf{a}+\\sum_{j=1}^{9}\\frac{\\sin(\\lceil j\\mathbf{a}\\rceil-t)_{yzx}}{j},\\quad q=\\sqrt{\\max(\\lVert\\mathbf{a}_{yz}\\rVert,10^{-3})}\\\\
d&=\\max(\\lVert\\sin(\\mathbf{a})\\rVert q/20,10^{-3}),\\ z\\leftarrow z+d,\\ O\\mathrel{+}=\\frac{(z,1,q,1)}{qd},\\quad S=\\tanh(O/5000)
\\end{aligned}$$`,
    symbols:
      `Outer march count is $100$.
Depth offset before dynamics is $p_z\!+=5$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Shells can be thought of as level sets of $$f(\\mathbf{x},t)=r-\\rho(t)-a\\sin(kr+\\omega t),$$ where phase shifts bend the arc and create glowing wake bands.',
      },
      {
        heading: 'Key variables',
        body: 'Shell radius evolution $\\rho(t)$, modulation amplitude $a$, and trail persistence strongly shape the noctilucent mood.',
      },
    ],
  },
  furnaceMire: {
    intro:
      'Furnace Mire drives a chaotic folded plasma through rounded-step diffusion for molten, smoldering turbulence.',
    equation:
      `$$\\begin{aligned}\\mathbf{a}&=(0.57,0.57,0.57),\\quad \\mathbf{a}\\leftarrow(\\mathbf{a}\\cdot\\mathbf{p})\\,\\mathbf{a}\\,\\,(\\mathbf{a}\\times\\mathbf{p})\\\\
s&=\\sqrt{\\max(\\lVert\\mathbf{a}_{xz}-a_y-0.8\\rVert,10^{-3})},\\quad \\mathbf{a}\\leftarrow\\mathbf{a}+\\sum_{j=2}^{9}\\frac{\\sin(\\mathrm{round}(j\\mathbf{a})-t)_{yzx}}{j}\\\\
d&=\\max(\\lVert\\sin(10\\mathbf{a})\\rVert s/20,10^{-3}),\\ z\\leftarrow z+d,\\ O\\mathrel{+}=\\frac{(s,2,z,1)}{sd},\\quad S=\\tanh(O/4000)
\\end{aligned}$$`,
    symbols:
      `Outer march count is $80$.
The constants $0.57$, $0.8$, and divisor $20$ are fixed in shader code.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Rounded steps behave like smoothed thresholds $$s(x)=\\operatorname{smoothstep}(e_0,e_1,x),$$ used repeatedly to diffuse hard folds into glowing thermal bands.',
      },
      {
        heading: 'Key variables',
        body: 'Fold intensity, smoothstep window $(e_0,e_1)$, and diffusion gain tune the balance between violent chaos and viscous lava flow.',
      },
    ],
  },
  chiaroscuroBloom: {
    intro:
      'Chiaroscuro Bloom is reimagined as a quasar: sparse space feeds into a bright central choke point, then ejects along opposed relativistic-looking jets.',
    equation:
      `$$\begin{aligned}
\mathbf{p}&=((\mathbf{x}-\mathbf{c})\odot(a,1)),\quad r=\lVert\mathbf{p}\rVert,\quad \hat{\mathbf{i}}=-\mathbf{p}/r\\
\mathbf{f}&=\operatorname{normalize}((1.35+0.85\eta)\hat{\mathbf{i}}+(0.5+0.6\sin(t+22r))\hat{\mathbf{i}}^{\perp}),\quad \eta=\operatorname{fbm}(7.5\mathbf{x}+(0.16t,-0.13t))\\
S_{t+1}&=\operatorname{mix}(0.964S_t(\mathbf{x}-[22+20C+12J]\mathbf{f}\odot\mathbf{p}_{ix}),\,C\,c_{core}+A\,c_{ring}+J\,c_{jet},\,\alpha)
\end{aligned}$$`,
    symbols:
      `$C=e^{-26r}$ is the central choke-point intensity; $A$ is the accretion-ring shell term near $r\approx0.09$.
$J=e^{-38|p_y|}\,\operatorname{smoothstep}(0.06,0.9,|p_x|)$ is the bipolar jet envelope and $\alpha=0.035+0.42C+0.28J+0.15g_m$.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Inward spiral advection collapses signal into the center, where luminosity concentrates and is then expelled laterally as pulsed jet structure; outside this region, space is intentionally near-black.',
      },
      {
        heading: 'Key variables',
        body: 'Core falloff (26), jet confinement (38), and carry gain $(22+20C+12J)$ are the most visible controls for collapse strength, jet sharpness, and propagation speed.',
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
  umbraDrift: {
    intro:
      'Umbra Drift is a low-frequency fog field where cross-rotated noise advects color while dark wells open and close like weather systems.',
    equation:
      `$$\begin{aligned}
\mathbf{n}&=(\operatorname{fbm}(3.2\mathbf{x}+(0,t))-0.5,\operatorname{fbm}(3.2\mathbf{x}+(9,-1.1t))-0.5),\quad \\mathbf{f}=(n_y,-n_x)\\
S_{t+1}&=0.98S_t(\mathbf{x}-20\mathbf{f}\odot\mathbf{p})\\
B&=0.5+0.5\sin(7x-5y+2.4t+\pi\,m),\quad m=\operatorname{fbm}(2.6\mathbf{x}+0.9\mathbf{f}+(0.4t,-0.35t))
\end{aligned}$$`,
    symbols:
      `Darkness gate uses $D=\operatorname{smoothstep}(0.62,0.28,m+0.25g_m)$.
$g_m=\operatorname{smoothstep}(0.3,0,\lVert\mathbf{x}-uMouse\rVert)$ deepens local shadow.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Advection carries prior luminance through a slow incompressible-like drift while a mist scalar modulates both chroma and occlusion.',
      },
      {
        heading: 'Key variables',
        body: 'Flow scale (20), mist frequency (2.6/3.2), and darkness threshold window (0.62 to 0.28) control softness versus stark contrast.',
      },
    ],
  },
  lumenGlyphs: {
    intro:
      'Lumen Glyphs carves glowing symbol-like contours from thresholded harmonic sums and lets those contours linger in neon turbulence.',
    equation:
      `$$\begin{aligned}
G(\mathbf{q},\phi)&=\operatorname{smoothstep}(1.25,1.45,\sin q_x+\sin(1.7q_y-0.7\phi)+\sin(0.9(q_x+q_y)+1.2\phi))\\
\Sigma&=\operatorname{clamp}(G(11(\mathbf{p}+0.22\mathbf{w}),1.1t)+G(8(\mathbf{p}_{yx}+0.18\mathbf{w}),-0.8t),0,1)\\
S_{t+1}&=\operatorname{mix}(0.974S_t(\mathbf{x}-10\mathbf{w}^\perp\odot\mathbf{p}),\,\operatorname{mix}(c_0,c_1,\Sigma),\,0.08+0.2\Sigma)
\end{aligned}$$`,
    symbols:
      `$\mathbf{w}$: fbm wobble vector; $\mathbf{w}^\perp=(w_y,-w_x)$.
$c_0=(0.05,0.04,0.1)$ and $c_1=(0.35,0.95,0.85)$ are base neon endpoints.`,
    sections: [
      {
        heading: 'What is happening',
        body: 'Two harmonic glyph fields at different scales are thresholded and merged, producing intermittent rune-like contours that persist via feedback.',
      },
      {
        heading: 'Key variables',
        body: 'Threshold band (1.25 to 1.45), glyph scales (11 and 8), and feedback persistence (0.974) define symbol legibility and trail duration.',
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
