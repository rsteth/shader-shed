"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[227],{7227:(e,t,o)=>{o.d(t,{default:()=>E});var r=o(5155),i=o(2115);function n(e,t){return 1-Math.exp(-e*t)}class a{constructor(){this.lastMouse=[.5,.5],this.mouseActiveTarget=0,this.scrollPosition=0,this.lastScrollPosition=0,this.hasScrollSample=!1,this.state={uTime:0,uResolution:[1,1],uMouse:[.5,.5],uMouseVelocity:[0,0],uMouseActive:0,uScroll:0,uScrollVelocity:0,uOpacity:1,uDt:.016}}update(e){let t=this.state;if(t.uTime+=e,t.uDt=e,e<=0)return;let[o,r]=t.uMouse,i=n(12,e),a=(o-this.lastMouse[0])/e,l=(r-this.lastMouse[1])/e;t.uMouseVelocity=[t.uMouseVelocity[0]+(a-t.uMouseVelocity[0])*i,t.uMouseVelocity[1]+(l-t.uMouseVelocity[1])*i],this.lastMouse=[o,r],t.uMouseActive+=(this.mouseActiveTarget-t.uMouseActive)*n(6,e);let s=(this.scrollPosition-this.lastScrollPosition)/e;t.uScrollVelocity+=(s-t.uScrollVelocity)*n(10,e),this.lastScrollPosition=this.scrollPosition}resize(e,t){this.state.uResolution=[e,t]}setMouse(e,t){let o=[e,1-t];0===this.mouseActiveTarget&&this.state.uMouseActive<.01&&(this.lastMouse=o),this.state.uMouse=o,this.mouseActiveTarget=1}setMouseActive(e){this.mouseActiveTarget=+!!e}setScroll(e,t=e){this.state.uScroll=Math.min(1,Math.max(0,e)),this.scrollPosition=t,this.hasScrollSample||(this.lastScrollPosition=t,this.hasScrollSample=!0)}}var l=o(8867),s=o.n(l);function c(e,t){try{return e.getExtension(t)}catch{return null}}function u(e,t,o){let r,i,n;if(t)i=e.RGBA,"float"===o?(r=e.RGBA32F,n=e.FLOAT):(r=e.RGBA16F,n=e.HALF_FLOAT);else if(r=e.RGBA,i=e.RGBA,"float"===o)n=e.FLOAT;else{let t=c(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;n=t.HALF_FLOAT_OES}let a=e.createTexture(),l=e.createFramebuffer();if(!a||!l)return!1;let s=!1;try{if(e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,n,null),e.getError()!==e.NO_ERROR)return!1;e.bindFramebuffer(e.FRAMEBUFFER,l),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),(s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE)&&(e.viewport(0,0,4,4),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.getError()!==e.NO_ERROR&&(s=!1))}catch{s=!1}finally{e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(a),e.deleteFramebuffer(l)}return s}function f(e,t,o){let r,i,n;if(t)i=e.RGBA,"float"===o?(r=e.RGBA32F,n=e.FLOAT):(r=e.RGBA16F,n=e.HALF_FLOAT);else if(r=e.RGBA,i=e.RGBA,"float"===o)n=e.FLOAT;else{let t=c(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;n=t.HALF_FLOAT_OES}let a=e.createTexture();if(!a)return!1;let l=!1;try{e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,n,null),l=e.getError()===e.NO_ERROR}catch{l=!1}finally{e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(a)}return l}function d(e,t,o,r,i,n){let a=t._texture?.texture;if(!a)return console.warn("[render-target] Could not access regl texture internals"),!1;let l="linear"===n?e.LINEAR:e.NEAREST,s="half float"===i?e.RGBA16F:e.RGBA32F,c="half float"===i?e.HALF_FLOAT:e.FLOAT;try{e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,l),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,l),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,s,o,r,0,e.RGBA,c,null);let t=e.getError();if(e.bindTexture(e.TEXTURE_2D,null),t!==e.NO_ERROR)return console.warn(`[render-target] GL error reinitializing texture: ${t}`),!1;return!0}catch(t){return e.bindTexture(e.TEXTURE_2D,null),console.warn("[render-target] Exception reinitializing texture:",t),!1}}function h(e,t,o){let{width:r,height:i,linear:n=!1}=o,a=[],l=e._gl,s=[];for(let o of(t.isWebGL2,t.canRTTHalfFloat&&s.push("half float"),t.canRTTFloat&&s.push("float"),s.push("uint8"),s)){let s,u="linear"==(s=n&&("half float"===o&&t.canLinearHalfFloat||"float"===o&&t.canLinearFloat||"uint8"===o)?"linear":"nearest")?"linear":"nearest",f="linear"===s?"linear":"nearest";try{let n;if(t.isWebGL2&&("half float"===o||"float"===o)){if(n=e.texture({width:r,height:i,type:"uint8",format:"rgba",min:u,mag:f,wrap:"clamp"}),!d(l,n,r,i,o,s)){n.destroy(),a.push(o),console.warn(`[render-target] Failed to reinit texture as ${o}`);continue}}else n=e.texture({width:r,height:i,type:o,format:"rgba",min:u,mag:f,wrap:"clamp"});let h=e.framebuffer({color:n,depth:!1,stencil:!1}),p=!0;try{h.use(()=>{e.clear({color:[0,0,0,1]})})}catch{p=!1}if(p){var c;let e=(c=h,c._framebuffer?.framebuffer);if(e){l.bindFramebuffer(l.FRAMEBUFFER,e);let t=l.checkFramebufferStatus(l.FRAMEBUFFER);l.bindFramebuffer(l.FRAMEBUFFER,null),t!==l.FRAMEBUFFER_COMPLETE&&(p=!1)}}if(!p){h.destroy(),n.destroy(),a.push(o),console.warn(`[render-target] ${o} FBO validation failed, trying next format`);continue}let v=t.isWebGL2&&("half float"===o||"float"===o),m={},g=(t,r)=>{if(v){h.destroy(),n.destroy();let i=e.texture({width:t,height:r,type:"uint8",format:"rgba",min:u,mag:f,wrap:"clamp"});d(l,i,t,r,o,s);let a=e.framebuffer({color:i,depth:!1,stencil:!1});n=i,h=a,m.fbo=a,m.colorTex=i}else h.resize(t,r)},x=()=>{h.destroy(),n.destroy()};return m.fbo=h,m.colorTex=n,m.type=o,m.filter=s,m.fallbackFrom=a.length>0?a:void 0,m.resize=g,m.destroy=x,m}catch(e){a.push(o),console.warn(`[render-target] Failed to create ${o} FBO:`,e);continue}}throw Error("Failed to create any render target format")}function p(e,t){let o=document.createElement("canvas");o.width=e,o.height=t;let r=o.getContext("2d");if(!r)throw Error("Unable to create a 2D context for a sketch texture.");return[o,r]}function v(e,t){let o={},r=!1;for(let[n,a]of Object.entries(t??{})){let t,l={mag:a.filter??"linear",min:a.filter??"linear",wrapS:a.wrap??"clamp",wrapT:a.wrap??"clamp",flipY:!0};if("image"===a.kind){var i;let t={texture:e.texture({width:1,height:1,data:new Uint8Array([0,0,0,255])}),size:[1,1]};o[n]=t;let s=new Image;s.crossOrigin="anonymous",s.onload=()=>{r||(t.texture({...l,data:s}),t.size=[s.naturalWidth||s.width,s.naturalHeight||s.height])},s.onerror=()=>{r||console.warn(`[textures] Could not load "${a.src}" for ${n}; the sketch keeps a black placeholder.`)},s.src=(i=a.src).startsWith("/")&&!i.startsWith("//")?`/shader-shed${i}`:i;continue}if("text"===a.kind)t=function(e){var t;let o,[r,i]=(o=(t=e.font??'700 Inter, "Helvetica Neue", Helvetica, Arial, sans-serif').match(/^((?:(?:italic|oblique|normal|bold|bolder|lighter|\d{3})\s+)*)(.+)$/))?[o[1].trim(),o[2]]:["",t],n=e=>`${r} ${e}px ${i}`.trim(),[,a]=p(1,1);a.font=n(200);let l=a.measureText(e.text),s=l.actualBoundingBoxAscent||144,c=l.actualBoundingBoxDescent||0,u=Math.max(l.width,1),f=Math.max(s+c,1),d=e.width??2048,h=e.height??Math.min(d,Math.ceil(.96*d/u*f/.8)),v=Math.min(.96*d/u,.8*h/f),[m,g]=p(d,h);return g.fillStyle="#000",g.fillRect(0,0,d,h),g.font=n(200*v),g.fillStyle="#fff",g.textAlign="center",g.textBaseline="alphabetic",g.fillText(e.text,d/2,h/2+(s-c)/2*v),m}(a);else{let[e,o]=p(a.width,a.height);a.draw(o,a.width,a.height),t=e}o[n]={texture:e.texture({...l,data:t}),size:[t.width,t.height]}}return{textures:o,destroy:()=>{for(let e of(r=!0,Object.values(o)))e.texture.destroy()}}}let m="#version 300 es\nprecision highp float;\n\nin vec2 position;\nout vec2 vUv;\n\nvoid main() {\n  vUv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}";var g=o(8474);let x=" .'`^\\\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";function b(e,t,o){if(t.isWebGL2)return e;let r=e.replace(/^\s*#version\s+300\s+es\s*\n/,"").replace(/\btexture\s*\(/g,"texture2D(");return"vertex"===o?r.replace(/\bin\s+vec2\s+position\s*;/,"attribute vec2 position;").replace(/\bout\s+vec2\s+vUv\s*;/,"varying vec2 vUv;"):r.replace(/\bin\s+vec2\s+vUv\s*;/g,"varying vec2 vUv;").replace(/\bout\s+vec4\s+fragColor\s*;/g,"").replace(/\bfragColor\b/g,"gl_FragColor")}function T(e,t){return['#version 300 es\nprecision highp float;\n\n#define PI 3.14159265359\n\n// ---------------------------------------------------------------------------\n// Shared helpers, prepended to every sketch shader.\n// Written for Shader Shed. No third-party code.\n// ---------------------------------------------------------------------------\n\n// Pseudo-random value in [0, 1) for a 2D point.\n//\n// Meant for points on a grid: cell ids, row numbers, pixel coordinates. Inputs a\n// whole step apart give unrelated outputs. Inputs much closer than that give\n// related outputs, so for per-pixel grain pass floor(gl_FragCoord.xy), not vUv.\n//\n// How it works: the point is projected onto two irrational directions and wrapped\n// to [0, 1), which gives every grid point its own spot in the unit square. Three\n// rounds of "multiply the two numbers, scale up, keep the fraction" then pull\n// neighbouring spots apart until no pattern is left.\nfloat random(vec2 p) {\n    vec2 q = fract(vec2(\n        dot(p, vec2(0.4142136, 0.7320508)),   // sqrt(2) - 1, sqrt(3) - 1\n        dot(p, vec2(0.6457513, 0.2360680))    // sqrt(7) - 2, sqrt(5) - 2\n    ));\n    q = fract((q + vec2(0.31, 0.73)) * (q.yx + vec2(1.9, 2.7)) * 43.0);\n    q = fract((q + vec2(0.57, 0.19)) * (q.yx + vec2(3.1, 1.3)) * 61.0);\n    return fract((q.x + 0.4) * (q.y + 2.3) * 17.0);\n}\n\n// Smooth noise in [0, 1): one random value per grid point, blended across each cell.\n// The blend eases in and out of every grid point, so cell edges leave no creases.\nfloat noise(vec2 p) {\n    vec2 cell = floor(p);\n    vec2 t = p - cell;\n    t = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n\n    float bottom = mix(random(cell), random(cell + vec2(1.0, 0.0)), t.x);\n    float top = mix(random(cell + vec2(0.0, 1.0)), random(cell + vec2(1.0, 1.0)), t.x);\n    return mix(bottom, top, t.y);\n}\n\n// Fractal noise in [0, 0.97): five layers of noise(), each at twice the frequency\n// and half the strength of the one before. The grid turns 30 degrees between\n// layers so their cells never line up.\nfloat fbm(vec2 p) {\n    // Twice a 30 degree rotation: doubles the frequency and turns the grid in one step.\n    mat2 nextLayer = mat2(1.7320508, 1.0, -1.0, 1.7320508);\n\n    float total = 0.0;\n    float strength = 0.5;\n    for (int layer = 0; layer < 5; layer++) {\n        total += strength * noise(p);\n        p = nextLayer * p + 11.5;\n        strength *= 0.5;\n    }\n    return total;\n}\n\n// Smooth union of two distances: like min(a, b), except that where the two are\n// within `width` of each other the crease between them is rounded off, so shapes\n// melt into one another.\n//\n// min(a, b) is (a + b - |a - b|) / 2. This swaps |a - b| for a curve that is\n// rounded at zero and rejoins |x| exactly at +/-width: the one even quartic that\n// meets |x| there with matching value, slope and curvature. Matching all three\n// is what keeps the start of the blend from showing as a seam in lighting.\nfloat smoothUnion(float a, float b, float width) {\n    float gap = abs(a - b);\n    float u = min(gap / width, 1.0);\n    float rounded = width * (0.375 + u * u * (0.75 - 0.125 * u * u));\n    return min(a, b) - 0.5 * max(rounded - gap, 0.0);\n}\n',Object.entries(t.defines??{}).filter(([,e])=>!1!==e).map(([e,t])=>!0===t?`#define ${e}`:"number"==typeof t?`#define ${e} ${Number.isInteger(t)?t.toFixed(1):String(t)}`:`#define ${e} ${t}`).join("\n"),e].join("\n")}class w{constructor(e,t,o,r=g.Jz){this.tickCount=0,this.asciiEnabled=!1,this.regl=e,this.uniforms=t,this.caps=o,this.currentSketchId=r,this.rt1=h(e,o,{width:1,height:1,linear:!0}),this.rt2=h(e,o,{width:1,height:1,linear:!0}),this.postRt=h(e,o,{width:1,height:1,linear:!1});const i=function(e){let t=x.length,o=Math.ceil(t/16),r=document.createElement("canvas");r.width=160,r.height=16*o;let i=r.getContext("2d");if(!i)throw Error("Unable to create 2D context for ASCII glyph atlas.");i.clearRect(0,0,r.width,r.height),i.fillStyle="#ffffff",i.font="14px monospace",i.textAlign="center",i.textBaseline="middle";for(let e=0;e<t;e++){let t=e%16*10+5,o=16*Math.floor(e/16)+8;i.fillText(x[e],t,o)}return{texture:e.texture({data:r,mag:"nearest",min:"nearest",wrapS:"clamp",wrapT:"clamp"}),atlasGrid:[16,o],glyphCount:t}}(e);this.asciiGlyphAtlas=i.texture,this.asciiAtlasGrid=i.atlasGrid,this.asciiGlyphCount=i.glyphCount,console.log(`[pipeline] Using RT type: ${this.rt1.type}, filter: ${this.rt1.filter}`+(this.rt1.fallbackFrom?` (fallback from: ${this.rt1.fallbackFrom.join(", ")})`:""));const n=(0,g.$m)(r);this.sketchTextures=v(e,n.textures),this.cmdSim=this.createSimCommand(n),this.cmdFinal=this.createFinalCommand(n),this.cmdAscii=this.createAsciiCommand()}createInputUniforms(){let e=this.sketchTextures,t={uTime:()=>this.uniforms.state.uTime,uDt:()=>this.uniforms.state.uDt,uResolution:()=>this.uniforms.state.uResolution,uMouse:()=>this.uniforms.state.uMouse,uMouseVelocity:()=>this.uniforms.state.uMouseVelocity,uMouseActive:()=>this.uniforms.state.uMouseActive,uScroll:()=>this.uniforms.state.uScroll,uScrollVelocity:()=>this.uniforms.state.uScrollVelocity,uAscii:()=>+!!this.asciiEnabled};for(let o of Object.keys(e.textures))t[o]=()=>e.textures[o].texture,t[`${o}Size`]=()=>e.textures[o].size;return t}createSimCommand(e){let t=b(T(e.sim,e),this.caps,"fragment"),o=b(m,this.caps,"vertex");return this.regl({frag:t,vert:o,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{...this.createInputUniforms(),uPrevState:this.regl.prop("inputTexture")},framebuffer:this.regl.prop("outputFbo")})}createFinalCommand(e){let t=b(T(e.final,e),this.caps,"fragment"),o=b(m,this.caps,"vertex");return this.regl({frag:t,vert:o,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{...this.createInputUniforms(),uTexture:this.regl.prop("inputTexture"),uOpacity:()=>this.uniforms.state.uOpacity},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}createAsciiCommand(){let e=b("#version 300 es\nprecision highp float;\n\nuniform sampler2D uTexture;\nuniform sampler2D uGlyphAtlas;\nuniform vec2 uResolution;\nuniform vec2 uCellSize;\nuniform vec2 uAtlasGrid;\nuniform float uGlyphCount;\n\nin vec2 vUv;\nout vec4 fragColor;\n\nfloat sampleGlyph(vec2 localUv, float glyphIndex) {\n  float col = mod(glyphIndex, uAtlasGrid.x);\n  float row = floor(glyphIndex / uAtlasGrid.x);\n\n  vec2 cellOrigin = vec2(col, row) / uAtlasGrid;\n  vec2 cellUv = (localUv / uAtlasGrid) + cellOrigin;\n\n  return texture(uGlyphAtlas, cellUv).r;\n}\n\nvoid main() {\n  vec2 frag = gl_FragCoord.xy;\n  vec2 cell = max(uCellSize, vec2(1.0));\n\n  vec2 cellOriginPx = floor(frag / cell) * cell;\n  vec2 cellCenterPx = cellOriginPx + 0.5 * cell;\n  vec2 sceneUv = cellCenterPx / uResolution;\n\n  vec3 sourceColor = texture(uTexture, sceneUv).rgb;\n  float luminance = dot(sourceColor, vec3(0.2126, 0.7152, 0.0722));\n\n  float clampedLum = clamp(luminance, 0.0, 0.99999);\n  float glyphIndex = floor(clampedLum * uGlyphCount);\n\n  vec2 localUv = fract(frag / cell);\n  float glyphMask = sampleGlyph(localUv, glyphIndex);\n\n  vec3 bg = vec3(0.0);\n  vec3 color = mix(bg, sourceColor, glyphMask);\n\n  fragColor = vec4(color, 1.0);\n}\n",this.caps,"fragment"),t=b(m,this.caps,"vertex");return this.regl({frag:e,vert:t,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uTexture:this.regl.prop("inputTexture"),uGlyphAtlas:()=>this.asciiGlyphAtlas,uResolution:()=>this.uniforms.state.uResolution,uCellSize:()=>[10,16],uAtlasGrid:()=>this.asciiAtlasGrid,uGlyphCount:()=>this.asciiGlyphCount},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}setSketch(e){if(e===this.currentSketchId)return;let t=(0,g.$m)(e);console.log(`[pipeline] Switching to sketch: ${t.name}`);let o=this.sketchTextures;this.sketchTextures=v(this.regl,t.textures),this.cmdSim=this.createSimCommand(t),this.cmdFinal=this.createFinalCommand(t),this.currentSketchId=e,o.destroy(),this.clearTargets()}setAsciiEnabled(e){this.asciiEnabled=e}clearTargets(){this.regl({framebuffer:this.rt1.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})}),this.regl({framebuffer:this.rt2.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})})}resize(e,t){this.rt1.resize(e,t),this.rt2.resize(e,t),this.postRt.resize(e,t),this.uniforms.resize(e,t)}render(){this.tickCount++;let e=this.tickCount%2==0?this.rt1:this.rt2,t=this.tickCount%2==0?this.rt2:this.rt1;this.cmdSim({inputTexture:e.colorTex,outputFbo:t.fbo}),this.cmdFinal({inputTexture:t.colorTex,outputFbo:this.asciiEnabled?this.postRt.fbo:null}),this.asciiEnabled&&this.cmdAscii({inputTexture:this.postRt.colorTex,outputFbo:null})}dispose(){this.rt1.destroy(),this.rt2.destroy(),this.postRt.destroy(),this.asciiGlyphAtlas.destroy(),this.sketchTextures.destroy()}}let y=(0,i.forwardRef)(({mode:e="contained",sketch:t=g.Jz,asciiMode:o=!1,scrollSource:n,onLoaded:l,className:d="",style:h},p)=>{let v,m=(0,i.useRef)(null),x=(0,i.useRef)(null),b=n??("contained"===e?"element":"page"),T=(0,i.useRef)(b);(0,i.useEffect)(()=>{T.current=b},[b]);let[y,E]=(0,i.useState)(null),R=(0,i.useRef)(null);return(0,i.useImperativeHandle)(p,()=>({setSketch:e=>{R.current&&R.current.pipeline.setSketch(e)},getCurrentSketch:()=>R.current?.pipeline.currentSketchId||g.Jz}),[]),(0,i.useEffect)(()=>{R.current&&t&&R.current.pipeline.setSketch(t)},[t]),(0,i.useEffect)(()=>{R.current&&R.current.pipeline.setAsciiEnabled(o)},[o]),(0,i.useEffect)(()=>{if(m.current&&x.current)try{let r,i,n,d,h,p=x.current,{regl:v,caps:g}=function(e={}){let{canvas:t=document.createElement("canvas"),preferWebGL2:o=!0,requireWebGL2:r=!1,attributes:i={}}=e,n={alpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,...i},a=null,l=!1;if(o)try{(a=t.getContext("webgl2",n))&&(l=!0)}catch{}if(!a)try{(a=t.getContext("webgl",n))||(a=t.getContext("experimental-webgl",n))}catch{}if(!a)throw Error("WebGL is not supported in this browser");if(console.log(`[regl] Context: ${a.constructor.name}`),r&&!l)throw Error("WebGL2 was requested but only WebGL1 is available");let d=["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear","EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float"];for(let e of d)try{a.getExtension(e)}catch{}let h=s()({gl:a,optionalExtensions:d});h._gl!==a&&console.warn("[regl] WARNING: regl._gl !== gl passed to constructor"),console.log(`[regl] regl._gl: ${h._gl.constructor.name}`);let p=function(e,t){let o,r,i=function(e,t){let o=[];for(let r of t)c(e,r)&&o.push(r);return o}(e,["EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float","OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear"]),n=t||i.includes("OES_texture_float"),a=t||i.includes("OES_texture_half_float"),l=!1,s=!1;if(t)i.includes("EXT_color_buffer_float")&&(n&&u(e,t,"float")&&(l=!0),a&&u(e,t,"half float")&&(s=!0)),!s&&a&&i.includes("EXT_color_buffer_half_float")&&u(e,t,"half float")&&(s=!0);else n&&i.includes("WEBGL_color_buffer_float")&&u(e,t,"float")&&(l=!0),a&&i.includes("EXT_color_buffer_half_float")&&u(e,t,"half float")&&(s=!0);let d=!1,h=!1;if(t)h=a&&f(e,t,"half float"),i.includes("OES_texture_float_linear")&&(d=n&&f(e,t,"float"));else i.includes("OES_texture_float_linear")&&n&&(d=f(e,t,"float")),i.includes("OES_texture_half_float_linear")&&a&&(h=f(e,t,"half float"));return r="half float"==(o=t&&s?"half float":t&&l?"float":!t&&s?"half float":!t&&l?"float":"uint8")&&h||"float"===o&&d||"uint8"===o?"linear":"nearest",{isWebGL2:t,extensions:i,canTexFloat:n,canTexHalfFloat:a,canRTTFloat:l,canRTTHalfFloat:s,canLinearFloat:d,canLinearHalfFloat:h,chosenRTType:o,chosenFilterPolicy:r}}(a,l);return{regl:h,gl:a,canvas:t,caps:p}}({canvas:m.current,preferWebGL2:!0,attributes:{alpha:!0,antialias:!1,stencil:!1,depth:!1,preserveDrawingBuffer:!1}});r=g.isWebGL2?"WebGL2":"WebGL1",i=`RT: ${g.chosenRTType}`,n=`filter: ${g.chosenFilterPolicy}`,d=[],g.canRTTHalfFloat&&d.push("half"),g.canRTTFloat&&d.push("float"),0===d.length&&d.push("uint8-only"),h=[],g.canLinearHalfFloat&&h.push("half"),g.canLinearFloat&&h.push("float"),console.log(`[caps] ${r} | ${i} (${n}) | RTT: [${d.join(",")}] | Linear: [${h.join(",")||"uint8-only"}]`),console.log(`[caps] Extensions: ${g.extensions.join(", ")||"none"}`);let b=new a,y=new w(v,b,g,t);y.setAsciiEnabled(o);let S="contained"===e?p:window,_=t=>{if("contained"!==e)return void b.setMouse(t.clientX/window.innerWidth,t.clientY/window.innerHeight);let o=p.getBoundingClientRect();0!==o.width&&0!==o.height&&b.setMouse((t.clientX-o.left)/o.width,(t.clientY-o.top)/o.height)},A=()=>b.setMouseActive(!1),U=e=>{"mouse"!==e.pointerType&&b.setMouseActive(!1)};S.addEventListener("pointermove",_,{passive:!0}),S.addEventListener("pointerdown",_,{passive:!0}),S.addEventListener("pointerup",U,{passive:!0}),S.addEventListener("pointercancel",A,{passive:!0}),"contained"===e?p.addEventListener("pointerleave",A,{passive:!0}):(document.documentElement.addEventListener("pointerleave",A,{passive:!0}),window.addEventListener("blur",A));let C=0,L=0,M=()=>{if(!x.current||!m.current)return;let e=x.current.clientWidth,t=x.current.clientHeight;if(0===e||0===t)return;let o=Math.max(1,Math.min(window.devicePixelRatio||1,2)),r=Math.round(e*o),i=Math.round(t*o);(r!==C||i!==L)&&(C=r,L=i,m.current.width=C,m.current.height=L,v.poll(),y.resize(C,L))},F=new ResizeObserver(M);F.observe(p),M();let O=!1,D=performance.now(),I=0,k=()=>{if(O)return;let e=performance.now(),t=Math.min((e-D)/1e3,.1);D=e,(()=>{let e=window.innerHeight||1,t=T.current,o=0;if("autoplay"===t){let e=b.state.uTime/16%1,t=1-Math.abs(2*e-1);o=t*t*(3-2*t)}else if("element"===t){let t=p.getBoundingClientRect();o=(e-t.top)/(e+t.height)}else{let t=document.documentElement.scrollHeight-e;o=t>0?window.scrollY/t:0}b.setScroll(o,window.scrollY/e)})(),b.update(t),v.clear({color:[0,0,0,0],depth:1}),y.render(),I=requestAnimationFrame(k)};return I=requestAnimationFrame(k),R.current={regl:v,uniforms:b,pipeline:y,caps:g,rafId:I,observer:F},E(null),l?.(),()=>{O=!0,cancelAnimationFrame(I),F.disconnect(),y.dispose(),v.destroy(),S.removeEventListener("pointermove",_),S.removeEventListener("pointerdown",_),S.removeEventListener("pointerup",U),S.removeEventListener("pointercancel",A),"contained"===e?p.removeEventListener("pointerleave",A):(document.documentElement.removeEventListener("pointerleave",A),window.removeEventListener("blur",A)),R.current=null}}catch(e){E(e instanceof Error?e.message:"Unable to initialize the shader renderer."),console.error("[shader-canvas] Renderer initialization failed:",e)}},[]),(0,r.jsxs)("div",{ref:x,style:(v={...h},"background"===e?{...v,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:y?0:-1,pointerEvents:y?"auto":"none"}:"overlay"===e?{...v,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:50,pointerEvents:"none"}:{...v,position:"relative",width:"100%",height:"100%",overflow:"hidden"}),className:d,children:[(0,r.jsx)("canvas",{ref:m,style:{width:"100%",height:"100%",display:"block"}}),y&&(0,r.jsx)("div",{role:"status",className:"absolute inset-0 grid place-items-center bg-black px-6 text-center text-sm text-zinc-200",children:(0,r.jsxs)("div",{className:"max-w-sm rounded-lg border border-white/15 bg-zinc-950/90 p-4 shadow-2xl",children:[(0,r.jsx)("p",{className:"font-semibold text-white",children:"Shader renderer unavailable"}),(0,r.jsx)("p",{className:"mt-2 text-zinc-300",children:y})]})})]})});y.displayName="ShaderCanvas";let E=y},8474:(e,t,o)=>{o.d(t,{Jz:()=>A,$m:()=>U,U0:()=>S,h:()=>R,$$:()=>E,jI:()=>_});let r=`
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

    // Fade: keep 99% per frame
    float decay = 0.99;

    // Light added around the pointer
    float dist = distance(st, uMouse);
    float ripple = smoothstep(0.05, 0.0, dist) * 2.0;

    // Two independent noise channels act as a wind direction (not a true curl field)
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
`,i=`
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
`,n=`
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
`,a=`
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
`,l=`
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
`,s=`
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
`,c=`
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

    // White dot at each seed (dist is the distance to the nearest seed, so this is not a cell edge)
    float seedDot = 1.0 - smoothstep(0.0, 0.05, dist);
    color = mix(color, vec3(1.0), seedDot * 0.8);

    // Distance-based darkening
    color *= 0.6 + 0.4 * (1.0 - dist);

    // Subtle feedback for trails
    vec4 prev = texture(uPrevState, st);
    color = mix(prev.rgb * 0.3, color, 0.85);

    fragColor = vec4(color, 1.0);
}
`,u=`
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
`,f=`
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
`,d=`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;

    // Film grain: a fresh random value per pixel, 60 times a second (the pattern repeats every ~4s).
    float grain = random(floor(gl_FragCoord.xy) + floor(mod(uTime * 60.0, 256.0)) * vec2(37.0, 91.0));
    color += (grain - 0.5) * 0.012;

    float vignette = smoothstep(0.98, 0.16, distance(vUv, vec2(0.5, 0.53)));
    color *= vignette;

    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,h=`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPrevState;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uDt;

float sphere(vec3 p, float r) { return length(p) - r; }

float mapScene(vec3 p) {
    float d = 1e5;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang = fi * 1.047 + uTime * (0.4 + fi * 0.03);
        vec3 c = vec3(cos(ang), sin(ang * 1.2), sin(ang)) * vec3(0.9, 0.45, 0.9);
        float r = 0.26 + 0.05 * sin(uTime * 2.0 + fi * 1.7);
        d = smoothUnion(d, sphere(p - c, r), 0.44);
    }
    d = smoothUnion(d, sphere(p, 0.42), 0.53);
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
`,p=`
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uOpacity;

void main() {
    vec3 color = texture(uTexture, vUv).rgb;
    color = pow(color, vec3(1.05, 1.0, 0.95));
    fragColor = vec4(clamp(color, 0.0, 1.0), uOpacity);
}
`,v=`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform float uTime;
uniform float uDt;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uMouseActive;
uniform float uScroll;
uniform float uScrollVelocity;

#ifndef EDGE
#define EDGE 0.06            // half-width of the distance band stored in the field (screen heights)
#endif
#ifndef TINT_WIDTH
#define TINT_WIDTH 0.09      // how far the spectrum reaches in from a left or right edge
#endif
#ifndef TRAIL
#define TRAIL 0.0            // seconds a shape lingers after it moves on; 0.0 turns feedback off
#endif
#ifndef CURSOR_RADIUS
#define CURSOR_RADIUS 0.1    // size of the blob the pointer adds to a scene
#endif

// Scene space: y runs -0.5..0.5, x runs -0.5*aspect..0.5*aspect, so circles stay round.
float gAspect;  // width / height
float gUnit;    // 1.0 on landscape screens; shrinks on portrait so shapes still fit
vec2 gMouse;    // pointer in scene space

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Triangle wave, 0..1..0. A point moving along it reverses instantly at each end with
// its speed unchanged, which is exactly a perfectly elastic bounce.
float tri(float x) {
    return abs(fract(x) * 2.0 - 1.0);
}

vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

// Merge the pointer into a scene as one more blob. Fades out with uMouseActive.
float withCursor(float d, vec2 p) {
    float cursor = sdCircle(p - gMouse, CURSOR_RADIUS * gUnit);
    return mix(d, smoothUnion(d, cursor, 0.13 * gUnit), uMouseActive);
}

// Lit part of a moon of radius r. phase: 0 new, 0.25 first quarter, 0.5 full, 1 new again.
float sdMoon(vec2 p, float r, float phase) {
    float c = cos(phase * 2.0 * PI);                    // 1 at new, -1 at full
    vec2 q = vec2(phase < 0.5 ? p.x : -p.x, p.y);       // waxing is lit on the right
    float disc = length(q) - r;
    float a = max(abs(c) * r, 0.002);                   // the terminator is an ellipse this wide
    float terminator = (length(q / vec2(a, r)) - 1.0) * a;
    return c > 0.0
        ? max(disc, -min(terminator, q.x))              // crescent: disc minus (ellipse + dark half)
        : max(disc, min(-q.x, terminator));             // gibbous: disc within (lit half + ellipse)
}
`,m=`
vec3 shade(vec2 uv, vec2 p) {
    float d = scene(p);

    // x-component of the outward normal: negative on left-facing edges, positive on right-facing.
    float e = 0.003;
    float nx = (scene(p + vec2(e, 0.0)) - scene(p - vec2(e, 0.0))) / (2.0 * e);
    float lean = sign(nx) * sqrt(min(abs(nx), 1.0));

    // 1 on the edge, falling to 0 once we are TINT_WIDTH inside the shape.
    float edge = 1.0 - clamp(-d / (TINT_WIDTH * gUnit), 0.0, 1.0);

    return vec3(
        clamp(0.5 - d / (2.0 * EDGE), 0.0, 1.0),
        sceneTone(p),
        0.5 + 0.5 * lean * edge
    );
}
`,g=`
float sceneTone(vec2 p) {
    return 1.0;
}
`,x=`
void main() {
    gAspect = uResolution.x / uResolution.y;
    gUnit = min(gAspect, 1.0);
    gMouse = (uMouse - 0.5) * vec2(gAspect, 1.0);
    vec2 p = (vUv - 0.5) * vec2(gAspect, 1.0);

    vec3 field = shade(vUv, p);

    // Feedback: where the shape has just been, keep its ink and let it run down
    // from 1.0 to the 0.5 cut-off over TRAIL seconds, cooling through the spectrum as it goes.
    vec4 prev = texture(uPrevState, vUv);
    if (TRAIL > 0.0) {
        float linger = prev.r - uDt * 0.5 / TRAIL;
        if (linger > field.r) {
            float age = 1.0 - clamp((linger - 0.5) * 2.0, 0.0, 1.0);
            field = vec3(linger, 1.0 - 0.45 * age, 0.5 + 0.5 * age);
        }
    }

    fragColor = vec4(field, 1.0);
}
`,b=`
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uOpacity;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uScrollVelocity;
uniform float uAscii;

#ifndef ROWS
#define ROWS 24.0            // horizontal bands down a landscape screen (portrait gets more, to match)
#endif
#ifndef BARS
#define BARS 18.0            // bars per row height-unit at the coarsest level
#endif
#ifndef LEVELS
#define LEVELS 3.0           // each row picks one of this many densities (x1, x2, x4, ...)
#endif
#ifndef DUTY
#define DUTY 0.42            // bar width as a fraction of its cell, at the finest level
#endif
#ifndef ROW_FILL
#define ROW_FILL 0.9         // bar height as a fraction of its row
#endif
#ifndef REROLL
#define REROLL 0.3           // how often a row picks a new density, per second
#endif
#ifndef DRIFT
#define DRIFT 0.12           // sideways creep of each row, in cells per second
#endif
#ifndef SCROLL_SHEAR
#define SCROLL_SHEAR 0.5     // cells a row is knocked sideways per viewport/second of scroll
#endif
#ifndef WARP
#define WARP 1.0             // < 1.0 packs bars toward the left edge, > 1.0 toward the right
#endif
#ifndef BACKGROUND
#define BACKGROUND vec3(0.047, 0.047, 0.059)
#endif

// 0 = red .. orange .. yellow .. 0.5 = white .. cyan .. blue .. 1 = violet
vec3 spectrum(float s) {
    float t = clamp(s, 0.0, 1.0) * 6.0;
    vec3 c = mix(vec3(1.0, 0.36, 0.40), vec3(1.0, 0.62, 0.30), clamp(t, 0.0, 1.0));
    c = mix(c, vec3(1.0, 0.92, 0.42), clamp(t - 1.0, 0.0, 1.0));
    c = mix(c, vec3(1.0), clamp(t - 2.0, 0.0, 1.0));
    c = mix(c, vec3(0.42, 0.95, 0.92), clamp(t - 3.0, 0.0, 1.0));
    c = mix(c, vec3(0.36, 0.62, 1.0), clamp(t - 4.0, 0.0, 1.0));
    c = mix(c, vec3(0.58, 0.42, 1.0), clamp(t - 5.0, 0.0, 1.0));
    return c;
}

void main() {
    vec4 here = texture(uTexture, vUv);

    // ASCII pass is on: give it the smooth field and let the glyphs do the quantising.
    if (uAscii > 0.5) {
        float ink = smoothstep(0.5, 0.6, here.r);
        fragColor = vec4(spectrum(here.b) * here.g * ink, uOpacity);
        return;
    }

    // The grid is sized against the shorter side, like the scenes, so portrait screens
    // get the same number of bars across a shape as landscape ones.
    float aspect = uResolution.x / uResolution.y;
    float unit = min(aspect, 1.0);
    float rows = max(floor(ROWS / unit), 1.0);
    float row = floor(vUv.y * rows);
    float rowY = (row + 0.5) / rows;

    // Each row re-rolls its bar density on its own clock; rows next to the pointer go one finer.
    float epoch = floor(uTime * REROLL + random(vec2(row, 3.0)) * 7.0);
    float level = floor(random(vec2(row, epoch)) * LEVELS);
    float nearPointer = step(abs(rowY - uMouse.y) * rows, 1.6) * step(0.5, uMouseActive);
    level = min(level + nearPointer, LEVELS - 1.0);
    float count = max(floor(BARS * aspect / unit), 1.0) * pow(2.0, level);

    // Rows creep sideways at their own pace and get knocked along by scroll speed.
    float jitter = random(vec2(row, 11.0)) - 0.5;
    float phase = random(vec2(row, 7.0)) + (uTime * DRIFT + uScrollVelocity * SCROLL_SHEAR) * jitter;

    float x = clamp(vUv.x, 0.0, 1.0);
    float bx = pow(x, WARP) * count + phase;
    float cell = floor(bx);
    float cellX = pow(clamp((cell + 0.5 - phase) / count, 0.0, 1.0), 1.0 / WARP);

#ifdef CONTINUOUS
    // Bars are a mask over the field: detail inside each bar survives (text, photos).
    vec4 field = here;
    float on = smoothstep(0.4, 0.6, field.r);
#else
    // One sample per bar: each bar is wholly on or off and a single flat colour.
    vec4 field = texture(uTexture, vec2(cellX, rowY));
    float on = step(0.5, field.r);
#endif

    // Antialiased bar and row masks, centred in their cell.
    // Coarser rows keep the same bar width, so they read as thin bars with wide gaps.
    float duty = DUTY * pow(2.0, level - (LEVELS - 1.0));
    float pxBar = count * WARP * pow(max(x, 0.001), WARP - 1.0) / uResolution.x;
    float bar = 1.0 - smoothstep(0.5 * duty - pxBar, 0.5 * duty, abs(bx - cell - 0.5));
    float pxRow = rows / uResolution.y;
    float band = 1.0 - smoothstep(0.5 * ROW_FILL - pxRow, 0.5 * ROW_FILL, abs(fract(vUv.y * rows) - 0.5));

    vec3 color = BACKGROUND + spectrum(field.b) * field.g * on * bar * band;
    fragColor = vec4(color, uOpacity);
}
`,T=`
uniform sampler2D uText;
uniform vec2 uTextSize;

#ifndef SLICES
#define SLICES 40.0          // vertical strips the word is cut into
#endif

vec3 shade(vec2 uv, vec2 p) {
    // Fit the word inside the frame, keeping its aspect.
    float textAspect = uTextSize.x / uTextSize.y;
    float w = min(0.9 * gAspect, 0.34 * textAspect);
    float h = w / textAspect;
    vec2 t = p / vec2(w, h) + 0.5;

    float slice = floor(t.x * SLICES);
    float sliceX = ((slice + 0.5) / SLICES - 0.5) * w;

#ifdef GLITCH_SCROLL
    // Crisp when the block is centred in the viewport, scattered toward either end.
    float amount = smoothstep(0.1, 1.0, abs(uScroll - 0.5) * 2.0);
    amount = clamp(amount + abs(uScrollVelocity) * 0.05, 0.0, 1.0);
    float seed = 0.0;
#else
    // Every 5 seconds: a burst that re-rolls 9 times a second and settles within 1.2s.
    float cycle = uTime / 5.0;
    float burst = 1.0 - clamp(fract(cycle) / 0.24, 0.0, 1.0);
    float amount = burst * burst;
    float seed = floor(cycle) * 17.0 + floor(uTime * 9.0) * step(0.001, amount);
#endif

    // The pointer scrambles the strips under it.
    amount = max(amount, 0.7 * uMouseActive * (1.0 - smoothstep(0.0, 0.22 * gUnit, abs(sliceX - gMouse.x))));

    float lift = random(vec2(slice, seed + 1.0)) - 0.5;
    float squeeze = random(vec2(slice, seed + 2.0));
    t.y += lift * 2.4 * amount;
    t.x = (slice + 0.5 + (fract(t.x * SLICES) - 0.5) * mix(1.0, 0.2 + 1.6 * squeeze, amount)) / SLICES;

    float inside = step(0.0, t.x) * step(t.x, 1.0) * step(0.0, t.y) * step(t.y, 1.0);
    float ink = texture(uText, t).r * inside;

    // Warm on the first letters, cool on the last, and displaced strips pick up colour.
    float hue = 0.5 - 0.5 * (1.0 - smoothstep(0.0, 0.16, t.x)) + 0.5 * smoothstep(0.84, 1.0, t.x);
    hue = clamp(hue + lift * 1.4 * amount, 0.0, 1.0);

    return vec3(ink, 1.0, hue);
}
`,w={CONTINUOUS:!0,ROWS:12,BARS:44,LEVELS:1,ROW_FILL:1,DUTY:.66,DRIFT:.35},y=Object.fromEntries(Object.entries({slitBall:{name:"Bouncing Ball",description:"A ball that rebounds off every edge and never slows down, trailing bars behind it",defines:{TRAIL:.7},scene:`
float scene(vec2 p) {
    float r = 0.17 * gUnit;
    vec2 reach = vec2(0.5 * gAspect, 0.5) - r;
    // Two triangle waves with unrelated periods: straight runs, perfect rebounds, no energy lost.
    vec2 pos = (vec2(tri(uTime * 0.11 + 0.17), tri(uTime * 0.173 + 0.61)) * 2.0 - 1.0) * reach;
    return withCursor(sdCircle(p - pos, r), p);
}
`},slitMoon:{name:"Moon",description:"A tilted moon that runs through its phases, with maria shading the bars",scene:`
vec2 moonSpace(vec2 p) {
    vec2 centre = vec2(0.03 * sin(uTime * 0.21), 0.02 * sin(uTime * 0.17));
    return rot(p - centre, 0.4);
}

float scene(vec2 p) {
    // 26 second lunation, skipping the slivers either side of new that are too thin to hold a bar.
    float phase = 0.1 + 0.8 * fract(uTime / 26.0 + 0.2);
    return withCursor(sdMoon(moonSpace(p), 0.31 * gUnit, phase), p);
}

float sceneTone(vec2 p) {
    return 0.6 + 0.4 * smoothstep(0.38, 0.62, fbm(moonSpace(p) * 7.0 / gUnit + 3.0));
}
`},slitTransit:{name:"Transit",description:"A small moon orbiting a planet, crossing in front of it and passing behind",scene:`
float scene(vec2 p) {
    float a = uTime * 0.55;
    float gap = 0.022 * gUnit;
    float planet = sdCircle(p, 0.24 * gUnit);
    float moon = sdCircle(p - vec2(cos(a) * 0.52, -sin(a) * 0.08) * gUnit, 0.07 * gUnit);

    // Near half of the orbit: the moon cuts a ring-shaped gap out of the planet.
    // Far half: the planet cuts the gap out of the moon.
    float d = sin(a) > 0.0
        ? min(max(planet, -(moon - gap)), moon)
        : min(planet, max(moon, -(planet - gap)));
    return withCursor(d, p);
}
`},slitRibbon:{name:"Ribbon",description:"A travelling wave that bends toward the pointer",scene:`
float scene(vec2 p) {
    float y = 0.15 * sin(p.x * 4.2 - uTime * 0.9) + 0.05 * sin(p.x * 9.0 + uTime * 1.3);
    float pull = uMouseActive * exp(-pow((p.x - gMouse.x) / (0.22 * gUnit), 2.0));
    y = mix(y, gMouse.y, 0.85 * pull);
    float ribbon = (abs(p.y - y) - 0.09) * 0.8;
    return max(ribbon, abs(p.x) - (0.5 * gAspect - 0.08));
}
`},slitLava:{name:"Lava",description:"Four blobs that merge and split; the pointer is a fifth",scene:`
float scene(vec2 p) {
    float d = 1e5;
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 centre = vec2(
            sin(uTime * (0.31 + fi * 0.07) + fi * 2.1) * 0.34 * gAspect,
            cos(uTime * (0.23 + fi * 0.05) + fi * 1.3) * 0.3
        );
        d = smoothUnion(d, sdCircle(p - centre, (0.11 + 0.025 * fi) * gUnit), 0.21 * gUnit);
    }
    return withCursor(d, p);
}
`},slitSonar:{name:"Sonar",description:"Rings spreading from the centre, or from the pointer while it is on the canvas",defines:{ROWS:30,BARS:22,TINT_WIDTH:.05},scene:`
float ringRadius(vec2 p) {
    return length(p - gMouse * uMouseActive);
}

float scene(vec2 p) {
    float period = 0.26 * gUnit;
    return abs(mod(ringRadius(p) - uTime * 0.07, period) - 0.5 * period) - 0.05 * gUnit;
}

float sceneTone(vec2 p) {
    return 1.0 - 0.75 * smoothstep(0.15, 0.75, ringRadius(p));
}
`},slitCursor:{name:"Cursor Brush",description:"Paint with the pointer: the blob stretches with speed and leaves a cooling trail",defines:{TRAIL:1.6},scene:`
float scene(vec2 p) {
    // With no pointer on the canvas (touch screens, idle pages) a slow figure-eight stands in.
    vec2 idle = vec2(sin(uTime * 0.7) * 0.32 * gAspect, sin(uTime * 1.4) * 0.24);
    vec2 centre = mix(idle, gMouse, uMouseActive);

    vec2 velocity = uMouseVelocity * vec2(gAspect, 1.0) * uMouseActive;
    float speed = length(velocity);
    vec2 dir = speed > 0.001 ? velocity / speed : vec2(1.0, 0.0);

    vec2 q = p - centre;
    float stretch = 1.0 + min(speed * 0.6, 1.6);
    vec2 local = vec2(dot(q, dir) / stretch, dot(q, vec2(-dir.y, dir.x)));
    return length(local) - 0.13 * gUnit;
}
`},slitText:{name:"Headline",description:"A word from a text texture, cut into strips that scatter and settle",textures:{uText:{kind:"text",text:"SHADER SHED"}},defines:w,shade:T},slitImage:{name:"Blinds",description:"An image texture seen through drifting vertical slits",textures:{uImage:{kind:"image",src:"/textures/still-life.svg"}},defines:{CONTINUOUS:!0,ROWS:1,LEVELS:1,ROW_FILL:1,BARS:34,DUTY:.45,WARP:.6,DRIFT:.8},shade:`
uniform sampler2D uImage;
uniform vec2 uImageSize;

vec3 shade(vec2 uv, vec2 p) {
    // Cover-fit the image, then let it slide a little with time and the pointer.
    float imageAspect = uImageSize.x / uImageSize.y;
    vec2 t = uv - 0.5;
    if (gAspect > imageAspect) {
        t.y *= imageAspect / gAspect;
    } else {
        t.x *= gAspect / imageAspect;
    }
    t.x += 0.025 * sin(uTime * 0.3) + 0.05 * (uMouse.x - 0.5) * uMouseActive;

    vec3 rgb = texture(uImage, t * 0.92 + 0.5).rgb;
    float luminance = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    return vec3(1.0, luminance, 0.5);
}
`},slitScrollMoon:{name:"Scroll \xb7 Moon Phase",description:"Scroll progress waxes a rising moon from a thin crescent to full",scrollDriven:!0,scene:`
float scene(vec2 p) {
    float phase = mix(0.18, 0.5, smoothstep(0.0, 0.92, uScroll));
    vec2 centre = vec2(0.0, mix(-0.14, 0.05, uScroll));
    return sdMoon(rot(p - centre, 0.4), 0.3 * gUnit, phase);
}
`},slitScrollMorph:{name:"Scroll \xb7 Morph",description:"Scroll progress turns a disc into a ribbon, then floods the frame with bars",scrollDriven:!0,scene:`
float scene(vec2 p) {
    float disc = sdCircle(p, 0.24 * gUnit);
    float ribbon = (abs(p.y - 0.14 * sin(p.x * 4.5 + uScroll * 6.0)) - 0.09) * 0.8;
    ribbon = max(ribbon, abs(p.x) - (0.5 * gAspect - 0.08));

    float d = mix(disc, ribbon, smoothstep(0.12, 0.5, uScroll));
    return d - 0.6 * clamp((uScroll - 0.72) / 0.28, 0.0, 1.0);
}
`},slitScrollText:{name:"Scroll \xb7 Headline",description:"A scattered word that assembles as its block reaches the middle of the viewport",scrollDriven:!0,textures:{uText:{kind:"text",text:"SCROLL"}},defines:{...w,GLITCH_SCROLL:!0,SLICES:28},shade:T}}).map(([e,t])=>[e,function(e){let t;if(void 0!==e.scene){let o=e.scene.includes("float sceneTone(")?"":g;t=e.scene+o+m}else t=e.shade??"";return{name:`Slit Bands \xb7 ${e.name}`,description:e.description,sim:v+t+x,final:b,defines:e.defines,textures:e.textures,scrollDriven:e.scrollDriven,includeInSlideshow:!1}}(t)]));Object.keys(y);let E={ripple:{name:"Ripple Flow",description:"Feedback trails smeared along drifting noise",sim:r,final:i,includeInSlideshow:!1},plasma:{name:"Plasma",description:"Classic plasma effect with sine waves",sim:n,final:a,includeInSlideshow:!1},gradient:{name:"Gradient Drift",description:"Smooth flowing color gradients",sim:l,final:s,includeInSlideshow:!1},voronoi:{name:"Voronoi Cells",description:"Animated cellular pattern",sim:c,final:u,includeInSlideshow:!1},eclipseWeave:{name:"Eclipse Weave",description:"Earth and sky corridor fading into atmospheric haze",sim:f,final:d},sdfOrbitalBlobs:{name:"SDF Orbital Blobs",description:"Metaball cluster of orbiting blobs and glossy highlights",sim:h,final:p,includeInSlideshow:!1},...y},R=Object.keys(E),S=R.filter(e=>!0===E[e].scrollDriven),_=R.filter(e=>!1!==E[e].includeInSlideshow),A="ripple";function U(e){return E[e]||E[A]}}}]);