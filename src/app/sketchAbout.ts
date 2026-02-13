import type { Sketch } from '@/shaders/sketches';

export interface SketchAboutSection {
  heading: string;
  body: string;
}

export interface SketchAbout {
  intro: string;
  sections: SketchAboutSection[];
}

export const defaultAbout: SketchAbout = {
  intro:
    'This sketch evolves a feedback buffer over time. The simulation pass writes a new state, and the final pass color-grades that state into the image you see.',
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
  lapse: {
    intro:
      'Lapse iterates compact folding transforms to mimic volumetric depth from a small algebraic recipe.',
    sections: [
      {
        heading: 'What is happening',
        body: 'A folded orbit repeatedly applies nonlinear transforms $$\\mathbf{p}_{n+1}=T(\\mathbf{p}_n,t),$$ then accumulates a glow term from orbit statistics.',
      },
      {
        heading: 'Key variables',
        body: 'Iteration count $N$ sets detail richness, fold strength sets density, and attenuation terms determine whether the image feels misty or metallic.',
      },
    ],
  },
  event2: {
    intro:
      'Event 2 builds a dense oscillatory field and samples feedback through quantized warps to create stepped motion.',
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
  hingeBloom: {
    intro:
      'Hinge Bloom expands distance-marched forms whose curvature is constrained by trigonometric hinge distances.',
    sections: [
      {
        heading: 'What is happening',
        body: 'A signed-distance style marcher updates $$t_{n+1}=t_n + d(\\mathbf{p}(t_n)),$$ where $d$ includes hinge-like angular modulation to create petal openings.',
      },
      {
        heading: 'Key variables',
        body: 'Step scale, hinge frequency, and bloom gain decide whether forms feel architectural, floral, or explosive.',
      },
    ],
  },
  axialChoir: {
    intro:
      'Axial Choir rotates ray bundles through anisotropic depth fields and harmonically tints their accumulated energy.',
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
};

export function getSketchAbout(id: string, sketch: Sketch): SketchAbout {
  return (
    sketchAbout[id] ?? {
      intro: sketch.description,
      sections: defaultAbout.sections,
    }
  );
}
