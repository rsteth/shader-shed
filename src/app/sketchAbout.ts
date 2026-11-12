/**
 * ABOUT COPY
 * ==========
 * The maths and logic behind each sketch, written for someone looking at the picture
 * rather than at the code. /sketches/<id>/ shows it in full as a scrolling walkthrough;
 * the About panel on the home page shows the idea and the step names.
 *
 * Every explanation has the same shape:
 *   idea     one or two sentences: what is this, in plain words
 *   steps    the shader in the order it runs; each step is a title, a sentence or two,
 *            and at most one short equation
 *   more     further steps shared by a whole family (the Slit Bands renderer), shown
 *            after the sketch's own steps so each preset leads with what is particular to it
 *   tryThis  the numbers worth changing, and what each one does
 *   uses     which shared symbols appear, so the panel can list their meanings
 *
 * Rules that keep it honest and readable:
 * - Every constant must match the shader. If you change one, change it here too.
 * - One equation per step, short enough to fit a phone-width card (about 300px).
 * - Say why a step produces what you see, not only what it computes.
 * - Use the shared symbols below instead of uniform names.
 *
 * TeX is written with String.raw so backslashes stay single. Inline maths goes
 * between $...$ in `idea`, `text` and `tryThis`; `math` is one display equation.
 */

import { sketchIds, type Sketch } from '@/shaders/sketches';

const tex = String.raw;

export interface AboutStep {
  title: string;
  text: string;
  /** One display equation, bare TeX (no $$). */
  math?: string;
}

/** Steps that are the same across a family of sketches, shown after the sketch's own under this title. */
export interface AboutMore {
  title: string;
  steps: AboutStep[];
}

export interface SketchAbout {
  idea: string;
  steps: AboutStep[];
  more?: AboutMore;
  tryThis?: string[];
  uses?: SymbolKey[];
}

/** What the panel receives: `uses` resolved into readable lines. */
export interface ResolvedSketchAbout {
  idea: string;
  steps: AboutStep[];
  more?: AboutMore;
  tryThis: string[];
  symbols: string[];
}

// ---------------------------------------------------------------------------
// Shared symbols
// ---------------------------------------------------------------------------

const symbols = {
  x: tex`$\mathbf{x}=(x,y)$: a pixel's position on screen. Each axis runs from 0 to 1, starting at the bottom-left corner.`,
  p: tex`$\mathbf{p}$: the same position measured in screen heights from the centre, so circles stay round. $a$ is the screen's width divided by its height.`,
  m: tex`$\mathbf{m}$: the pointer's position, in the same units as the pixel.`,
  R: tex`$\mathbf{R}=(R_x,R_y)$: the canvas size in pixels. Dividing by it turns pixels into screen units.`,
  t: tex`$t$: seconds since the sketch started.`,
  dt: tex`$\Delta t$: seconds since the previous frame.`,
  S: tex`$S$: the image drawn on the previous frame. $S'$: the image being drawn now.`,
  s: tex`$s$: scroll progress, from 0 to 1.`,
  fbm: tex`$\operatorname{fbm}$: smooth fractal noise between 0 and 1, made of five layers of simpler noise at doubling detail.`,
  rand: tex`$\operatorname{rand}$: a repeatable random number between 0 and 1 for each grid point.`,
  smoothstep: tex`$\operatorname{smoothstep}(u,v,q)$: 0 when $q\le u$, 1 when $q\ge v$, easing smoothly in between.`,
  mix: tex`$\operatorname{mix}(A,B,k)=(1-k)A+kB$: a blend that is all $A$ at $k=0$ and all $B$ at $k=1$.`,
  clamp: tex`$\operatorname{clamp}(q,u,v)$: $q$ kept within the range $u$ to $v$.`,
  floor: tex`$\lfloor q\rfloor$: $q$ rounded down to a whole number. $\operatorname{fract}(q)=q-\lfloor q\rfloor$ is what is left over.`,
  blend: tex`$\operatorname{blend}(A,B,w)$: the smaller of two distances, with the crease rounded off wherever they are within $w$ of each other.`,
  d: tex`$d$: signed distance to the shape's outline. Negative inside, zero on the outline, positive outside.`,
} as const;

type SymbolKey = keyof typeof symbols;

// ---------------------------------------------------------------------------
// Standalone sketches
// ---------------------------------------------------------------------------

const ripple: SketchAbout = {
  idea: 'A picture that is redrawn from itself every frame. Each pixel copies a neighbour a couple of pixels away, loses 1% of its brightness, and the pointer adds light. No waves are simulated; the swirling comes from where the copying points.',
  steps: [
    {
      title: 'A wind made of noise',
      text: 'Each pixel gets two noise values, one per axis, rescaled to run from −1 to 1. Together they act as a wind direction that changes smoothly across the screen and drifts over time.',
      math: tex`\mathbf{f}=2\begin{pmatrix}\operatorname{fbm}(3\mathbf{x}+0.1t)\\[2pt]\operatorname{fbm}(3\mathbf{x}+0.1t+10)\end{pmatrix}-1`,
    },
    {
      title: 'Copy from upwind',
      text: 'The new frame reads the old one from up to two pixels against that wind and keeps 99% of it. Repeated every frame, bright areas slide along the wind and stretch into streaks.',
      math: tex`S'(\mathbf{x})=0.99\;S\!\Big(\mathbf{x}-\frac{2\,\mathbf{f}}{\mathbf{R}}\Big)`,
    },
    {
      title: 'The pointer adds light',
      text: tex`A soft spot around the pointer is added on top. It adds up to 2 per frame while only 1% fades, so the spot goes white at once. The radius is 0.05 of the screen in each direction, which makes it an oval on a wide screen.`,
      math: tex`S'\mathrel{+}=2\,\big(1-\operatorname{smoothstep}(0,\,0.05,\,\lVert\mathbf{x}-\mathbf{m}\rVert)\big)`,
    },
    {
      title: 'How long light lasts',
      text: tex`Losing 1% per frame halves the brightness every 69 frames: a little over a second at 60 frames per second, half that on a 120 Hz display. The final pass only darkens the corners.`,
      math: tex`0.99^{69}\approx\tfrac12`,
    },
  ],
  tryThis: [
    tex`$0.99$: how long trails last. $0.999$ keeps them for ten times as long.`,
    tex`The $2$ in $2\mathbf{f}/\mathbf{R}$: how many pixels each frame reaches. Larger values smear faster.`,
    tex`The $3$ inside $\operatorname{fbm}$: how many swirls fit across the screen.`,
  ],
  uses: ['x', 'm', 'R', 't', 'S', 'fbm', 'smoothstep'],
};

const plasma: SketchAbout = {
  idea: 'Five sine waves are added together at every pixel, and the total is turned into a colour. Nothing is remembered between frames: all the motion is the waves sliding past each other.',
  steps: [
    {
      title: 'Three straight waves',
      text: 'One runs across the screen, one up it and one diagonally, each drifting at its own speed. A factor of 10 fits about one and a half waves across the screen.',
      math: tex`\begin{aligned}v_1&=\sin(10x+0.5t)+\sin(10y+0.4t)\\&\quad+\sin\!\big(10(x+y)+0.3t\big)\end{aligned}`,
    },
    {
      title: 'Two sets of rings',
      text: tex`Circular waves spread outward from the centre of the screen $\mathbf{c}=(\tfrac12,\tfrac12)$ and, at half strength, from the pointer. Subtracting $t$ is what makes them travel outward.`,
      math: tex`\begin{aligned}v_2&=\sin\!\big(20\lVert\mathbf{x}-\mathbf{c}\rVert-t\big)\\&\quad+\tfrac12\sin\!\big(15\lVert\mathbf{x}-\mathbf{m}\rVert-1.5t\big)\end{aligned}`,
    },
    {
      title: 'Squash into 0 to 1',
      text: 'The five waves can add up to anything between −4.5 and 4.5. Shifting and scaling brings that into the range 0.05 to 0.95.',
      math: tex`v=\frac{v_1+v_2+5}{10}`,
    },
    {
      title: 'Turn the number into a colour',
      text: tex`One more sine per colour channel, each a third of a turn behind the last. As $v$ rises from 0 to 1 the colour goes once round the wheel: red, then blue, then green.`,
      math: tex`C_k=\tfrac12+\tfrac12\sin(2\pi v+\varphi_k),\quad\varphi=\big(0,\tfrac{2\pi}{3},\tfrac{4\pi}{3}\big)`,
    },
    {
      title: 'It repeats, eventually',
      text: 'Every speed in the sum (0.5, 0.4, 0.3, 1 and 1.5) is a whole multiple of 0.1, so with the pointer still the whole picture repeats every 2π / 0.1 ≈ 63 seconds. The final pass lifts the mid-tones slightly and darkens the corners.',
    },
  ],
  tryThis: [
    tex`$10$, $20$, $15$: how tightly the waves are packed.`,
    tex`$0.5$, $0.4$, $0.3$: the drift speeds of the three straight waves. Set one to $0$ and that wave stands still.`,
    tex`The $2\pi$ in the colour step: use $4\pi$ to go round the colour wheel twice.`,
  ],
  uses: ['x', 'm', 't'],
};

const gradient: SketchAbout = {
  idea: 'Three layers of drifting noise choose between four colours. Each frame keeps most of the last one, shifted by a pixel and a half, so the colour boundaries smear into soft trails.',
  steps: [
    {
      title: 'Three noise fields',
      text: 'Each is smooth noise between 0 and 1, drifting in its own direction at its own speed. The +100 just moves the second one far enough away to be unrelated to the first.',
      math: tex`\begin{aligned}n_1&=\operatorname{fbm}(2\mathbf{x}+0.06t)\\n_2&=\operatorname{fbm}(2\mathbf{x}-0.045t+100)\\n_3&=\operatorname{fbm}\big(3\mathbf{x}+(0.03,-0.036)\,t\big)\end{aligned}`,
    },
    {
      title: 'Noise picks the colour',
      text: tex`Start from deep blue $c_1$. Blend toward purple $c_2$ by $n_1$, toward teal $c_3$ by $n_2$, and half as strongly toward mauve $c_4$ by $n_3$.`,
      math: tex`\begin{aligned}C&=\operatorname{mix}(c_1,c_2,n_1)\\C&\leftarrow\operatorname{mix}(C,c_3,n_2)\\C&\leftarrow\operatorname{mix}(C,c_4,\tfrac12n_3)\end{aligned}`,
    },
    {
      title: 'A direction from the same noise',
      text: tex`$n_1$ is also read as an angle. Fractal noise bunches around one half, so the angle bunches around half a turn and the direction points mostly to the left.`,
      math: tex`\mathbf{d}=\big(\cos(6.28\,n_1),\ \sin(6.28\,n_1)\big)`,
    },
    {
      title: 'Keep, shift and fade',
      text: tex`The new frame is 85% old picture and 15% fresh colour. The old picture is read from 1.5 pixels back along $\mathbf{d}$ and dimmed by 5%, so colour is carried along $\mathbf{d}$. Left alone, this settles at about 78% of the fresh colour's brightness.`,
      math: tex`S'=\operatorname{mix}\!\Big(0.95\,S\big(\mathbf{x}-\tfrac{1.5\,\mathbf{d}}{\mathbf{R}}\big),\ C,\ 0.15\Big)`,
    },
    {
      title: 'Pointer glow',
      text: 'A soft violet glow of radius 0.15 is added around the pointer. The final pass makes the whole image breathe by 10% every 31 seconds and darkens the corners.',
      math: tex`\begin{aligned}g&=1-\operatorname{smoothstep}(0,\,0.15,\,\lVert\mathbf{x}-\mathbf{m}\rVert)\\S'&\leftarrow S'+(0.3,\,0.2,\,0.4)\;g\end{aligned}`,
    },
  ],
  tryThis: [
    tex`$0.15$: how fast fresh colour replaces old. Smaller means longer, softer trails.`,
    tex`$1.5$: how far the picture is carried each frame.`,
    tex`The $2$ and $3$ inside $\operatorname{fbm}$: the size of the colour regions.`,
  ],
  uses: ['x', 'm', 'R', 't', 'S', 'fbm', 'mix', 'smoothstep'],
};

const voronoi: SketchAbout = {
  idea: 'The screen is divided into a grid of squares with one wandering point in each. Every pixel takes the colour of whichever point is nearest, and that alone carves the plane into cells.',
  steps: [
    {
      title: 'Lay down a grid',
      text: 'The screen is scaled so that it is five squares tall. The pointer nudges the whole grid by up to a quarter of a square.',
      math: tex`\mathbf{u}=5\,\big(x\,\tfrac{R_x}{R_y},\ y\big)+\tfrac12\big(\mathbf{m}-\tfrac12\big)`,
    },
    {
      title: 'One seed per square',
      text: tex`Square $\mathbf{g}$ (a pair of whole numbers) owns one seed. Two random numbers $\mathbf{r}_{\mathbf{g}}$ give its two coordinates a starting phase each, and both swing back and forth at the same rate. That moves the seed round a small ellipse every 12.6 seconds, always inside the middle 80% of its square.`,
      math: tex`\mathbf{s}_{\mathbf{g}}=\mathbf{g}+\tfrac12+0.4\sin\!\big(0.5t+2\pi\,\mathbf{r}_{\mathbf{g}}\big)`,
    },
    {
      title: 'Nearest seed wins',
      text: 'Because seeds stay inside their own squares, the nearest one is almost always in the pixel\'s own square or one of the eight around it. So only those nine are checked.',
      math: tex`d=\min_{\mathbf{g}}\ \lVert\mathbf{u}-\mathbf{s}_{\mathbf{g}}\rVert`,
    },
    {
      title: 'A colour for each cell',
      text: tex`The winning square has one random number, its $\mathrm{id}$. Three sines of it, at different rates, make red, green and blue. Neighbouring cells get unrelated colours, and each colour cycles slowly.`,
      math: tex`\begin{aligned}C_k&=\tfrac12+\tfrac12\sin(a_k\,\mathrm{id}+b_k\,t+c_k)\\a&=(12,\,15,\,18)\\b&=(0.3,\,0.2,\,0.4)\\c&=(0,\,2,\,4)\end{aligned}`,
    },
    {
      title: 'Dots and shading',
      text: tex`A white dot marks each seed, where $d$ is under 0.05, and each cell darkens toward its rim because $d$ grows away from the seed. The cell walls are never drawn: you see them only where the colour changes from one cell to the next.`,
      math: tex`\begin{aligned}\text{dot}&=1-\operatorname{smoothstep}(0,\,0.05,\,d)\\C&\leftarrow\operatorname{mix}(C,\ 1,\ 0.8\,\text{dot})\\C&\leftarrow(1-0.4\,d)\,C\end{aligned}`,
    },
    {
      title: 'A trace of the last frame',
      text: 'A small part of the previous frame is mixed in, which softens the moment a pixel changes cell. The final pass adds 20% saturation and darkens the corners.',
      math: tex`S'=0.85\,C+0.045\,S`,
    },
  ],
  tryThis: [
    tex`$5$: how many squares tall the grid is, and so how small the cells are.`,
    tex`$0.4$: how far seeds wander. At $0$ every cell is a perfect square.`,
    tex`$0.05$: the size of the white dot.`,
  ],
  uses: ['x', 'm', 'R', 't', 'S', 'rand', 'mix', 'smoothstep'],
};

const eclipseWeave: SketchAbout = {
  idea: 'Two flat planes, a floor and a ceiling, run away from you and meet at the horizon. There is no 3D scene: depth is worked out from one number, how far a pixel is above or below the horizon line.',
  steps: [
    {
      title: 'Height above the horizon',
      text: tex`$h$ is the horizon, in the middle of the screen. Moving the pointer up or down tilts the view by shifting it slightly. Pixels below it are floor, pixels above it are ceiling.`,
      math: tex`\delta=y-h,\qquad h=\tfrac12+0.08\,\big(m_y-\tfrac12\big)`,
    },
    {
      title: 'Depth from height',
      text: 'On a flat floor seen in perspective, a spot twice as far away appears half as far below the horizon. Turning that round gives depth as one over height. The 0.035 stops it blowing up at the horizon itself, and 26 caps how far you can see.',
      math: tex`z=\min\!\Big(\frac{1}{|\delta|+0.035},\ 26\Big)`,
    },
    {
      title: 'A position on the plane',
      text: 'Sideways position is stretched by depth, because far-away things span more ground per pixel. Adding time to the depth makes the whole plane slide toward you.',
      math: tex`\mathbf{w}=\big((x-\tfrac12)\,z,\ \ z+0.45\,t\big)`,
    },
    {
      title: 'The weave',
      text: tex`Two noise readings make a small offset $\mathbf{d}$ that bends the plane before anything is painted on it. This warp is what makes straight bands wander like woven threads.`,
      math: tex`\begin{aligned}\mathbf{d}&=\big(\operatorname{fbm}(\mathbf{q}_1),\ \operatorname{fbm}(\mathbf{q}_2)\big)-\tfrac12\\\mathbf{q}_1&=(0.18\,w_x,\ 0.12\,w_y+0.08\,t)\\\mathbf{q}_2&=(0.12\,w_y+12,\ 0.21\,w_x-0.07\,t)\\\mathbf{w}'&=\mathbf{w}+2.6\,\mathbf{d}\end{aligned}`,
    },
    {
      title: 'Paint the two planes',
      text: tex`The floor is a brown ramp driven by noise, lit by a grid made from two crossed sine waves. The ceiling is blue cloud noise with sine bands running through it.`,
      math: tex`\text{grid}=\sin(1.7\,w'_x+0.4\,t)\,\sin(0.34\,w'_y-0.7\,t)`,
    },
    {
      title: 'Haze and horizon glow',
      text: tex`Colour fades toward a fog colour between depths 2 and 18, up to 82%. A thin bright line is added at the horizon, falling off exponentially with height.`,
      math: tex`\begin{aligned}C&\leftarrow\operatorname{mix}\!\big(C,\,C_{\text{fog}},\,0.82\operatorname{smoothstep}(2,18,z)\big)\\C&\leftarrow C+C_{\text{glow}}\;e^{-55|\delta|}\end{aligned}`,
    },
    {
      title: 'Smear it over time',
      text: tex`Only a fraction $\beta$ of the fresh picture enters each frame; the rest is the previous frame, read from a few pixels away along $\mathbf{d}$ turned a quarter turn. $\beta$ is 7% at its lowest and higher in the distance and near the pointer, up to 26%, so those areas look sharper. The final pass adds faint film grain and darkens the corners.`,
      math: tex`\begin{aligned}S'&=\operatorname{mix}\!\big((0.972-0.16\,\Delta t)\,S(\mathbf{x}-\mathbf{k}),\ C,\ \beta\big)\\\mathbf{k}&=(d_y,\,-d_x)\,\frac{8+0.6\,z}{\mathbf{R}}\end{aligned}`,
    },
  ],
  tryThis: [
    tex`$0.035$ and $26$: how much distance is squeezed in before the horizon closes.`,
    tex`$2.6$: the strength of the weave. At $0$ the floor grid is perfectly straight.`,
    tex`$0.45$: how fast you travel forward.`,
  ],
  uses: ['x', 'm', 'R', 't', 'dt', 'S', 'fbm', 'mix', 'smoothstep'],
};

const sdfOrbitalBlobs: SketchAbout = {
  idea: 'Seven spheres are described by a single function that gives the distance from any point in space to the nearest surface. Rays are walked through that function to find what each pixel sees, and the spheres are merged so that they melt into one another.',
  steps: [
    {
      title: 'Six moving spheres and one still one',
      text: tex`Sphere $i$ circles the origin at its own speed, bobbing up and down as it goes, while its radius pulses. The 1.047 is a sixth of a turn, which spaces the six evenly at the start. A seventh sphere of radius 0.42 sits at the centre.`,
      math: tex`\begin{aligned}\mathbf{c}_i&=(0.9\cos\theta_i,\ 0.45\sin1.2\theta_i,\ 0.9\sin\theta_i)\\\theta_i&=1.047\,i+(0.4+0.03\,i)\,t\\r_i&=0.26+0.05\sin(2t+1.7\,i)\end{aligned}`,
    },
    {
      title: 'Distance to one sphere',
      text: 'Distance to the centre, minus the radius. It is negative inside the sphere, zero on its surface and positive outside.',
      math: tex`D_i(\mathbf{q})=\lVert\mathbf{q}-\mathbf{c}_i\rVert-r_i`,
    },
    {
      title: 'Melt them together',
      text: tex`Taking the smallest of the seven distances would give seven separate balls. $\operatorname{blend}$ rounds off the crease wherever two surfaces come close, so they join with a smooth neck. The six orbiting spheres are folded together with a width of 0.44, then the centre sphere is added with 0.53.`,
      math: tex`\begin{aligned}D_{\text{ring}}&=\operatorname{blend}(D_0,\dots,D_5;\ 0.44)\\D&=\operatorname{blend}(D_{\text{ring}},\ D_6,\ 0.53)\end{aligned}`,
    },
    {
      title: 'Walk a ray',
      text: tex`For each pixel a ray leaves the camera in direction $\hat{\mathbf{r}}$. $D$ says how far away the nearest surface is, so it is always safe to move that far. The shader moves 85% of it and repeats, up to 90 times, until $D$ drops under 0.001 (a hit) or the ray has gone 12 units (a miss). The pointer moves the camera sideways.`,
      math: tex`\mathbf{q}_{k+1}=\mathbf{q}_k+0.85\,D(\mathbf{q}_k)\,\hat{\mathbf{r}}`,
    },
    {
      title: 'Which way the surface faces',
      text: tex`The surface normal $\mathbf{n}$ is the direction in which $D$ grows fastest. It is measured by reading $D$ a hair (0.002) to either side along each axis.`,
      math: tex`\mathbf{n}=\frac{\nabla D}{\lVert\nabla D\rVert}`,
    },
    {
      title: 'Light it',
      text: tex`$\mathbf{l}$ points at the light and $\mathbf{v}$ back at the camera. Diffuse light depends on how squarely the surface faces the light. The highlight appears where the light's mirror reflection $\mathbf{l}'$ lines up with the camera, and the 24th power keeps it small. The rim term brightens edges seen at a glancing angle. The final colour is the sphere's own colour times $0.18+0.8\times$ diffuse, plus the highlight and a pale blue rim.`,
      math: tex`\begin{aligned}\text{diffuse}&=\max(\mathbf{n}\cdot\mathbf{l},\,0)\\\text{highlight}&=\max(\mathbf{l}'\cdot\mathbf{v},\,0)^{24}\\\text{rim}&=\big(1-\max(\mathbf{n}\cdot\mathbf{v},\,0)\big)^{3}\end{aligned}`,
    },
    {
      title: 'Afterglow',
      text: tex`Only 20% of each new frame is mixed in. The other 80% is the previous frame, slightly dimmed and shifted by $\mathbf{k}$, 0.8 pixels toward the lower right. That leaves a soft halo trailing behind the moving blobs.`,
      math: tex`S'=\operatorname{mix}\!\big((0.97-0.06\,\Delta t)\,S(\mathbf{x}-\mathbf{k}),\ C,\ 0.2\big)`,
    },
  ],
  tryThis: [
    tex`$0.44$ and $0.53$: how readily spheres merge. Near $0$ they stay separate balls.`,
    tex`$24$: the tightness of the highlight. Lower values give a broader, duller shine.`,
    tex`$0.2$: how much afterglow. At $1$ there is none.`,
  ],
  uses: ['x', 't', 'dt', 'S', 'blend', 'mix'],
};

// ---------------------------------------------------------------------------
// Slit Bands: one renderer, one explanation per source
// ---------------------------------------------------------------------------

const pointerBlob = tex`The pointer adds one more circle of radius 0.1, merged in with $\operatorname{blend}$ so that it sticks to the shape when it comes close.`;

const fieldStep: AboutStep = {
  title: 'Store the shape, not a picture',
  text: tex`The first pass draws nothing you see. For every pixel it stores how deep inside the outline that pixel is, as a number from 0 to 1 where $\tfrac12$ is exactly on the edge.`,
  math: tex`\text{ink}=\operatorname{clamp}\!\Big(\tfrac12-\frac{d}{0.12},\ 0,\ 1\Big)`,
};

const hueStep = (reach: number): AboutStep => ({
  title: 'Colour the left and right edges',
  text: tex`$n_x$ says which way the outline faces at that spot: $-1$ for left, $+1$ for right. $e$ is 1 on the edge and fades to 0 at a depth of ${reach}. Together they pick a place on the spectrum: warm on left-facing edges, cool on right-facing ones, white inside.`,
  math: tex`\text{hue}=\tfrac12+\tfrac12\operatorname{sign}(n_x)\sqrt{|n_x|}\;e`,
});

const rowsStep = (rows: number, bars: number): AboutStep => ({
  title: 'Cut the screen into rows of bars',
  text: tex`On a landscape screen there are ${rows} rows. About every three seconds each row rolls a level $\ell$ of 0, 1 or 2, which doubles its number of bars each time, and its bars creep sideways at a speed of their own.`,
  math: tex`r=\lfloor ${rows}\,y\rfloor,\qquad N_r=\lfloor ${bars}\,a\rfloor\cdot2^{\ell_r}`,
});

const sampleStep = (rows: number): AboutStep => ({
  title: 'One look-up per bar',
  text: tex`A pixel finds the centre $\mathbf{c}$ of the bar it sits in and reads the stored shape there, not at its own position. So a whole bar is lit or dark together, in one flat colour, and that is why the outline comes out in steps. $\varphi_r$ is the row's sideways offset.`,
  math: tex`\begin{aligned}\mathbf{c}&=\Big(\frac{\lfloor xN_r+\varphi_r\rfloor+\frac12-\varphi_r}{N_r},\ \frac{r+\frac12}{${rows}}\Big)\\\text{lit}&\iff\text{ink}(\mathbf{c})>\tfrac12\end{aligned}`,
});

const inputStep: AboutStep = {
  title: 'Pointer and scroll',
  text: tex`Rows within about a row and a half of the pointer go one level finer. While the page scrolls, each row's offset $\varphi_r$ is pushed sideways in proportion to the scroll speed, so the bars shear and then settle.`,
};

const trailStep = (seconds: number): AboutStep => ({
  title: 'A fading trail',
  text: tex`Where the shape was a moment ago, the stored ink is kept and counts down from 1 to the $\tfrac12$ cut-off over ${seconds} seconds. Those bars dim and slide toward the cool end of the spectrum, then switch off.`,
  math: tex`\text{ink}'=\max\!\Big(\text{ink},\ \text{ink}_{\text{prev}}-\frac{\Delta t}{${2 * seconds}}\Big)`,
});

const BARS_TITLE = 'How the bars are drawn';

const slitTry = [
  tex`Rows and bars: fewer make the picture chunkier, more make it finer.`,
  tex`Bar width: the 0.42 that sets how much of its cell a bar fills.`,
  'Turn ASCII on. The bars are skipped and the stored shape drives the characters instead.',
];

interface SlitOptions {
  idea: string;
  source: AboutStep[];
  rows?: number;
  bars?: number;
  hueReach?: number;
  trail?: number;
  tryThis?: string[];
  uses?: SymbolKey[];
}

/** A distance-field preset: its own source steps, then the shared bar renderer. */
function slitShape(options: SlitOptions): SketchAbout {
  const rows = options.rows ?? 24;
  const bars = options.bars ?? 18;
  return {
    idea: options.idea,
    steps: options.source,
    more: {
      title: BARS_TITLE,
      steps: [
        fieldStep,
        ...(options.trail ? [trailStep(options.trail)] : []),
        hueStep(options.hueReach ?? 0.09),
        rowsStep(rows, bars),
        sampleStep(rows),
        inputStep,
      ],
    },
    tryThis: [...(options.tryThis ?? []), ...slitTry],
    uses: ['x', 'p', 'm', 't', 'd', 'clamp', 'floor', ...(options.trail ? (['dt'] as const) : []), ...(options.uses ?? [])],
  };
}

const textSlats: AboutStep = {
  title: 'Bars as blinds',
  text: tex`Here the bars do not take one sample each. The stored picture shows through them at full detail, as if seen through blinds: 12 rows of $44\,a$ slats, each row's slats offset by a different amount and creeping sideways.`,
};

const textStrips = (strips: number): AboutStep => ({
  title: 'Cut the word into strips',
  text: tex`The word is drawn once into an image. The screen position is turned into a position $(u,v)$ on that image, and $u$ is cut into ${strips} vertical strips.`,
  math: tex`j=\lfloor ${strips}\,u\rfloor`,
});

const textScatter: AboutStep = {
  title: 'Scatter each strip',
  text: tex`Strip $j$ gets two random numbers. One lifts or drops it, the other squeezes or stretches it sideways, both scaled by a glitch amount $g$. At $g=0$ the word is untouched.`,
  math: tex`\begin{aligned}v&\leftarrow v+2.4\,g\,\big(\operatorname{rand}_1(j)-\tfrac12\big)\\\text{scale}&\leftarrow\operatorname{mix}\big(1,\ 0.2+1.6\operatorname{rand}_2(j),\ g\big)\end{aligned}`,
};

const shearStep: AboutStep = {
  title: 'Scroll',
  text: 'While the page scrolls, each row of slats is pushed sideways in proportion to the scroll speed, then settles.',
};

const textHue: AboutStep = {
  title: 'Colour',
  text: tex`The first 16% of the word leans warm and the last 16% leans cool. A strip that has been lifted or dropped also shifts along the spectrum, by an amount that follows $g$.`,
};

const slitBands: Record<string, SketchAbout> = {
  slitBall: slitShape({
    idea: 'A ball crosses the screen in straight lines and rebounds off every edge at full speed, forever. Its position comes straight from the clock, so nothing about its motion has to be stored.',
    source: [
      {
        title: 'A bounce without physics',
        text: tex`$\operatorname{tri}$ runs back and forth between 0 and 1 at constant speed and turns round instantly. Steady speed with an instant reversal is exactly what a perfect bounce looks like. $\mathbf{L}$ is how far the centre can travel before the ball touches an edge.`,
        math: tex`\begin{aligned}\operatorname{tri}(q)&=\big|\,2\operatorname{fract}(q)-1\,\big|\\b_x&=L_x\,\big(2\operatorname{tri}(0.11\,t+0.17)-1\big)\\b_y&=L_y\,\big(2\operatorname{tri}(0.173\,t+0.61)-1\big)\end{aligned}`,
      },
      {
        title: 'Distance to the ball',
        text: tex`The two rates, 0.11 and 0.173, share no small common multiple, so the path only repeats every 1,000 seconds. ${pointerBlob}`,
        math: tex`d=\lVert\mathbf{p}-\mathbf{b}\rVert-0.17`,
      },
    ],
    trail: 0.7,
    tryThis: [tex`$0.11$ and $0.173$: the horizontal and vertical speeds. Make them equal and the ball retraces one short loop every nine seconds.`],
    uses: ['blend'],
  }),

  slitMoon: slitShape({
    idea: 'A disc with part of it in shadow. The edge of the shadow is half an ellipse, exactly as it is on the real Moon.',
    source: [
      {
        title: 'The phase',
        text: tex`$\varphi$ runs from 0.1 (a thin crescent) through 0.5 (full) to 0.9 over 26 seconds, skipping the slivers that are too thin to hold a bar. The disc is tilted by 23°.`,
        math: tex`\varphi=0.1+0.8\operatorname{fract}\!\big(\tfrac{t}{26}+0.2\big)`,
      },
      {
        title: 'The shadow line is an ellipse',
        text: tex`The boundary between day and night on a sphere is a circle seen at an angle, which looks like an ellipse as tall as the disc. Its half-width is $|k|\,r$: the full radius at new moon, zero at the quarter (a straight line), the full radius again at full moon. Here $x$ and $y$ are measured from the centre of the disc. A crescent is the disc minus that ellipse and the dark half; a gibbous moon is the lit half plus the ellipse.`,
        math: tex`\begin{aligned}k&=\cos2\pi\varphi,\qquad r=0.31\\1&=\frac{x^2}{(k\,r)^2}+\frac{y^2}{r^2}\end{aligned}`,
      },
      {
        title: 'Seas',
        text: tex`Noise sets how bright each bar is, between 0.6 and 1, which gives the surface its darker patches. ${pointerBlob}`,
        math: tex`\begin{aligned}n&=\operatorname{fbm}(7\,\mathbf{p}+3)\\\text{tone}&=0.6+0.4\operatorname{smoothstep}(0.38,\,0.62,\,n)\end{aligned}`,
      },
    ],
    tryThis: [tex`$26$: the length of the month, in seconds.`],
    uses: ['fbm', 'smoothstep', 'blend'],
  }),

  slitTransit: slitShape({
    idea: 'A small moon orbits a planet, crossing in front of it on the near side and slipping behind it on the far side. Which one hides the other is decided by a single sign.',
    source: [
      {
        title: 'A tilted orbit',
        text: 'A circular orbit seen nearly edge-on looks like a flattened ellipse. The moon goes round once every 11.4 seconds.',
        math: tex`\mathbf{o}=\big(0.52\cos\alpha,\ -0.08\sin\alpha\big),\qquad\alpha=0.55\,t`,
      },
      {
        title: 'Who is in front',
        text: tex`$P$ is the distance to the planet (radius 0.24) and $M$ to the moon (radius 0.07). When $\sin\alpha>0$ the moon is on the near half: it is kept whole and cuts a ring-shaped gap 0.022 wide out of the planet. On the far half the roles swap and the planet cuts the gap out of the moon. ${pointerBlob}`,
        math: tex`\begin{aligned}\text{near:}\quad d&=\min\!\big(\max(P,\,0.022-M),\ M\big)\\\text{far:}\quad d&=\min\!\big(P,\ \max(M,\,0.022-P)\big)\end{aligned}`,
      },
    ],
    tryThis: [tex`$0.08$: the tilt of the orbit. At $0$ the moon slides along a straight line.`],
    uses: ['blend'],
  }),

  slitRibbon: slitShape({
    idea: 'A band that follows a travelling wave and bends toward the pointer.',
    source: [
      {
        title: 'Two waves make the centre line',
        text: 'A large slow wave travels to the right and a small faster ripple travels to the left on top of it.',
        math: tex`\begin{aligned}c&=0.15\sin(4.2\,p_x-0.9\,t)\\&\quad+0.05\sin(9\,p_x+1.3\,t)\end{aligned}`,
      },
      {
        title: 'The pointer pulls it',
        text: tex`Near the pointer's horizontal position the centre line is dragged most of the way to the pointer's height. The pull is a bell curve about 0.22 wide.`,
        math: tex`c\leftarrow\operatorname{mix}\!\Big(c,\ m_y,\ 0.85\,e^{-\left(\frac{p_x-m_x}{0.22}\right)^{2}}\Big)`,
      },
      {
        title: 'Give it thickness',
        text: 'Distance is measured straight up and down from the centre line, which overstates it on steep parts; the 0.8 corrects for that. The band is cut off 0.08 short of each side of the screen.',
        math: tex`d=0.8\,\big(|p_y-c|-0.09\big)`,
      },
    ],
    tryThis: [tex`$0.09$: half the thickness of the band.`],
    uses: ['mix'],
  }),

  slitLava: slitShape({
    idea: 'Four circles drift around the screen and merge whenever they come close, like blobs in a lava lamp. The pointer is a fifth.',
    source: [
      {
        title: 'Four wandering centres',
        text: tex`Circle $i$ moves as a sine sideways and a cosine up and down, at unrelated speeds, which traces a looping path that takes a long time to repeat. Each is a little larger and faster than the last.`,
        math: tex`\begin{aligned}\mathbf{c}_i&=\big(0.34\,a\sin\omega_i,\ 0.3\cos\nu_i\big)\\\omega_i&=(0.31+0.07\,i)\,t+2.1\,i\\\nu_i&=(0.23+0.05\,i)\,t+1.3\,i\end{aligned}`,
      },
      {
        title: 'Merge them',
        text: tex`Each circle's distance is its distance to the centre minus its radius, $0.11+0.025\,i$. $\operatorname{blend}$ joins them with a width of 0.21, so two circles reach for each other before they touch. ${pointerBlob}`,
        math: tex`d=\operatorname{blend}\big(d_0,\,d_1,\,d_2,\,d_3;\ 0.21\big)`,
      },
    ],
    tryThis: [tex`$0.21$: how far apart two blobs start to join.`],
    uses: ['blend'],
  }),

  slitSonar: slitShape({
    idea: 'Rings spread outward from the centre of the screen, or from the pointer while it is over the canvas.',
    source: [
      {
        title: 'Repeat a ring with a remainder',
        text: tex`$\rho$ is the distance from the centre, in screen heights. Taking it modulo 0.26 makes the same pattern recur every 0.26 outward, and subtracting $0.07\,t$ first makes the rings travel outward at that speed. Each ring is 0.10 thick.`,
        math: tex`d=\Big|\big((\rho-0.07\,t)\bmod0.26\big)-0.13\Big|-0.05`,
      },
      {
        title: 'Fade with distance',
        text: 'Rings dim as they travel, down to a quarter of their brightness toward the corners of the screen.',
        math: tex`\text{tone}=1-0.75\operatorname{smoothstep}(0.15,\,0.75,\,\rho)`,
      },
    ],
    rows: 30,
    bars: 22,
    hueReach: 0.05,
    tryThis: [tex`$0.26$: the spacing between rings.`],
    uses: ['smoothstep'],
  }),

  slitCursor: slitShape({
    idea: 'A brush that follows the pointer. It stretches the faster it moves and leaves a trail that cools and fades. With no pointer on the canvas, a slow figure-eight stands in.',
    source: [
      {
        title: 'Stretch with speed',
        text: tex`$\mathbf{u}$ is the pointer's velocity and $\hat{\mathbf{u}}$ its direction. The brush is a circle whose coordinate along the direction of travel is divided by $k$, which makes it up to 2.6 times longer that way.`,
        math: tex`\begin{aligned}k&=1+\min(0.6\,\lVert\mathbf{u}\rVert,\ 1.6)\\d&=\Big\lVert\Big(\frac{\mathbf{q}\cdot\hat{\mathbf{u}}}{k},\ \mathbf{q}\cdot\hat{\mathbf{u}}_{\perp}\Big)\Big\rVert-0.13\end{aligned}`,
      },
      {
        title: 'The stand-in',
        text: tex`$\mathbf{q}$ is the pixel's position relative to the brush centre. With no pointer, the centre follows this path instead. The vertical part runs at twice the rate of the horizontal part, which draws a figure-eight.`,
        math: tex`\big(0.32\,a\sin0.7\,t,\ \ 0.24\sin1.4\,t\big)`,
      },
    ],
    trail: 1.6,
    tryThis: [tex`$1.6$ seconds: how long the paint stays.`],
  }),

  slitText: {
    idea: 'A word is cut into vertical strips. Every five seconds the strips scatter and settle back, and the pointer scrambles the ones beneath it.',
    steps: [
      textStrips(40),
      textScatter,
      {
        title: 'When it glitches',
        text: tex`$\tau$ is the position within a five-second cycle, from 0 to 1. For the first 24% of it (1.2 seconds) $g$ falls from 1 to 0, and the random numbers are re-rolled nine times a second, so the strips flicker as they settle. Strips within 0.22 of the pointer are held at up to $g=0.7$.`,
        math: tex`g=\max\!\big(0,\ 1-\tfrac{\tau}{0.24}\big)^{2},\qquad\tau=\operatorname{fract}\!\big(\tfrac{t}{5}\big)`,
      },
      textHue,
    ],
    more: { title: BARS_TITLE, steps: [textSlats, shearStep] },
    tryThis: [
      tex`$40$: the number of strips.`,
      tex`$2.4$: how far a strip can jump, in word-heights.`,
      'Turn ASCII on to see the word made of characters.',
    ],
    uses: ['x', 'p', 'm', 't', 'rand', 'mix', 'floor'],
  },

  slitImage: {
    idea: 'A picture seen through vertical slits, like blinds. The slits crowd together on the left, spread out to the right, and drift slowly sideways.',
    steps: [
      {
        title: 'Brightness only',
        text: 'The image is scaled to cover the screen, and each pixel is reduced to a single brightness, weighting green most because the eye is most sensitive to it. It sways slightly with time and with the pointer.',
        math: tex`\text{tone}=0.2126\,R+0.7152\,G+0.0722\,B`,
      },
      {
        title: 'Uneven slits',
        text: tex`There is a single row, so each bar runs the full height of the screen. Raising $x$ to the power 0.6 before counting bars makes them narrow on the left and wide on the right. $\varphi$ grows steadily, which slides the slits across.`,
        math: tex`\text{slit}=\big\lfloor34\,a\;x^{0.6}+\varphi\big\rfloor`,
      },
      {
        title: 'Through, not sampled',
        text: 'Each slit is open across 45% of its width and shows the picture behind it at full detail. Nothing is stored about a shape here; the picture itself is the field.',
      },
      shearStep,
    ],
    tryThis: [
      tex`$0.6$: at $1$ the slits are evenly spaced.`,
      tex`$34$: the number of slits per screen height.`,
      'Swap public/textures/still-life.svg for any image.',
    ],
    uses: ['x', 'm', 't', 'floor'],
  },

  slitScrollMoon: slitShape({
    idea: 'Scrolling the page turns a thin crescent into a full moon, and lifts it up the screen as it goes.',
    source: [
      {
        title: 'Scroll sets the phase',
        text: tex`At the top of the page the phase is 0.18, a clear crescent. It reaches 0.5, a full moon, at 92% of the way down and stays there. The centre rises from 0.14 below the middle of the screen to 0.05 above it.`,
        math: tex`\varphi=\operatorname{mix}\!\big(0.18,\ 0.5,\ \operatorname{smoothstep}(0,\,0.92,\,s)\big)`,
      },
      {
        title: 'The shadow line is an ellipse',
        text: tex`As in the Moon preset, the edge of the shadow is an ellipse as tall as the disc, with half-width $|k|\,r$. It narrows to a straight line at the quarter and widens again toward full.`,
        math: tex`\begin{aligned}k&=\cos2\pi\varphi,\qquad r=0.3\\1&=\frac{x^2}{(k\,r)^2}+\frac{y^2}{r^2}\end{aligned}`,
      },
    ],
    tryThis: [tex`$0.18$ and $0.5$: the phases at the top and bottom of the page. Use $1$ at the bottom to wane back to a crescent.`],
    uses: ['s', 'mix', 'smoothstep'],
  }),

  slitScrollMorph: slitShape({
    idea: 'Scrolling turns a disc into a wavy ribbon, and then floods the whole screen with bars.',
    source: [
      {
        title: 'Blend two distances',
        text: tex`$D_{\text{disc}}$ is the distance to a disc of radius 0.24, and $D_{\text{wave}}$ to a ribbon that ripples as you scroll. Mixing the two numbers mixes the shapes: every in-between value describes an in-between outline. The change happens between 12% and 50% of the way down the page.`,
        math: tex`\begin{aligned}k&=\operatorname{smoothstep}(0.12,\,0.5,\,s)\\d&=\operatorname{mix}(D_{\text{disc}},\ D_{\text{wave}},\ k)\end{aligned}`,
      },
      {
        title: 'Inflate it',
        text: 'Subtracting a number from a distance moves the whole outline outward by that amount. Over the last 28% of the page the ribbon swells by 0.6 of a screen height, which covers everything.',
        math: tex`d\leftarrow d-0.6\operatorname{clamp}\!\Big(\frac{s-0.72}{0.28},\ 0,\ 1\Big)`,
      },
    ],
    tryThis: [tex`$0.72$: where the flood begins.`],
    uses: ['s', 'mix', 'smoothstep'],
  }),

  slitScrollText: {
    idea: 'A word that arrives scattered and assembles as its block reaches the middle of the screen, then scatters again as it leaves.',
    steps: [
      textStrips(28),
      textScatter,
      {
        title: 'Scroll sets the glitch',
        text: tex`Here $s$ is the block's own trip through the viewport: 0 as it enters at the bottom, $\tfrac12$ when centred, 1 as it leaves at the top. The word is whole while it is within 5% of centre and fully scattered at either end. Scrolling fast adds a little extra, where $\dot{s}$ is the scroll speed in screens per second.`,
        math: tex`g=\operatorname{smoothstep}\!\big(0.1,\ 1,\ 2\,|s-\tfrac12|\big)+0.05\,|\dot{s}|`,
      },
      textHue,
    ],
    more: { title: BARS_TITLE, steps: [textSlats, shearStep] },
    tryThis: [
      tex`$0.1$: how close to centre the word must be before it is whole.`,
      tex`$28$: the number of strips.`,
    ],
    uses: ['x', 'p', 'm', 's', 'rand', 'mix', 'smoothstep', 'floor'],
  },
};

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

export const sketchAbout: Record<string, SketchAbout> = {
  ripple,
  plasma,
  gradient,
  voronoi,
  eclipseWeave,
  sdfOrbitalBlobs,
  ...slitBands,
};

const missingSketchAboutIds = sketchIds.filter((id) => !(id in sketchAbout));

if (missingSketchAboutIds.length > 0 && process.env.NODE_ENV !== 'production') {
  console.warn(`[sketch-about] No explanation written for: ${missingSketchAboutIds.join(', ')}`);
}

export function getSketchAbout(id: string, sketch: Sketch): ResolvedSketchAbout {
  const about = sketchAbout[id];

  // A sketch without an explanation shows its one-line description and nothing invented.
  if (!about) {
    return { idea: sketch.description, steps: [], tryThis: [], symbols: [] };
  }

  const keys = Array.from(new Set(about.uses ?? []));
  return {
    idea: about.idea,
    steps: about.steps,
    more: about.more,
    tryThis: about.tryThis ?? [],
    symbols: keys.map((key) => symbols[key]),
  };
}
