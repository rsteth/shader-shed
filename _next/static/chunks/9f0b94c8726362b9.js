(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,25443,(e,t,r)=>{e.e,t.exports=function(){"use strict";var e=function(e){return e instanceof Uint8Array||e instanceof Uint16Array||e instanceof Uint32Array||e instanceof Int8Array||e instanceof Int16Array||e instanceof Int32Array||e instanceof Float32Array||e instanceof Float64Array||e instanceof Uint8ClampedArray},t=function(e,t){for(var r=Object.keys(t),n=0;n<r.length;++n)e[r[n]]=t[r[n]];return e};function r(e){var t=Error("(regl) "+e);throw console.error(t),t}function n(e,t){e||r(t)}function a(e){return e?": "+e:""}function i(e,t){switch(t){case"number":return"number"==typeof e;case"object":return"object"==typeof e;case"string":return"string"==typeof e;case"boolean":return"boolean"==typeof e;case"function":return"function"==typeof e;case"undefined":return void 0===e;case"symbol":return"symbol"==typeof e}}function o(e,t,n){0>t.indexOf(e)&&r("invalid value"+a(n)+". must be one of: "+t)}var f=["gl","canvas","container","attributes","pixelRatio","extensions","optionalExtensions","profile","onDone"];function u(e,t){for(e+="";e.length<t;)e=" "+e;return e}function s(){this.name="unknown",this.lines=[],this.index={},this.hasErrors=!1}function l(e,t){this.number=e,this.line=t,this.errors=[]}function c(e,t,r){this.file=e,this.line=t,this.message=r}function m(){var e=Error(),t=(e.stack||e).toString(),r=/compileProcedure.*\n\s*at.*\((.*)\)/.exec(t);if(r)return r[1];var n=/compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(t);return n?n[1]:"unknown"}function d(){var e=Error(),t=(e.stack||e).toString(),r=/at REGLCommand.*\n\s+at.*\((.*)\)/.exec(t);if(r)return r[1];var n=/at REGLCommand.*\n\s+at\s+(.*)\n/.exec(t);return n?n[1]:"unknown"}function p(e,t){var r=e.split("\n"),n=1,a=0,i={unknown:new s,0:new s};i.unknown.name=i[0].name=t||m(),i.unknown.lines.push(new l(0,""));for(var o=0;o<r.length;++o){var f=r[o],u=/^\s*#\s*(\w+)\s+(.+)\s*$/.exec(f);if(u)switch(u[1]){case"line":var c=/(\d+)(\s+\d+)?/.exec(u[2]);c&&(n=0|c[1],c[2]&&((a=0|c[2])in i||(i[a]=new s)));break;case"define":var d,p=/SHADER_NAME(_B64)?\s+(.*)$/.exec(u[2]);p&&(i[a].name=p[1]?(d=p[2],"u">typeof atob?atob(d):"base64:"+d):p[2])}i[a].lines.push(new l(n++,f))}return Object.keys(i).forEach(function(e){var t=i[e];t.lines.forEach(function(e){t.index[e.number]=e})}),i}function v(e){e._commandRef=m()}function h(e,t){var n=d();r(e+" in command "+(t||m())+("unknown"===n?"":" called from "+n))}function b(e,t,r,n){i(e,t)||h("invalid parameter type"+a(r)+". expected "+t+", got "+typeof e,n||m())}var g={};function y(e,t){return 32820===e||32819===e||33635===e?2:34042===e?4:g[e]*t}function x(e){return!(e&e-1)&&!!e}g[5120]=g[5121]=1,g[5122]=g[5123]=g[36193]=g[33635]=g[32819]=g[32820]=2,g[5124]=g[5125]=g[5126]=g[34042]=4;var w=t(n,{optional:function(e){e()},raise:r,commandRaise:h,command:function(e,t,r){e||h(t,r||m())},parameter:function(e,t,n){e in t||r("unknown parameter ("+e+")"+a(n)+". possible values: "+Object.keys(t).join())},commandParameter:function(e,t,r,n){e in t||h("unknown parameter ("+e+")"+a(r)+". possible values: "+Object.keys(t).join(),n||m())},constructor:function(e){Object.keys(e).forEach(function(e){0>f.indexOf(e)&&r('invalid regl constructor argument "'+e+'". must be one of '+f)})},type:function(e,t,n){i(e,t)||r("invalid parameter type"+a(n)+". expected "+t+", got "+typeof e)},commandType:b,isTypedArray:function(t,n){e(t)||r("invalid parameter type"+a(n)+". must be a typed array")},nni:function(e,t){e>=0&&(0|e)===e||r("invalid parameter type, ("+e+")"+a(t)+". must be a nonnegative integer")},oneOf:o,shaderError:function(e,t,r,a,i){if(!e.getShaderParameter(t,e.COMPILE_STATUS)){var o,f=e.getShaderInfoLog(t),s=a===e.FRAGMENT_SHADER?"fragment":"vertex";b(r,"string",s+" shader source must be a string",i);var l=p(r,i);(o=[],f.split("\n").forEach(function(e){if(!(e.length<5)){var t=/^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(e);t?o.push(new c(0|t[1],0|t[2],t[3].trim())):e.length>0&&o.push(new c("unknown",0,e))}}),o).forEach(function(e){var t=l[e.file];if(t){var r=t.index[e.line];if(r){r.errors.push(e),t.hasErrors=!0;return}}l.unknown.hasErrors=!0,l.unknown.lines[0].errors.push(e)}),Object.keys(l).forEach(function(e){var t=l[e];if(t.hasErrors){var r=[""],n=[""];a("file number "+e+": "+t.name+"\n","color:red;text-decoration:underline;font-weight:bold"),t.lines.forEach(function(e){if(e.errors.length>0){a(u(e.number,4)+"|  ","background-color:yellow; font-weight:bold"),a(e.line+"\n","color:red; background-color:yellow; font-weight:bold");var t=0;e.errors.forEach(function(r){var n=r.message,i=/^\s*'(.*)'\s*:\s*(.*)$/.exec(n);if(i){var o=i[1];n=i[2],"assign"===o&&(o="="),t=Math.max(e.line.indexOf(o,t),0)}else t=0;a(u("| ",6)),a(u("^^^",t+3)+"\n","font-weight:bold"),a(u("| ",6)),a(n+"\n","font-weight:bold")}),a(u("| ",6)+"\n")}else a(u(e.number,4)+"|  "),a(e.line+"\n","color:red")}),"u">typeof document&&!window.chrome?(n[0]=r.join("%c"),console.log.apply(console,n)):console.log(r.join(""))}function a(e,t){r.push(e),n.push(t||"")}}),n.raise("Error compiling "+s+" shader, "+l[0].name)}},linkError:function(e,t,r,a,i){if(!e.getProgramParameter(t,e.LINK_STATUS)){var o=e.getProgramInfoLog(t),f=p(r,i),u='Error linking program with vertex shader, "'+p(a,i)[0].name+'", and fragment shader "'+f[0].name+'"';"u">typeof document?console.log("%c"+u+"\n%c"+o,"color:red;text-decoration:underline;font-weight:bold","color:red"):console.log(u+"\n"+o),n.raise(u)}},callSite:d,saveCommandRef:v,saveDrawInfo:function(e,t,r,n){function a(e,t){Object.keys(t).forEach(function(t){e[n.id(t)]=!0})}v(e),e._fragId=(i=e.static.frag)?n.id(i):0,e._vertId=(o=e.static.vert)?n.id(o):0;var i,o,f=e._uniformSet={};a(f,t.static),a(f,t.dynamic);var u=e._attributeSet={};a(u,r.static),a(u,r.dynamic),e._hasCount="count"in e.static||"count"in e.dynamic||"elements"in e.static||"elements"in e.dynamic},framebufferFormat:function(e,t,r){e.texture?o(e.texture._texture.internalformat,t,"unsupported texture format for attachment"):o(e.renderbuffer._renderbuffer.format,r,"unsupported renderbuffer format for attachment")},guessCommand:m,texture2D:function(e,t,r){var a,i=t.width,o=t.height,f=t.channels;n(i>0&&i<=r.maxTextureSize&&o>0&&o<=r.maxTextureSize,"invalid texture shape"),(33071!==e.wrapS||33071!==e.wrapT)&&n(x(i)&&x(o),"incompatible wrap mode for texture, both width and height must be power of 2"),1===t.mipmask?1!==i&&1!==o&&n(9984!==e.minFilter&&9986!==e.minFilter&&9985!==e.minFilter&&9987!==e.minFilter,"min filter requires mipmap"):(n(x(i)&&x(o),"texture must be a square power of 2 to support mipmapping"),n(t.mipmask===(i<<1)-1,"missing or incomplete mipmap data")),5126===t.type&&(0>r.extensions.indexOf("oes_texture_float_linear")&&n(9728===e.minFilter&&9728===e.magFilter,"filter not supported, must enable oes_texture_float_linear"),n(!e.genMipmaps,"mipmap generation not supported with float textures"));var u=t.images;for(a=0;a<16;++a)if(u[a]){var s=i>>a,l=o>>a;n(t.mipmask&1<<a,"missing mipmap data");var c=u[a];if(n(c.width===s&&c.height===l,"invalid shape for mip images"),n(c.format===t.format&&c.internalformat===t.internalformat&&c.type===t.type,"incompatible type for mip image"),c.compressed);else if(c.data){var m=Math.ceil(y(c.type,f)*s/c.unpackAlignment)*c.unpackAlignment;n(c.data.byteLength===m*l,"invalid data for image, buffer size is inconsistent with image format")}else c.element||c.copy}else e.genMipmaps||n((t.mipmask&1<<a)==0,"extra mipmap data");t.compressed&&n(!e.genMipmaps,"mipmap generation for compressed images not supported")},textureCube:function(e,t,r,a){var i=e.width,o=e.height,f=e.channels;n(i>0&&i<=a.maxTextureSize&&o>0&&o<=a.maxTextureSize,"invalid texture shape"),n(i===o,"cube map must be square"),n(33071===t.wrapS&&33071===t.wrapT,"wrap mode not supported by cube map");for(var u=0;u<r.length;++u){var s=r[u];n(s.width===i&&s.height===o,"inconsistent cube map face shape"),t.genMipmaps&&(n(!s.compressed,"can not generate mipmap for compressed textures"),n(1===s.mipmask,"can not specify mipmaps and generate mipmaps"));for(var l=s.images,c=0;c<16;++c){var m=l[c];if(m){var d=i>>c,p=o>>c;n(s.mipmask&1<<c,"missing mipmap data"),n(m.width===d&&m.height===p,"invalid shape for mip images"),n(m.format===e.format&&m.internalformat===e.internalformat&&m.type===e.type,"incompatible type for mip image"),m.compressed||(m.data?n(m.data.byteLength===d*p*Math.max(y(m.type,f),m.unpackAlignment),"invalid data for image, buffer size is inconsistent with image format"):m.element||m.copy)}}}}}),A=0;function T(e,t){this.id=A++,this.type=e,this.data=t}function _(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}var S=function(e,t){return new T(e,"["+(function e(t){if(0===t.length)return[];var r=t.charAt(0),n=t.charAt(t.length-1);if(t.length>1&&r===n&&('"'===r||"'"===r))return['"'+_(t.substr(1,t.length-2))+'"'];var a=/\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(t);if(a)return e(t.substr(0,a.index)).concat(e(a[1])).concat(e(t.substr(a.index+a[0].length)));var i=t.split(".");if(1===i.length)return['"'+_(t)+'"'];for(var o=[],f=0;f<i.length;++f)o=o.concat(e(i[f]));return o})(t+"").join("][")+"]")},E=function(e){return"function"==typeof e&&!e._reglType||e instanceof T},k=function e(t,r){return"function"==typeof t?new T(0,t):"number"==typeof t||"boolean"==typeof t?new T(5,t):Array.isArray(t)?new T(6,t.map(function(t,n){return e(t,r+"["+n+"]")})):t instanceof T?t:void w(!1,"invalid option type in uniform "+r)},O={next:"function"==typeof requestAnimationFrame?function(e){return requestAnimationFrame(e)}:function(e){return setTimeout(e,16)},cancel:"function"==typeof cancelAnimationFrame?function(e){return cancelAnimationFrame(e)}:clearTimeout},C="u">typeof performance&&performance.now?function(){return performance.now()}:function(){return+new Date};function D(e){return"string"==typeof e?e.split():(w(Array.isArray(e),"invalid extension array"),e)}function R(e){return"string"==typeof e?(w("u">typeof document,"not supported outside of DOM"),document.querySelector(e)):e}function F(e,t){for(var r=Array(e),n=0;n<e;++n)r[n]=t(n);return r}function z(e){var t,r;return t=(e>65535)<<4,e>>>=t,r=(e>255)<<3,e>>>=r,t|=r,r=(e>15)<<2,e>>>=r,t|=r,r=(e>3)<<1,e>>>=r,(t|=r)|e>>1}function j(){var e=F(8,function(){return[]});function t(t){var r=function(e){for(var t=16;t<=0x10000000;t*=16)if(e<=t)return t;return 0}(t),n=e[z(r)>>2];return n.length>0?n.pop():new ArrayBuffer(r)}function r(t){e[z(t.byteLength)>>2].push(t)}return{alloc:t,free:r,allocType:function(e,r){var n=null;switch(e){case 5120:n=new Int8Array(t(r),0,r);break;case 5121:n=new Uint8Array(t(r),0,r);break;case 5122:n=new Int16Array(t(2*r),0,r);break;case 5123:n=new Uint16Array(t(2*r),0,r);break;case 5124:n=new Int32Array(t(4*r),0,r);break;case 5125:n=new Uint32Array(t(4*r),0,r);break;case 5126:n=new Float32Array(t(4*r),0,r);break;default:return null}return n.length!==r?n.subarray(0,r):n},freeType:function(e){r(e.buffer)}}}var U=j();U.zero=j();var P=function(e,t){var r=1;t.ext_texture_filter_anisotropic&&(r=e.getParameter(34047));var n=1,a=1;t.webgl_draw_buffers&&(n=e.getParameter(34852),a=e.getParameter(36063));var i=!!t.oes_texture_float;if(i){var o=e.createTexture();e.bindTexture(3553,o),e.texImage2D(3553,0,6408,1,1,0,6408,5126,null);var f=e.createFramebuffer();if(e.bindFramebuffer(36160,f),e.framebufferTexture2D(36160,36064,3553,o,0),e.bindTexture(3553,null),36053!==e.checkFramebufferStatus(36160))i=!1;else{e.viewport(0,0,1,1),e.clearColor(1,0,0,1),e.clear(16384);var u=U.allocType(5126,4);e.readPixels(0,0,1,1,6408,5126,u),e.getError()?i=!1:(e.deleteFramebuffer(f),e.deleteTexture(o),i=1===u[0]),U.freeType(u)}}var s="u">typeof navigator&&(/MSIE/.test(navigator.userAgent)||/Trident\//.test(navigator.appVersion)||/Edge/.test(navigator.userAgent)),l=!0;if(!s){var c=e.createTexture(),m=U.allocType(5121,36);e.activeTexture(33984),e.bindTexture(34067,c),e.texImage2D(34069,0,6408,3,3,0,6408,5121,m),U.freeType(m),e.bindTexture(34067,null),e.deleteTexture(c),l=!e.getError()}return{colorBits:[e.getParameter(3410),e.getParameter(3411),e.getParameter(3412),e.getParameter(3413)],depthBits:e.getParameter(3414),stencilBits:e.getParameter(3415),subpixelBits:e.getParameter(3408),extensions:Object.keys(t).filter(function(e){return!!t[e]}),maxAnisotropic:r,maxDrawbuffers:n,maxColorAttachments:a,pointSizeDims:e.getParameter(33901),lineWidthDims:e.getParameter(33902),maxViewportDims:e.getParameter(3386),maxCombinedTextureUnits:e.getParameter(35661),maxCubeMapSize:e.getParameter(34076),maxRenderbufferSize:e.getParameter(34024),maxTextureUnits:e.getParameter(34930),maxTextureSize:e.getParameter(3379),maxAttributes:e.getParameter(34921),maxVertexUniforms:e.getParameter(36347),maxVertexTextureUnits:e.getParameter(35660),maxVaryingVectors:e.getParameter(36348),maxFragmentUniforms:e.getParameter(36349),glsl:e.getParameter(35724),renderer:e.getParameter(7937),vendor:e.getParameter(7936),version:e.getParameter(7938),readFloat:i,npotTextureCube:l}};function B(t){return!!t&&"object"==typeof t&&Array.isArray(t.shape)&&Array.isArray(t.stride)&&"number"==typeof t.offset&&t.shape.length===t.stride.length&&(Array.isArray(t.data)||e(t.data))}var L=function(e){return Object.keys(e).map(function(t){return e[t]})},I=function(e){for(var t=[],r=e;r.length;r=r[0])t.push(r.length);return t},M=function(e,t,r,n){var a=1;if(t.length)for(var i=0;i<t.length;++i)a*=t[i];else a=0;var o=n||U.allocType(r,a);switch(t.length){case 0:break;case 1:for(var f=t[0],u=0;u<f;++u)o[u]=e[u];break;case 2:!function(e,t,r,n){for(var a=0,i=0;i<t;++i)for(var o=e[i],f=0;f<r;++f)n[a++]=o[f]}(e,t[0],t[1],o);break;case 3:G(e,t[0],t[1],t[2],o,0);break;default:!function e(t,r,n,a,i){for(var o=1,f=n+1;f<r.length;++f)o*=r[f];var u=r[n];if(r.length-n==4){var s=r[n+1],l=r[n+2],c=r[n+3];for(f=0;f<u;++f)G(t[f],s,l,c,a,i),i+=o}else for(f=0;f<u;++f)e(t[f],r,n+1,a,i),i+=o}(e,t,0,o,0)}return o};function G(e,t,r,n,a,i){for(var o=i,f=0;f<t;++f)for(var u=e[f],s=0;s<r;++s)for(var l=u[s],c=0;c<n;++c)a[o++]=l[c]}var V={"[object Int8Array]":5120,"[object Int16Array]":5122,"[object Int32Array]":5124,"[object Uint8Array]":5121,"[object Uint8ClampedArray]":5121,"[object Uint16Array]":5123,"[object Uint32Array]":5125,"[object Float32Array]":5126,"[object Float64Array]":5121,"[object ArrayBuffer]":5121},q={int8:5120,int16:5122,int32:5124,uint8:5121,uint16:5123,uint32:5125,float:5126,float32:5126},W={dynamic:35048,stream:35040,static:35044},X=[];function N(e){return 0|V[Object.prototype.toString.call(e)]}function H(e,t){for(var r=0;r<t.length;++r)e[r]=t[r]}function $(e,t,r,n,a,i,o){for(var f=0,u=0;u<r;++u)for(var s=0;s<n;++s)e[f++]=t[a*u+i*s+o]}X[5120]=1,X[5122]=2,X[5124]=4,X[5121]=1,X[5123]=2,X[5125]=4,X[5126]=4;var Q={points:0,point:0,lines:1,line:1,triangles:4,triangle:4,"line loop":2,"line strip":3,"triangle strip":5,"triangle fan":6},Y=new Float32Array(1),K=new Uint32Array(Y.buffer);function J(e){for(var t=U.allocType(5123,e.length),r=0;r<e.length;++r)if(isNaN(e[r]))t[r]=65535;else if(e[r]===1/0)t[r]=31744;else if(e[r]===-1/0)t[r]=64512;else{Y[0]=e[r];var n=K[0],a=n>>>31<<15,i=(n<<1>>>24)-127,o=n>>13&1023;if(i<-24)t[r]=a;else if(i<-14){var f=-14-i;t[r]=a+(o+1024>>f)}else i>15?t[r]=a+31744:t[r]=a+(i+15<<10)+o}return t}function Z(t){return Array.isArray(t)||e(t)}var ee=function(e){return!(e&e-1)&&!!e},et=[9984,9986,9985,9987],er=[0,6409,6410,6407,6408],en={};function ea(e){return"[object "+e+"]"}en[6409]=en[6406]=en[6402]=1,en[34041]=en[6410]=2,en[6407]=en[35904]=3,en[6408]=en[35906]=4;var ei=ea("HTMLCanvasElement"),eo=ea("OffscreenCanvas"),ef=ea("CanvasRenderingContext2D"),eu=ea("ImageBitmap"),es=ea("HTMLImageElement"),el=ea("HTMLVideoElement"),ec=Object.keys(V).concat([ei,eo,ef,eu,es,el]),em=[];em[5121]=1,em[5126]=4,em[36193]=2,em[5123]=2,em[5125]=4;var ed=[];function ep(e){return Array.isArray(e)&&(0===e.length||"number"==typeof e[0])}function ev(e){return!!Array.isArray(e)&&0!==e.length&&!!Z(e[0])}function eh(e){return Object.prototype.toString.call(e)}function eb(e){if(!e)return!1;var t=eh(e);return ec.indexOf(t)>=0||ep(e)||ev(e)||B(e)}function eg(e){return 0|V[Object.prototype.toString.call(e)]}function ey(e,t){return U.allocType(36193===e.type?5126:e.type,t)}function ex(e,t){36193===e.type?(e.data=J(t),U.freeType(t)):e.data=t}function ew(e,t,r,n,a,i){var o;if(o=void 0!==ed[e]?ed[e]:en[e]*em[t],i&&(o*=6),!a)return o*r*n;for(var f=0,u=r;u>=1;)f+=o*u*u,u/=2;return f}ed[32854]=2,ed[32855]=2,ed[36194]=2,ed[34041]=4,ed[33776]=.5,ed[33777]=.5,ed[33778]=1,ed[33779]=1,ed[35986]=.5,ed[35987]=1,ed[34798]=1,ed[35840]=.5,ed[35841]=.25,ed[35842]=.5,ed[35843]=.25,ed[36196]=.5;var eA=[];eA[32854]=2,eA[32855]=2,eA[36194]=2,eA[33189]=2,eA[36168]=1,eA[34041]=4,eA[35907]=4,eA[34836]=16,eA[34842]=8,eA[34843]=6;var eT=function(e,t,r,n,a){var i={rgba4:32854,rgb565:36194,"rgb5 a1":32855,depth:33189,stencil:36168,"depth stencil":34041};t.ext_srgb&&(i.srgba=35907),t.ext_color_buffer_half_float&&(i.rgba16f=34842,i.rgb16f=34843),t.webgl_color_buffer_float&&(i.rgba32f=34836);var o=[];Object.keys(i).forEach(function(e){o[i[e]]=e});var f=0,u={};function s(e){this.id=f++,this.refCount=1,this.renderbuffer=e,this.format=32854,this.width=0,this.height=0,a.profile&&(this.stats={size:0})}function l(t){var r=t.renderbuffer;w(r,"must not double destroy renderbuffer"),e.bindRenderbuffer(36161,null),e.deleteRenderbuffer(r),t.renderbuffer=null,t.refCount=0,delete u[t.id],n.renderbufferCount--}return s.prototype.decRef=function(){--this.refCount<=0&&l(this)},a.profile&&(n.getTotalRenderbufferSize=function(){var e=0;return Object.keys(u).forEach(function(t){e+=u[t].stats.size}),e}),{create:function(t,f){var l=new s(e.createRenderbuffer());function c(t,n){var f,u,s,m=0,d=0,p=32854;if("object"==typeof t&&t){if("shape"in t){var v=t.shape;w(Array.isArray(v)&&v.length>=2,"invalid renderbuffer shape"),m=0|v[0],d=0|v[1]}else"radius"in t&&(m=d=0|t.radius),"width"in t&&(m=0|t.width),"height"in t&&(d=0|t.height);"format"in t&&(w.parameter(t.format,i,"invalid renderbuffer format"),p=i[t.format])}else"number"==typeof t?(m=0|t,d="number"==typeof n?0|n:m):t?w.raise("invalid arguments to renderbuffer constructor"):m=d=1;if(w(m>0&&d>0&&m<=r.maxRenderbufferSize&&d<=r.maxRenderbufferSize,"invalid renderbuffer size"),m!==l.width||d!==l.height||p!==l.format)return c.width=l.width=m,c.height=l.height=d,l.format=p,e.bindRenderbuffer(36161,l.renderbuffer),e.renderbufferStorage(36161,p,m,d),w(0===e.getError(),"invalid render buffer format"),a.profile&&(l.stats.size=(f=l.format,u=l.width,s=l.height,eA[f]*u*s)),c.format=o[l.format],c}return u[l.id]=l,n.renderbufferCount++,c(t,f),c.resize=function(t,n){var i,o,f,u=0|t,s=0|n||u;return u===l.width&&s===l.height?c:(w(u>0&&s>0&&u<=r.maxRenderbufferSize&&s<=r.maxRenderbufferSize,"invalid renderbuffer size"),c.width=l.width=u,c.height=l.height=s,e.bindRenderbuffer(36161,l.renderbuffer),e.renderbufferStorage(36161,l.format,u,s),w(0===e.getError(),"invalid render buffer format"),a.profile&&(l.stats.size=(i=l.format,o=l.width,f=l.height,eA[i]*o*f)),c)},c._reglType="renderbuffer",c._renderbuffer=l,a.profile&&(c.stats=l.stats),c.destroy=function(){l.decRef()},c},clear:function(){L(u).forEach(l)},restore:function(){L(u).forEach(function(t){t.renderbuffer=e.createRenderbuffer(),e.bindRenderbuffer(36161,t.renderbuffer),e.renderbufferStorage(36161,t.format,t.width,t.height)}),e.bindRenderbuffer(36161,null)}}},e_=[6407,6408],eS=[];eS[6408]=4,eS[6407]=3;var eE=[];eE[5121]=1,eE[5126]=4,eE[36193]=2;var ek=[32854,32855,36194,35907,34842,34843,34836],eO={};eO[36053]="complete",eO[36054]="incomplete attachment",eO[36057]="incomplete dimensions",eO[36055]="incomplete, missing attachment",eO[36061]="unsupported";var eC=["attributes","elements","offset","count","primitive","instances"];function eD(){this.state=0,this.x=0,this.y=0,this.z=0,this.w=0,this.buffer=null,this.size=0,this.normalized=!1,this.type=5126,this.offset=0,this.stride=0,this.divisor=0}function eR(e){return Array.prototype.slice.call(e)}function eF(e){return eR(e).join("")}var ez="xyzw".split(""),ej="dither",eU="blend.enable",eP="blend.color",eB="blend.equation",eL="blend.func",eI="depth.enable",eM="depth.func",eG="depth.range",eV="depth.mask",eq="colorMask",eW="cull.enable",eX="cull.face",eN="frontFace",eH="lineWidth",e$="polygonOffset.enable",eQ="polygonOffset.offset",eY="sample.alpha",eK="sample.enable",eJ="sample.coverage",eZ="stencil.enable",e0="stencil.mask",e1="stencil.func",e3="stencil.opFront",e2="stencil.opBack",e5="scissor.enable",e4="scissor.box",e6="viewport",e8="profile",e7="framebuffer",e9="vert",te="frag",tt="elements",tr="primitive",tn="count",ta="offset",ti="instances",to="Width",tf="Height",tu=e7+to,ts=e7+tf,tl=e6+to,tc=e6+tf,tm="drawingBuffer",td=tm+to,tp=tm+tf,tv=[eL,eB,e1,e3,e2,eJ,e6,e4,eQ],th={0:0,1:1,zero:0,one:1,"src color":768,"one minus src color":769,"src alpha":770,"one minus src alpha":771,"dst color":774,"one minus dst color":775,"dst alpha":772,"one minus dst alpha":773,"constant color":32769,"one minus constant color":32770,"constant alpha":32771,"one minus constant alpha":32772,"src alpha saturate":776},tb=["constant color, constant alpha","one minus constant color, constant alpha","constant color, one minus constant alpha","one minus constant color, one minus constant alpha","constant alpha, constant color","constant alpha, one minus constant color","one minus constant alpha, constant color","one minus constant alpha, one minus constant color"],tg={never:512,less:513,"<":513,equal:514,"=":514,"==":514,"===":514,lequal:515,"<=":515,greater:516,">":516,notequal:517,"!=":517,"!==":517,gequal:518,">=":518,always:519},ty={0:0,zero:0,keep:7680,replace:7681,increment:7682,decrement:7683,"increment wrap":34055,"decrement wrap":34056,invert:5386},tx={frag:35632,vert:35633},tw={cw:2304,ccw:2305};function tA(t){return Array.isArray(t)||e(t)||B(t)}function tT(e){return e.sort(function(e,t){return e===e6?-1:t===e6?1:e<t?-1:1})}function t_(e,t,r,n){this.thisDep=e,this.contextDep=t,this.propDep=r,this.append=n}function tS(e){return e&&!(e.thisDep||e.contextDep||e.propDep)}function tE(e){return new t_(!1,!1,!1,e)}function tk(e,t){var r=e.type;if(0===r){var n=e.data.length;return new t_(!0,n>=1,n>=2,t)}if(4===r){var a=e.data;return new t_(a.thisDep,a.contextDep,a.propDep,t)}if(5===r)return new t_(!1,!1,!1,t);if(6!==r)return new t_(3===r,2===r,1===r,t);for(var i=!1,o=!1,f=!1,u=0;u<e.data.length;++u){var s=e.data[u];if(1===s.type)f=!0;else if(2===s.type)o=!0;else if(3===s.type)i=!0;else if(0===s.type){i=!0;var l=s.data;l>=1&&(o=!0),l>=2&&(f=!0)}else 4===s.type&&(i=i||s.data.thisDep,o=o||s.data.contextDep,f=f||s.data.propDep)}return new t_(i,o,f,t)}var tO=new t_(!1,!1,!1,function(){}),tC=function(e,t){if(!t.ext_disjoint_timer_query)return null;var r=[],n=[];function a(){this.startQueryIndex=-1,this.endQueryIndex=-1,this.sum=0,this.stats=null}var i=[],o=[];function f(e,t,r){var n=i.pop()||new a;n.startQueryIndex=e,n.endQueryIndex=t,n.sum=0,n.stats=r,o.push(n)}var u=[],s=[];return{beginQuery:function(e){var a=r.pop()||t.ext_disjoint_timer_query.createQueryEXT();t.ext_disjoint_timer_query.beginQueryEXT(35007,a),n.push(a),f(n.length-1,n.length,e)},endQuery:function(){t.ext_disjoint_timer_query.endQueryEXT(35007)},pushScopeStats:f,update:function(){var e,a,f=n.length;if(0!==f){s.length=Math.max(s.length,f+1),u.length=Math.max(u.length,f+1),u[0]=0,s[0]=0;var l=0;for(a=0,e=0;a<n.length;++a){var c=n[a];t.ext_disjoint_timer_query.getQueryObjectEXT(c,34919)?(l+=t.ext_disjoint_timer_query.getQueryObjectEXT(c,34918),r.push(c)):n[e++]=c,u[a+1]=l,s[a+1]=e}for(a=0,n.length=e,e=0;a<o.length;++a){var m=o[a],d=m.startQueryIndex,p=m.endQueryIndex;m.sum+=u[p]-u[d];var v=s[d],h=s[p];h===v?(m.stats.gpuTime+=m.sum/1e6,i.push(m)):(m.startQueryIndex=v,m.endQueryIndex=h,o[e++]=m)}o.length=e}},getNumPendingQueries:function(){return n.length},clear:function(){r.push.apply(r,n);for(var e=0;e<r.length;e++)t.ext_disjoint_timer_query.deleteQueryEXT(r[e]);n.length=0,r.length=0},restore:function(){n.length=0,r.length=0}}},tD="webglcontextlost",tR="webglcontextrestored";function tF(e,t){for(var r=0;r<e.length;++r)if(e[r]===t)return r;return -1}return function(r){var n,a,i=function(e){var r,n,a,i,o=e||{},f={},u=[],s=[],l="u"<typeof window?1:window.devicePixelRatio,c=!1,m=function(e){e&&w.raise(e)},d=function(){};if("string"==typeof o?(w("u">typeof document,"selector queries only supported in DOM environments"),w(r=document.querySelector(o),"invalid query string for element")):"object"==typeof o?"string"==typeof o.nodeName&&"function"==typeof o.appendChild&&"function"==typeof o.getBoundingClientRect?r=o:"function"==typeof o.drawArrays||"function"==typeof o.drawElements?a=(i=o).canvas:(w.constructor(o),"gl"in o?i=o.gl:"canvas"in o?a=R(o.canvas):"container"in o&&(n=R(o.container)),"attributes"in o&&(f=o.attributes,w.type(f,"object","invalid context attributes")),"extensions"in o&&(u=D(o.extensions)),"optionalExtensions"in o&&(s=D(o.optionalExtensions)),"onDone"in o&&(w.type(o.onDone,"function","invalid or missing onDone callback"),m=o.onDone),"profile"in o&&(c=!!o.profile),"pixelRatio"in o&&w((l=+o.pixelRatio)>0,"invalid pixel ratio")):w.raise("invalid arguments to regl"),r&&("canvas"===r.nodeName.toLowerCase()?a=r:n=r),!i){if(!a){w("u">typeof document,"must manually specify webgl context outside of DOM environments");var p=function(e,r,n){var a,i=document.createElement("canvas");function o(){var t=window.innerWidth,r=window.innerHeight;if(e!==document.body){var a=i.getBoundingClientRect();t=a.right-a.left,r=a.bottom-a.top}i.width=n*t,i.height=n*r}return t(i.style,{border:0,margin:0,padding:0,top:0,left:0,width:"100%",height:"100%"}),e.appendChild(i),e===document.body&&(i.style.position="absolute",t(e.style,{margin:0,padding:0})),e!==document.body&&"function"==typeof ResizeObserver?(a=new ResizeObserver(function(){setTimeout(o)})).observe(e):window.addEventListener("resize",o,!1),o(),{canvas:i,onDestroy:function(){a?a.disconnect():window.removeEventListener("resize",o),e.removeChild(i)}}}(n||document.body,0,l);if(!p)return null;a=p.canvas,d=p.onDestroy}void 0===f.premultipliedAlpha&&(f.premultipliedAlpha=!0),i=function(e,t){function r(r){try{return e.getContext(r,t)}catch(e){return null}}return r("webgl")||r("experimental-webgl")||r("webgl-experimental")}(a,f)}return i?{gl:i,canvas:a,container:n,extensions:u,optionalExtensions:s,pixelRatio:l,profile:c,onDone:m,onDestroy:d}:(d(),m("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org"),null)}(r);if(!i)return null;var o=i.gl,f=o.getContextAttributes(),u=o.isContextLost(),s=function(e,t){var r={};function n(t){w.type(t,"string","extension name must be string");var n,a=t.toLowerCase();try{n=r[a]=e.getExtension(a)}catch(e){}return!!n}for(var a=0;a<t.extensions.length;++a){var i=t.extensions[a];if(!n(i))return t.onDestroy(),t.onDone('"'+i+'" extension is not supported by the current WebGL context, try upgrading your system or a different browser'),null}return t.optionalExtensions.forEach(n),{extensions:r,restore:function(){Object.keys(r).forEach(function(e){if(r[e]&&!n(e))throw Error("(regl): error restoring extension "+e)})}}}(o,i);if(!s)return null;var l=(n={"":0},a=[""],{id:function(e){var t=n[e];return t||(t=n[e]=a.length,a.push(e)),t},str:function(e){return a[e]}}),c={vaoCount:0,bufferCount:0,elementsCount:0,framebufferCount:0,shaderCount:0,textureCount:0,cubeCount:0,renderbufferCount:0,maxTextureUnits:0},m=s.extensions,d=tC(o,m),p=C(),v=o.drawingBufferWidth,h=o.drawingBufferHeight,b={tick:0,time:0,viewportWidth:v,viewportHeight:h,framebufferWidth:v,framebufferHeight:h,drawingBufferWidth:v,drawingBufferHeight:h,pixelRatio:i.pixelRatio},g={elements:null,primitive:4,count:-1,offset:0,instances:-1},y=P(o,m),x=function(t,r,n,a){var i=0,o={};function f(e){this.id=i++,this.buffer=t.createBuffer(),this.type=e,this.usage=35044,this.byteLength=0,this.dimension=1,this.dtype=5121,this.persistentData=null,n.profile&&(this.stats={size:0})}f.prototype.bind=function(){t.bindBuffer(this.type,this.buffer)},f.prototype.destroy=function(){c(this)};var u=[];function s(e,r,n){e.byteLength=r.byteLength,t.bufferData(e.type,r,n)}function l(t,r,n,a,i,o){if(t.usage=n,Array.isArray(r)){if(t.dtype=a||5126,r.length>0)if(Array.isArray(r[0])){for(var f,u=I(r),l=1,c=1;c<u.length;++c)l*=u[c];t.dimension=l,f=M(r,u,t.dtype),s(t,f,n),o?t.persistentData=f:U.freeType(f)}else if("number"==typeof r[0]){t.dimension=i;var m=U.allocType(t.dtype,r.length);H(m,r),s(t,m,n),o?t.persistentData=m:U.freeType(m)}else e(r[0])?(t.dimension=r[0].length,t.dtype=a||N(r[0])||5126,f=M(r,[r.length,r[0].length],t.dtype),s(t,f,n),o?t.persistentData=f:U.freeType(f)):w.raise("invalid buffer data")}else if(e(r))t.dtype=a||N(r),t.dimension=i,s(t,r,n),o&&(t.persistentData=new Uint8Array(new Uint8Array(r.buffer)));else if(B(r)){u=r.shape;var d=r.stride,p=r.offset,v=0,h=0,b=0,g=0;1===u.length?(v=u[0],h=1,b=d[0],g=0):2===u.length?(v=u[0],h=u[1],b=d[0],g=d[1]):w.raise("invalid shape"),t.dtype=a||N(r.data)||5126,t.dimension=h;var y=U.allocType(t.dtype,v*h);$(y,r.data,v,h,b,g,p),s(t,y,n),o?t.persistentData=y:U.freeType(y)}else r instanceof ArrayBuffer?(t.dtype=5121,t.dimension=i,s(t,r,n),o&&(t.persistentData=new Uint8Array(new Uint8Array(r)))):w.raise("invalid buffer data")}function c(e){r.bufferCount--,a(e);var n=e.buffer;w(n,"buffer must not be deleted already"),t.deleteBuffer(n),e.buffer=null,delete o[e.id]}return n.profile&&(r.getTotalBufferSize=function(){var e=0;return Object.keys(o).forEach(function(t){e+=o[t].stats.size}),e}),{create:function(a,i,u,s){r.bufferCount++;var m=new f(i);function d(r){var a=35044,i=null,o=0,f=0,u=1;return Array.isArray(r)||e(r)||B(r)||r instanceof ArrayBuffer?i=r:"number"==typeof r?o=0|r:r&&(w.type(r,"object","buffer arguments must be an object, a number or an array"),"data"in r&&(w(null===i||Array.isArray(i)||e(i)||B(i),"invalid data for buffer"),i=r.data),"usage"in r&&(w.parameter(r.usage,W,"invalid buffer usage"),a=W[r.usage]),"type"in r&&(w.parameter(r.type,q,"invalid buffer type"),f=q[r.type]),"dimension"in r&&(w.type(r.dimension,"number","invalid dimension"),u=0|r.dimension),"length"in r&&(w.nni(o,"buffer length must be a nonnegative integer"),o=0|r.length)),m.bind(),i?l(m,i,a,f,u,s):(o&&t.bufferData(m.type,o,a),m.dtype=f||5121,m.usage=a,m.dimension=u,m.byteLength=o),n.profile&&(m.stats.size=m.byteLength*X[m.dtype]),d}function p(e,r){w(r+e.byteLength<=m.byteLength,"invalid buffer subdata call, buffer is too small.  Can't write data of size "+e.byteLength+" starting from offset "+r+" to a buffer of size "+m.byteLength),t.bufferSubData(m.type,r,e)}return o[m.id]=m,u||d(a),d._reglType="buffer",d._buffer=m,d.subdata=function(t,r){var n,a=0|(r||0);if(m.bind(),e(t)||t instanceof ArrayBuffer)p(t,a);else if(Array.isArray(t)){if(t.length>0)if("number"==typeof t[0]){var i=U.allocType(m.dtype,t.length);H(i,t),p(i,a),U.freeType(i)}else if(Array.isArray(t[0])||e(t[0])){n=I(t);var o=M(t,n,m.dtype);p(o,a),U.freeType(o)}else w.raise("invalid buffer data")}else if(B(t)){n=t.shape;var f=t.stride,u=0,s=0,l=0,c=0;1===n.length?(u=n[0],s=1,l=f[0],c=0):2===n.length?(u=n[0],s=n[1],l=f[0],c=f[1]):w.raise("invalid shape");var v=Array.isArray(t.data)?m.dtype:N(t.data),h=U.allocType(v,u*s);$(h,t.data,u,s,l,c,t.offset),p(h,a),U.freeType(h)}else w.raise("invalid data for buffer subdata");return d},n.profile&&(d.stats=m.stats),d.destroy=function(){c(m)},d},createStream:function(e,t){var r=u.pop();return r||(r=new f(e)),r.bind(),l(r,t,35040,0,1,!1),r},destroyStream:function(e){u.push(e)},clear:function(){L(o).forEach(c),u.forEach(c)},getBuffer:function(e){return e&&e._buffer instanceof f?e._buffer:null},restore:function(){L(o).forEach(function(e){e.buffer=t.createBuffer(),t.bindBuffer(e.type,e.buffer),t.bufferData(e.type,e.persistentData||e.byteLength,e.usage)})},_initBuffer:l}}(o,c,i,function(e){return _.destroyBuffer(e)}),A=function(t,r,n,a){var i={},o=0,f={uint8:5121,uint16:5123};function u(e){this.id=o++,i[this.id]=this,this.buffer=e,this.primType=4,this.vertCount=0,this.type=0}r.oes_element_index_uint&&(f.uint32=5125),u.prototype.bind=function(){this.buffer.bind()};var s=[];function l(a,i,o,f,u,s,l){if(a.buffer.bind(),i){var c,m=l;!l&&(!e(i)||B(i)&&!e(i.data))&&(m=r.oes_element_index_uint?5125:5123),n._initBuffer(a.buffer,i,o,m,3)}else t.bufferData(34963,s,o),a.buffer.dtype=c||5121,a.buffer.usage=o,a.buffer.dimension=3,a.buffer.byteLength=s;if(c=l,!l){switch(a.buffer.dtype){case 5121:case 5120:c=5121;break;case 5123:case 5122:c=5123;break;case 5125:case 5124:c=5125;break;default:w.raise("unsupported type for element array")}a.buffer.dtype=c}a.type=c,w(5125!==c||!!r.oes_element_index_uint,"32 bit element buffers not supported, enable oes_element_index_uint first");var d=u;d<0&&(d=a.buffer.byteLength,5123===c?d>>=1:5125===c&&(d>>=2)),a.vertCount=d;var p=f;if(f<0){p=4;var v=a.buffer.dimension;1===v&&(p=0),2===v&&(p=1),3===v&&(p=4)}a.primType=p}function c(e){a.elementsCount--,w(null!==e.buffer,"must not double destroy elements"),delete i[e.id],e.buffer.destroy(),e.buffer=null}return{create:function(t,r){var i=n.create(null,34963,!0),o=new u(i._buffer);function s(t){if(t)if("number"==typeof t)i(t),o.primType=4,o.vertCount=0|t,o.type=5121;else{var r=null,n=35044,a=-1,u=-1,c=0,m=0;Array.isArray(t)||e(t)||B(t)?r=t:(w.type(t,"object","invalid arguments for elements"),"data"in t&&w(Array.isArray(r=t.data)||e(r)||B(r),"invalid data for element buffer"),"usage"in t&&(w.parameter(t.usage,W,"invalid element buffer usage"),n=W[t.usage]),"primitive"in t&&(w.parameter(t.primitive,Q,"invalid element buffer primitive"),a=Q[t.primitive]),"count"in t&&(w("number"==typeof t.count&&t.count>=0,"invalid vertex count for elements"),u=0|t.count),"type"in t&&(w.parameter(t.type,f,"invalid buffer type"),m=f[t.type]),"length"in t?c=0|t.length:(c=u,5123===m||5122===m?c*=2:(5125===m||5124===m)&&(c*=4))),l(o,r,n,a,u,c,m)}else i(),o.primType=4,o.vertCount=0,o.type=5121;return s}return a.elementsCount++,s(t),s._reglType="elements",s._elements=o,s.subdata=function(e,t){return i.subdata(e,t),s},s.destroy=function(){c(o)},s},createStream:function(e){var t=s.pop();return t||(t=new u(n.create(null,34963,!0,!1)._buffer)),l(t,e,35040,-1,-1,0,0),t},destroyStream:function(e){s.push(e)},getElements:function(e){return"function"==typeof e&&e._elements instanceof u?e._elements:null},clear:function(){L(i).forEach(c)}}}(o,m,x,c),_=function(t,r,n,a,i,o,f){for(var u=n.maxAttributes,s=Array(u),l=0;l<u;++l)s[l]=new eD;var c=0,m={},d={Record:eD,scope:{},state:s,currentVAO:null,targetVAO:null,restore:p()?function(){p()&&L(m).forEach(function(e){e.refresh()})}:function(){},createVAO:function(t){var n=new h;function f(t){if(Array.isArray(t))m=t,n.elements&&n.ownsElements&&n.elements.destroy(),n.elements=null,n.ownsElements=!1,n.offset=0,n.count=0,n.instances=-1,n.primitive=4;else{if(w("object"==typeof t,"invalid arguments for create vao"),w("attributes"in t,"must specify attributes for vao"),t.elements){var a=t.elements;n.ownsElements?("function"==typeof a&&"elements"===a._reglType?n.elements.destroy():n.elements(a),n.ownsElements=!1):o.getElements(t.elements)?(n.elements=t.elements,n.ownsElements=!1):(n.elements=o.create(t.elements),n.ownsElements=!0)}else n.elements=null,n.ownsElements=!1;m=t.attributes,n.offset=0,n.count=-1,n.instances=-1,n.primitive=4,n.elements&&(n.count=n.elements._elements.vertCount,n.primitive=n.elements._elements.primType),"offset"in t&&(n.offset=0|t.offset),"count"in t&&(n.count=0|t.count),"instances"in t&&(n.instances=0|t.instances),"primitive"in t&&(w(t.primitive in Q,"bad primitive type: "+t.primitive),n.primitive=Q[t.primitive]),w.optional(()=>{for(var e=Object.keys(t),r=0;r<e.length;++r)w(eC.indexOf(e[r])>=0,'invalid option for vao: "'+e[r]+'" valid options are '+eC)}),w(Array.isArray(m),"attributes must be an array")}w(m.length<u,"too many attributes"),w(m.length>0,"must specify at least one attribute");var s={},l=n.attributes;l.length=m.length;for(var c=0;c<m.length;++c){var m,d,p=m[c],v=l[c]=new eD,h=p.data||p;Array.isArray(h)||e(h)||B(h)?(n.buffers[c]&&(d=n.buffers[c],e(h)&&d._buffer.byteLength>=h.byteLength?d.subdata(h):(d.destroy(),n.buffers[c]=null)),n.buffers[c]||(d=n.buffers[c]=i.create(p,34962,!1,!0)),v.buffer=i.getBuffer(d),v.size=0|v.buffer.dimension,v.normalized=!1,v.type=v.buffer.dtype,v.offset=0,v.stride=0,v.divisor=0,v.state=1,s[c]=1):i.getBuffer(p)?(v.buffer=i.getBuffer(p),v.size=0|v.buffer.dimension,v.normalized=!1,v.type=v.buffer.dtype,v.offset=0,v.stride=0,v.divisor=0,v.state=1):i.getBuffer(p.buffer)?(v.buffer=i.getBuffer(p.buffer),v.size=0|(+p.size||v.buffer.dimension),v.normalized=!!p.normalized,"type"in p?(w.parameter(p.type,q,"invalid buffer type"),v.type=q[p.type]):v.type=v.buffer.dtype,v.offset=0|(p.offset||0),v.stride=0|(p.stride||0),v.divisor=0|(p.divisor||0),v.state=1,w(v.size>=1&&v.size<=4,"size must be between 1 and 4"),w(v.offset>=0,"invalid offset"),w(v.stride>=0&&v.stride<=255,"stride must be between 0 and 255"),w(v.divisor>=0,"divisor must be positive"),w(!v.divisor||!!r.angle_instanced_arrays,"ANGLE_instanced_arrays must be enabled to use divisor")):"x"in p?(w(c>0,"first attribute must not be a constant"),v.x=+p.x||0,v.y=+p.y||0,v.z=+p.z||0,v.w=+p.w||0,v.state=2):w(!1,"invalid attribute spec for location "+c)}for(var b=0;b<n.buffers.length;++b)!s[b]&&n.buffers[b]&&(n.buffers[b].destroy(),n.buffers[b]=null);return n.refresh(),f}return a.vaoCount+=1,f.destroy=function(){for(var e=0;e<n.buffers.length;++e)n.buffers[e]&&n.buffers[e].destroy();n.buffers.length=0,n.ownsElements&&(n.elements.destroy(),n.elements=null,n.ownsElements=!1),n.destroy()},f._vao=n,f._reglType="vao",f(t)},getVAO:function(e){return"function"==typeof e&&e._vao?e._vao:null},destroyBuffer:function(e){for(var r=0;r<s.length;++r){var n=s[r];n.buffer===e&&(t.disableVertexAttribArray(r),n.buffer=null)}},setVAO:p()?function(e){if(e!==d.currentVAO){var t=p();e?t.bindVertexArrayOES(e.vao):t.bindVertexArrayOES(null),d.currentVAO=e}}:function(e){if(e!==d.currentVAO){if(e)e.bindAttrs();else{for(var r=v(),n=0;n<s.length;++n){var a=s[n];a.buffer?(t.enableVertexAttribArray(n),a.buffer.bind(),t.vertexAttribPointer(n,a.size,a.type,a.normalized,a.stride,a.offfset),r&&a.divisor&&r.vertexAttribDivisorANGLE(n,a.divisor)):(t.disableVertexAttribArray(n),t.vertexAttrib4f(n,a.x,a.y,a.z,a.w))}f.elements?t.bindBuffer(34963,f.elements.buffer.buffer):t.bindBuffer(34963,null)}d.currentVAO=e}},clear:p()?function(){L(m).forEach(function(e){e.destroy()})}:function(){}};function p(){return r.oes_vertex_array_object}function v(){return r.angle_instanced_arrays}function h(){this.id=++c,this.attributes=[],this.elements=null,this.ownsElements=!1,this.count=0,this.offset=0,this.instances=-1,this.primitive=4;var e=p();e?this.vao=e.createVertexArrayOES():this.vao=null,m[this.id]=this,this.buffers=[]}return h.prototype.bindAttrs=function(){for(var e=v(),r=this.attributes,n=0;n<r.length;++n){var a=r[n];a.buffer?(t.enableVertexAttribArray(n),t.bindBuffer(34962,a.buffer.buffer),t.vertexAttribPointer(n,a.size,a.type,a.normalized,a.stride,a.offset),e&&a.divisor&&e.vertexAttribDivisorANGLE(n,a.divisor)):(t.disableVertexAttribArray(n),t.vertexAttrib4f(n,a.x,a.y,a.z,a.w))}for(var i=r.length;i<u;++i)t.disableVertexAttribArray(i);var f=o.getElements(this.elements);f?t.bindBuffer(34963,f.buffer.buffer):t.bindBuffer(34963,null)},h.prototype.refresh=function(){var e=p();e&&(e.bindVertexArrayOES(this.vao),this.bindAttrs(),d.currentVAO=null,e.bindVertexArrayOES(null))},h.prototype.destroy=function(){if(this.vao){var e=p();this===d.currentVAO&&(d.currentVAO=null,e.bindVertexArrayOES(null)),e.deleteVertexArrayOES(this.vao),this.vao=null}this.ownsElements&&(this.elements.destroy(),this.elements=null,this.ownsElements=!1),m[this.id]&&(delete m[this.id],a.vaoCount-=1)},d}(o,m,y,c,x,A,g),z=function(e,r,n,a){var i={},o={};function f(e,t,r,n){this.name=e,this.id=t,this.location=r,this.info=n}function u(e,t){for(var r=0;r<e.length;++r)if(e[r].id===t.id){e[r].location=t.location;return}e.push(t)}function s(t,n,a){var f=35632===t?i:o,u=f[n];if(!u){var s=r.str(n);u=e.createShader(t),e.shaderSource(u,s),e.compileShader(u),w.shaderError(e,u,s,t,a),f[n]=u}return u}var l={},c=[],m=0;function d(e,t){this.id=m++,this.fragId=e,this.vertId=t,this.program=null,this.uniforms=[],this.attributes=[],this.refCount=1,a.profile&&(this.stats={uniformsCount:0,attributesCount:0})}function p(t,n,i){var o,l,c=s(35632,t.fragId),m=s(35633,t.vertId),d=t.program=e.createProgram();if(e.attachShader(d,c),e.attachShader(d,m),i)for(o=0;o<i.length;++o){var p=i[o];e.bindAttribLocation(d,p[0],p[1])}e.linkProgram(d),w.linkError(e,d,r.str(t.fragId),r.str(t.vertId),n);var v=e.getProgramParameter(d,35718);a.profile&&(t.stats.uniformsCount=v);var h=t.uniforms;for(o=0;o<v;++o)if(l=e.getActiveUniform(d,o))if(l.size>1)for(var b=0;b<l.size;++b){var g=l.name.replace("[0]","["+b+"]");u(h,new f(g,r.id(g),e.getUniformLocation(d,g),l))}else u(h,new f(l.name,r.id(l.name),e.getUniformLocation(d,l.name),l));var y=e.getProgramParameter(d,35721);a.profile&&(t.stats.attributesCount=y);var x=t.attributes;for(o=0;o<y;++o)(l=e.getActiveAttrib(d,o))&&u(x,new f(l.name,r.id(l.name),e.getAttribLocation(d,l.name),l))}return a.profile&&(n.getMaxUniformsCount=function(){var e=0;return c.forEach(function(t){t.stats.uniformsCount>e&&(e=t.stats.uniformsCount)}),e},n.getMaxAttributesCount=function(){var e=0;return c.forEach(function(t){t.stats.attributesCount>e&&(e=t.stats.attributesCount)}),e}),{clear:function(){var t=e.deleteShader.bind(e);L(i).forEach(t),i={},L(o).forEach(t),o={},c.forEach(function(t){e.deleteProgram(t.program)}),c.length=0,l={},n.shaderCount=0},program:function(r,a,f,u){w.command(r>=0,"missing vertex shader",f),w.command(a>=0,"missing fragment shader",f);var s=l[a];s||(s=l[a]={});var m=s[r];if(m&&(m.refCount++,!u))return m;var v=new d(a,r);return n.shaderCount++,p(v,f,u),m||(s[r]=v),c.push(v),t(v,{destroy:function(){if(v.refCount--,v.refCount<=0){e.deleteProgram(v.program);var t=c.indexOf(v);c.splice(t,1),n.shaderCount--}s[v.vertId].refCount<=0&&(e.deleteShader(o[v.vertId]),delete o[v.vertId],delete l[v.fragId][v.vertId]),Object.keys(l[v.fragId]).length||(e.deleteShader(i[v.fragId]),delete i[v.fragId],delete l[v.fragId])}})},restore:function(){i={},o={};for(var e=0;e<c.length;++e)p(c[e],null,c[e].attributes.map(function(e){return[e.location,e.name]}))},shader:s,frag:-1,vert:-1}}(o,l,c,i),j=function(r,n,a,i,o,f,u){var s={"don't care":4352,"dont care":4352,nice:4354,fast:4353},l={repeat:10497,clamp:33071,mirror:33648},c={nearest:9728,linear:9729},m=t({mipmap:9987,"nearest mipmap nearest":9984,"linear mipmap nearest":9985,"nearest mipmap linear":9986,"linear mipmap linear":9987},c),d={none:0,browser:37444},p={uint8:5121,rgba4:32819,rgb565:33635,"rgb5 a1":32820},v={alpha:6406,luminance:6409,"luminance alpha":6410,rgb:6407,rgba:6408,rgba4:32854,"rgb5 a1":32855,rgb565:36194},h={};n.ext_srgb&&(v.srgb=35904,v.srgba=35906),n.oes_texture_float&&(p.float32=p.float=5126),n.oes_texture_half_float&&(p.float16=p["half float"]=36193),n.webgl_depth_texture&&(t(v,{depth:6402,"depth stencil":34041}),t(p,{uint16:5123,uint32:5125,"depth stencil":34042})),n.webgl_compressed_texture_s3tc&&t(h,{"rgb s3tc dxt1":33776,"rgba s3tc dxt1":33777,"rgba s3tc dxt3":33778,"rgba s3tc dxt5":33779}),n.webgl_compressed_texture_atc&&t(h,{"rgb atc":35986,"rgba atc explicit alpha":35987,"rgba atc interpolated alpha":34798}),n.webgl_compressed_texture_pvrtc&&t(h,{"rgb pvrtc 4bppv1":35840,"rgb pvrtc 2bppv1":35841,"rgba pvrtc 4bppv1":35842,"rgba pvrtc 2bppv1":35843}),n.webgl_compressed_texture_etc1&&(h["rgb etc1"]=36196);var b=Array.prototype.slice.call(r.getParameter(34467));Object.keys(h).forEach(function(e){var t=h[e];b.indexOf(t)>=0&&(v[e]=t)});var g=Object.keys(v);a.textureFormats=g;var y=[];Object.keys(v).forEach(function(e){y[v[e]]=e});var x=[];Object.keys(p).forEach(function(e){x[p[e]]=e});var A=[];Object.keys(c).forEach(function(e){A[c[e]]=e});var T=[];Object.keys(m).forEach(function(e){T[m[e]]=e});var _=[];Object.keys(l).forEach(function(e){_[l[e]]=e});var S=g.reduce(function(e,t){var r=v[t];return 6409===r||6406===r||6409===r||6410===r||6402===r||34041===r||n.ext_srgb&&(35904===r||35906===r)?e[r]=r:32855===r||t.indexOf("rgba")>=0?e[r]=6408:e[r]=6407,e},{});function E(){this.internalformat=6408,this.format=6408,this.type=5121,this.compressed=!1,this.premultiplyAlpha=!1,this.flipY=!1,this.unpackAlignment=1,this.colorSpace=37444,this.width=0,this.height=0,this.channels=0}function k(e,t){e.internalformat=t.internalformat,e.format=t.format,e.type=t.type,e.compressed=t.compressed,e.premultiplyAlpha=t.premultiplyAlpha,e.flipY=t.flipY,e.unpackAlignment=t.unpackAlignment,e.colorSpace=t.colorSpace,e.width=t.width,e.height=t.height,e.channels=t.channels}function O(e,t){if("object"==typeof t&&t){if("premultiplyAlpha"in t&&(w.type(t.premultiplyAlpha,"boolean","invalid premultiplyAlpha"),e.premultiplyAlpha=t.premultiplyAlpha),"flipY"in t&&(w.type(t.flipY,"boolean","invalid texture flip"),e.flipY=t.flipY),"alignment"in t&&(w.oneOf(t.alignment,[1,2,4,8],"invalid texture unpack alignment"),e.unpackAlignment=t.alignment),"colorSpace"in t&&(w.parameter(t.colorSpace,d,"invalid colorSpace"),e.colorSpace=d[t.colorSpace]),"type"in t){var r=t.type;w(n.oes_texture_float||"float"!==r&&"float32"!==r,"you must enable the OES_texture_float extension in order to use floating point textures."),w(n.oes_texture_half_float||"half float"!==r&&"float16"!==r,"you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures."),w(n.webgl_depth_texture||"uint16"!==r&&"uint32"!==r&&"depth stencil"!==r,"you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."),w.parameter(r,p,"invalid texture type"),e.type=p[r]}var i=e.width,o=e.height,f=e.channels,u=!1;"shape"in t?(w(Array.isArray(t.shape)&&t.shape.length>=2,"shape must be an array"),i=t.shape[0],o=t.shape[1],3===t.shape.length&&(w((f=t.shape[2])>0&&f<=4,"invalid number of channels"),u=!0),w(i>=0&&i<=a.maxTextureSize,"invalid width"),w(o>=0&&o<=a.maxTextureSize,"invalid height")):("radius"in t&&w((i=o=t.radius)>=0&&i<=a.maxTextureSize,"invalid radius"),"width"in t&&w((i=t.width)>=0&&i<=a.maxTextureSize,"invalid width"),"height"in t&&w((o=t.height)>=0&&o<=a.maxTextureSize,"invalid height"),"channels"in t&&(w((f=t.channels)>0&&f<=4,"invalid number of channels"),u=!0)),e.width=0|i,e.height=0|o,e.channels=0|f;var s=!1;if("format"in t){var l=t.format;w(n.webgl_depth_texture||"depth"!==l&&"depth stencil"!==l,"you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."),w.parameter(l,v,"invalid texture format");var c=e.internalformat=v[l];e.format=S[c],l in p&&!("type"in t)&&(e.type=p[l]),l in h&&(e.compressed=!0),s=!0}!u&&s?e.channels=en[e.format]:u&&!s?e.channels!==er[e.format]&&(e.format=e.internalformat=er[e.channels]):s&&u&&w(e.channels===en[e.format],"number of channels inconsistent with specified format")}}function C(e){r.pixelStorei(37440,e.flipY),r.pixelStorei(37441,e.premultiplyAlpha),r.pixelStorei(37443,e.colorSpace),r.pixelStorei(3317,e.unpackAlignment)}function D(){E.call(this),this.xOffset=0,this.yOffset=0,this.data=null,this.needsFree=!1,this.element=null,this.needsCopy=!1}function R(t,r){var n=null;if(eb(r)?n=r:r&&(w.type(r,"object","invalid pixel data type"),O(t,r),"x"in r&&(t.xOffset=0|r.x),"y"in r&&(t.yOffset=0|r.y),eb(r.data)&&(n=r.data)),w(!t.compressed||n instanceof Uint8Array,"compressed texture data must be stored in a uint8array"),r.copy){w(!n,"can not specify copy and data field for the same texture");var i=o.viewportWidth,f=o.viewportHeight;t.width=t.width||i-t.xOffset,t.height=t.height||f-t.yOffset,t.needsCopy=!0,w(t.xOffset>=0&&t.xOffset<i&&t.yOffset>=0&&t.yOffset<f&&t.width>0&&t.width<=i&&t.height>0&&t.height<=f,"copy texture read out of bounds")}else if(n){if(e(n))t.channels=t.channels||4,t.data=n,"type"in r||5121!==t.type||(t.type=eg(n));else if(ep(n)){t.channels=t.channels||4;var u=n,s=u.length;switch(t.type){case 5121:case 5123:case 5125:case 5126:var l=U.allocType(t.type,s);l.set(u),t.data=l;break;case 36193:t.data=J(u);break;default:w.raise("unsupported texture type, must specify a typed array")}t.alignment=1,t.needsFree=!0}else if(B(n)){var c,m,d,p,v,h,b=n.data;Array.isArray(b)||5121!==t.type||(t.type=eg(b));var g=n.shape,y=n.stride;3===g.length?(d=g[2],h=y[2]):(w(2===g.length,"invalid ndarray pixel data, must be 2 or 3D"),d=1,h=1),c=g[0],m=g[1],p=y[0],v=y[1],t.alignment=1,t.width=c,t.height=m,t.channels=d,t.format=t.internalformat=er[d],t.needsFree=!0,function(e,t,r,n,a,i){for(var o=e.width,f=e.height,u=e.channels,s=ey(e,o*f*u),l=0,c=0;c<f;++c)for(var m=0;m<o;++m)for(var d=0;d<u;++d)s[l++]=t[r*m+n*c+a*d+i];ex(e,s)}(t,b,p,v,h,n.offset)}else if(eh(n)===ei||eh(n)===eo||eh(n)===ef)eh(n)===ei||eh(n)===eo?t.element=n:t.element=n.canvas,t.width=t.element.width,t.height=t.element.height,t.channels=4;else if(eh(n)===eu)t.element=n,t.width=n.width,t.height=n.height,t.channels=4;else if(eh(n)===es)t.element=n,t.width=n.naturalWidth,t.height=n.naturalHeight,t.channels=4;else if(eh(n)===el)t.element=n,t.width=n.videoWidth,t.height=n.videoHeight,t.channels=4;else if(ev(n)){var x=t.width||n[0].length,A=t.height||n.length,T=t.channels;T=Z(n[0][0])?T||n[0][0].length:T||1;for(var _=I(n),S=1,E=0;E<_.length;++E)S*=_[E];var k=ey(t,S);M(n,_,"",k),ex(t,k),t.alignment=1,t.width=x,t.height=A,t.channels=T,t.format=t.internalformat=er[T],t.needsFree=!0}}else t.width=t.width||1,t.height=t.height||1,t.channels=t.channels||4;5126===t.type?w(a.extensions.indexOf("oes_texture_float")>=0,"oes_texture_float extension not enabled"):36193===t.type&&w(a.extensions.indexOf("oes_texture_half_float")>=0,"oes_texture_half_float extension not enabled")}function F(e,t,n,a,o){var f=e.element,u=e.data,s=e.internalformat,l=e.format,c=e.type,m=e.width,d=e.height;C(e),f?r.texSubImage2D(t,o,n,a,l,c,f):e.compressed?r.compressedTexSubImage2D(t,o,n,a,s,m,d,u):e.needsCopy?(i(),r.copyTexSubImage2D(t,o,n,a,e.xOffset,e.yOffset,m,d)):r.texSubImage2D(t,o,n,a,m,d,l,c,u)}var z=[];function j(){return z.pop()||new D}function P(e){e.needsFree&&U.freeType(e.data),D.call(e),z.push(e)}function G(){E.call(this),this.genMipmaps=!1,this.mipmapHint=4352,this.mipmask=0,this.images=Array(16)}function V(e,t,r){var n=e.images[0]=j();e.mipmask=1,n.width=e.width=t,n.height=e.height=r,n.channels=e.channels=4}function q(e,t){var r=null;if(eb(t))k(r=e.images[0]=j(),e),R(r,t),e.mipmask=1;else if(O(e,t),Array.isArray(t.mipmap))for(var n=t.mipmap,a=0;a<n.length;++a)k(r=e.images[a]=j(),e),r.width>>=a,r.height>>=a,R(r,n[a]),e.mipmask|=1<<a;else k(r=e.images[0]=j(),e),R(r,t),e.mipmask=1;k(e,e.images[0]),e.compressed&&(33776===e.internalformat||33777===e.internalformat||33778===e.internalformat||33779===e.internalformat)&&w(e.width%4==0&&e.height%4==0,"for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4")}function W(e,t){for(var n=e.images,a=0;a<n.length;++a){if(!n[a])return;!function(e,t,n){var a=e.element,o=e.data,f=e.internalformat,u=e.format,s=e.type,l=e.width,c=e.height;C(e),a?r.texImage2D(t,n,u,u,s,a):e.compressed?r.compressedTexImage2D(t,n,f,l,c,0,o):e.needsCopy?(i(),r.copyTexImage2D(t,n,u,e.xOffset,e.yOffset,l,c,0)):r.texImage2D(t,n,u,l,c,0,u,s,o||null)}(n[a],t,a)}}var X=[];function N(){var e=X.pop()||new G;E.call(e),e.mipmask=0;for(var t=0;t<16;++t)e.images[t]=null;return e}function H(e){for(var t=e.images,r=0;r<t.length;++r)t[r]&&P(t[r]),t[r]=null;X.push(e)}function $(){this.minFilter=9728,this.magFilter=9728,this.wrapS=33071,this.wrapT=33071,this.anisotropic=1,this.genMipmaps=!1,this.mipmapHint=4352}function Q(e,t){if("min"in t){var r=t.min;w.parameter(r,m),e.minFilter=m[r],!(et.indexOf(e.minFilter)>=0)||"faces"in t||(e.genMipmaps=!0)}if("mag"in t){var n=t.mag;w.parameter(n,c),e.magFilter=c[n]}var i=e.wrapS,o=e.wrapT;if("wrap"in t){var f=t.wrap;"string"==typeof f?(w.parameter(f,l),i=o=l[f]):Array.isArray(f)&&(w.parameter(f[0],l),w.parameter(f[1],l),i=l[f[0]],o=l[f[1]])}else{if("wrapS"in t){var u=t.wrapS;w.parameter(u,l),i=l[u]}if("wrapT"in t){var d=t.wrapT;w.parameter(d,l),o=l[d]}}if(e.wrapS=i,e.wrapT=o,"anisotropic"in t){var p=t.anisotropic;w("number"==typeof p&&p>=1&&p<=a.maxAnisotropic,"aniso samples must be between 1 and "),e.anisotropic=t.anisotropic}if("mipmap"in t){var v=!1;switch(typeof t.mipmap){case"string":w.parameter(t.mipmap,s,"invalid mipmap hint"),e.mipmapHint=s[t.mipmap],e.genMipmaps=!0,v=!0;break;case"boolean":v=e.genMipmaps=t.mipmap;break;case"object":w(Array.isArray(t.mipmap),"invalid mipmap type"),e.genMipmaps=!1,v=!0;break;default:w.raise("invalid mipmap type")}!v||"min"in t||(e.minFilter=9984)}}function Y(e,t){r.texParameteri(t,10241,e.minFilter),r.texParameteri(t,10240,e.magFilter),r.texParameteri(t,10242,e.wrapS),r.texParameteri(t,10243,e.wrapT),n.ext_texture_filter_anisotropic&&r.texParameteri(t,34046,e.anisotropic),e.genMipmaps&&(r.hint(33170,e.mipmapHint),r.generateMipmap(t))}var K=0,ea={},ec=a.maxTextureUnits,em=Array(ec).map(function(){return null});function ed(e){E.call(this),this.mipmask=0,this.internalformat=6408,this.id=K++,this.refCount=1,this.target=e,this.texture=r.createTexture(),this.unit=-1,this.bindCount=0,this.texInfo=new $,u.profile&&(this.stats={size:0})}function eA(e){r.activeTexture(33984),r.bindTexture(e.target,e.texture)}function eT(){var e=em[0];e?r.bindTexture(e.target,e.texture):r.bindTexture(3553,null)}function e_(e){var t=e.texture;w(t,"must not double destroy texture");var n=e.unit,a=e.target;n>=0&&(r.activeTexture(33984+n),r.bindTexture(a,null),em[n]=null),r.deleteTexture(t),e.texture=null,e.params=null,e.pixels=null,e.refCount=0,delete ea[e.id],f.textureCount--}return t(ed.prototype,{bind:function(){this.bindCount+=1;var e=this.unit;if(e<0){for(var t=0;t<ec;++t){var n=em[t];if(n){if(n.bindCount>0)continue;n.unit=-1}em[t]=this,e=t;break}e>=ec&&w.raise("insufficient number of texture units"),u.profile&&f.maxTextureUnits<e+1&&(f.maxTextureUnits=e+1),this.unit=e,r.activeTexture(33984+e),r.bindTexture(this.target,this.texture)}return e},unbind:function(){this.bindCount-=1},decRef:function(){--this.refCount<=0&&e_(this)}}),u.profile&&(f.getTotalTextureSize=function(){var e=0;return Object.keys(ea).forEach(function(t){e+=ea[t].stats.size}),e}),{create2D:function(e,t){var n=new ed(3553);function i(e,t){var r=n.texInfo;$.call(r);var o=N();return"number"==typeof e?"number"==typeof t?V(o,0|e,0|t):V(o,0|e,0|e):e?(w.type(e,"object","invalid arguments to regl.texture"),Q(r,e),q(o,e)):V(o,1,1),r.genMipmaps&&(o.mipmask=(o.width<<1)-1),n.mipmask=o.mipmask,k(n,o),w.texture2D(r,o,a),n.internalformat=o.internalformat,i.width=o.width,i.height=o.height,eA(n),W(o,3553),Y(r,3553),eT(),H(o),u.profile&&(n.stats.size=ew(n.internalformat,n.type,o.width,o.height,r.genMipmaps,!1)),i.format=y[n.internalformat],i.type=x[n.type],i.mag=A[r.magFilter],i.min=T[r.minFilter],i.wrapS=_[r.wrapS],i.wrapT=_[r.wrapT],i}return ea[n.id]=n,f.textureCount++,i(e,t),i.subimage=function(e,t,r,a){w(!!e,"must specify image data");var o=0|t,f=0|r,u=0|a,s=j();return k(s,n),s.width=0,s.height=0,R(s,e),s.width=s.width||(n.width>>u)-o,s.height=s.height||(n.height>>u)-f,w(n.type===s.type&&n.format===s.format&&n.internalformat===s.internalformat,"incompatible format for texture.subimage"),w(o>=0&&f>=0&&o+s.width<=n.width&&f+s.height<=n.height,"texture.subimage write out of bounds"),w(n.mipmask&1<<u,"missing mipmap data"),w(s.data||s.element||s.needsCopy,"missing image data"),eA(n),F(s,3553,o,f,u),eT(),P(s),i},i.resize=function(e,t){var a=0|e,o=0|t||a;if(a===n.width&&o===n.height)return i;i.width=n.width=a,i.height=n.height=o,eA(n);for(var f=0;n.mipmask>>f;++f){var s=a>>f,l=o>>f;if(!s||!l)break;r.texImage2D(3553,f,n.format,s,l,0,n.format,n.type,null)}return eT(),u.profile&&(n.stats.size=ew(n.internalformat,n.type,a,o,!1,!1)),i},i._reglType="texture2d",i._texture=n,u.profile&&(i.stats=n.stats),i.destroy=function(){n.decRef()},i},createCube:function(e,t,n,i,o,s){var l=new ed(34067);ea[l.id]=l,f.cubeCount++;var c=Array(6);function m(e,t,r,n,i,o){var f,s=l.texInfo;for($.call(s),f=0;f<6;++f)c[f]=N();if("number"!=typeof e&&e)if("object"==typeof e)if(t)q(c[0],e),q(c[1],t),q(c[2],r),q(c[3],n),q(c[4],i),q(c[5],o);else if(Q(s,e),O(l,e),"faces"in e){var d=e.faces;for(w(Array.isArray(d)&&6===d.length,"cube faces must be a length 6 array"),f=0;f<6;++f)w("object"==typeof d[f]&&!!d[f],"invalid input for cube map face"),k(c[f],l),q(c[f],d[f])}else for(f=0;f<6;++f)q(c[f],e);else w.raise("invalid arguments to cube map");else{var p=0|e||1;for(f=0;f<6;++f)V(c[f],p,p)}for(k(l,c[0]),w.optional(function(){a.npotTextureCube||w(ee(l.width)&&ee(l.height),"your browser does not support non power or two texture dimensions")}),s.genMipmaps?l.mipmask=(c[0].width<<1)-1:l.mipmask=c[0].mipmask,w.textureCube(l,s,c,a),l.internalformat=c[0].internalformat,m.width=c[0].width,m.height=c[0].height,eA(l),f=0;f<6;++f)W(c[f],34069+f);for(Y(s,34067),eT(),u.profile&&(l.stats.size=ew(l.internalformat,l.type,m.width,m.height,s.genMipmaps,!0)),m.format=y[l.internalformat],m.type=x[l.type],m.mag=A[s.magFilter],m.min=T[s.minFilter],m.wrapS=_[s.wrapS],m.wrapT=_[s.wrapT],f=0;f<6;++f)H(c[f]);return m}return m(e,t,n,i,o,s),m.subimage=function(e,t,r,n,a){w(!!t,"must specify image data"),w("number"==typeof e&&e===(0|e)&&e>=0&&e<6,"invalid face");var i=0|r,o=0|n,f=0|a,u=j();return k(u,l),u.width=0,u.height=0,R(u,t),u.width=u.width||(l.width>>f)-i,u.height=u.height||(l.height>>f)-o,w(l.type===u.type&&l.format===u.format&&l.internalformat===u.internalformat,"incompatible format for texture.subimage"),w(i>=0&&o>=0&&i+u.width<=l.width&&o+u.height<=l.height,"texture.subimage write out of bounds"),w(l.mipmask&1<<f,"missing mipmap data"),w(u.data||u.element||u.needsCopy,"missing image data"),eA(l),F(u,34069+e,i,o,f),eT(),P(u),m},m.resize=function(e){var t=0|e;if(t!==l.width){m.width=l.width=t,m.height=l.height=t,eA(l);for(var n=0;n<6;++n)for(var a=0;l.mipmask>>a;++a)r.texImage2D(34069+n,a,l.format,t>>a,t>>a,0,l.format,l.type,null);return eT(),u.profile&&(l.stats.size=ew(l.internalformat,l.type,m.width,m.height,!1,!0)),m}},m._reglType="textureCube",m._texture=l,u.profile&&(m.stats=l.stats),m.destroy=function(){l.decRef()},m},clear:function(){for(var e=0;e<ec;++e)r.activeTexture(33984+e),r.bindTexture(3553,null),em[e]=null;L(ea).forEach(e_),f.cubeCount=0,f.textureCount=0},getTexture:function(e){return null},restore:function(){for(var e=0;e<ec;++e){var t=em[e];t&&(t.bindCount=0,t.unit=-1,em[e]=null)}L(ea).forEach(function(e){e.texture=r.createTexture(),r.bindTexture(e.target,e.texture);for(var t=0;t<32;++t)if((e.mipmask&1<<t)!=0)if(3553===e.target)r.texImage2D(3553,t,e.internalformat,e.width>>t,e.height>>t,0,e.internalformat,e.type,null);else for(var n=0;n<6;++n)r.texImage2D(34069+n,t,e.internalformat,e.width>>t,e.height>>t,0,e.internalformat,e.type,null);Y(e.texInfo,e.target)})},refresh:function(){for(var e=0;e<ec;++e){var t=em[e];t&&(t.bindCount=0,t.unit=-1,em[e]=null),r.activeTexture(33984+e),r.bindTexture(3553,null),r.bindTexture(34067,null)}}}}(o,m,y,function(){Y.procs.poll()},b,c,i),G=eT(o,m,y,c,i),V=function(e,r,n,a,i,o){var f={cur:null,next:null,dirty:!1,setFBO:null},u=["rgba"],s=["rgba4","rgb565","rgb5 a1"];r.ext_srgb&&s.push("srgba"),r.ext_color_buffer_half_float&&s.push("rgba16f","rgb16f"),r.webgl_color_buffer_float&&s.push("rgba32f");var l=["uint8"];function c(e,t,r){this.target=e,this.texture=t,this.renderbuffer=r;var n=0,a=0;t?(n=t.width,a=t.height):r&&(n=r.width,a=r.height),this.width=n,this.height=a}function m(e){e&&(e.texture&&e.texture._texture.decRef(),e.renderbuffer&&e.renderbuffer._renderbuffer.decRef())}function d(e,t,r){if(e)if(e.texture){var n=e.texture._texture,a=Math.max(1,n.width),i=Math.max(1,n.height);w(a===t&&i===r,"inconsistent width/height for supplied texture"),n.refCount+=1}else{var o=e.renderbuffer._renderbuffer;w(o.width===t&&o.height===r,"inconsistent width/height for renderbuffer"),o.refCount+=1}}function p(t,r){r&&(r.texture?e.framebufferTexture2D(36160,t,r.target,r.texture._texture.texture,0):e.framebufferRenderbuffer(36160,t,36161,r.renderbuffer._renderbuffer.renderbuffer))}function v(e){var t=3553,r=null,n=null,a=e;"object"==typeof e&&(a=e.data,"target"in e&&(t=0|e.target)),w.type(a,"function","invalid attachment data");var i=a._reglType;return"texture2d"===i?(r=a,w(3553===t)):"textureCube"===i?(r=a,w(t>=34069&&t<34075,"invalid cube map target")):"renderbuffer"===i?(n=a,t=36161):w.raise("invalid regl object for attachment"),new c(t,r,n)}function h(e,t,r,n,o){if(r){var f=a.create2D({width:e,height:t,format:n,type:o});return f._texture.refCount=0,new c(3553,f,null)}var u=i.create({width:e,height:t,format:n});return u._renderbuffer.refCount=0,new c(36161,null,u)}function b(e){return e&&(e.texture||e.renderbuffer)}function g(e,t,r){e&&(e.texture?e.texture.resize(t,r):e.renderbuffer&&e.renderbuffer.resize(t,r),e.width=t,e.height=r)}r.oes_texture_half_float&&l.push("half float","float16"),r.oes_texture_float&&l.push("float","float32");var y=0,x={};function A(){this.id=y++,x[this.id]=this,this.framebuffer=e.createFramebuffer(),this.width=0,this.height=0,this.colorAttachments=[],this.depthAttachment=null,this.stencilAttachment=null,this.depthStencilAttachment=null}function T(e){e.colorAttachments.forEach(m),m(e.depthAttachment),m(e.stencilAttachment),m(e.depthStencilAttachment)}function _(t){var r=t.framebuffer;w(r,"must not double destroy framebuffer"),e.deleteFramebuffer(r),t.framebuffer=null,o.framebufferCount--,delete x[t.id]}function S(t){e.bindFramebuffer(36160,t.framebuffer);var r,a=t.colorAttachments;for(r=0;r<a.length;++r)p(36064+r,a[r]);for(r=a.length;r<n.maxColorAttachments;++r)e.framebufferTexture2D(36160,36064+r,3553,null,0);e.framebufferTexture2D(36160,33306,3553,null,0),e.framebufferTexture2D(36160,36096,3553,null,0),e.framebufferTexture2D(36160,36128,3553,null,0),p(36096,t.depthAttachment),p(36128,t.stencilAttachment),p(33306,t.depthStencilAttachment);var i=e.checkFramebufferStatus(36160);e.isContextLost()||36053===i||w.raise("framebuffer configuration not supported, status = "+eO[i]),e.bindFramebuffer(36160,f.next?f.next.framebuffer:null),f.cur=f.next,e.getError()}function E(e,a){var i=new A;function c(e,t){w(f.next!==i,"can not update framebuffer which is currently in use");var a,o=0,m=0,p=!0,g=!0,y=null,x=!0,A="rgba",_="uint8",E=1,k=null,O=null,C=null,D=!1;if("number"==typeof e)o=0|e,m=0|t||o;else if(e){if(w.type(e,"object","invalid arguments for framebuffer"),"shape"in e){var R=e.shape;w(Array.isArray(R)&&R.length>=2,"invalid shape for framebuffer"),o=R[0],m=R[1]}else"radius"in e&&(o=m=e.radius),"width"in e&&(o=e.width),"height"in e&&(m=e.height);("color"in e||"colors"in e)&&Array.isArray(y=e.color||e.colors)&&w(1===y.length||r.webgl_draw_buffers,"multiple render targets not supported"),!y&&("colorCount"in e&&w((E=0|e.colorCount)>0,"invalid color buffer count"),"colorTexture"in e&&(x=!!e.colorTexture,A="rgba4"),"colorType"in e&&(_=e.colorType,x?(w(r.oes_texture_float||"float"!==_&&"float32"!==_,"you must enable OES_texture_float in order to use floating point framebuffer objects"),w(r.oes_texture_half_float||"half float"!==_&&"float16"!==_,"you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects")):"half float"===_||"float16"===_?(w(r.ext_color_buffer_half_float,"you must enable EXT_color_buffer_half_float to use 16-bit render buffers"),A="rgba16f"):("float"===_||"float32"===_)&&(w(r.webgl_color_buffer_float,"you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"),A="rgba32f"),w.oneOf(_,l,"invalid color type")),"colorFormat"in e&&(A=e.colorFormat,u.indexOf(A)>=0?x=!0:s.indexOf(A)>=0?x=!1:w.optional(function(){x?w.oneOf(e.colorFormat,u,"invalid color format for texture"):w.oneOf(e.colorFormat,s,"invalid color format for renderbuffer")}))),("depthTexture"in e||"depthStencilTexture"in e)&&w(!(D=!!(e.depthTexture||e.depthStencilTexture))||r.webgl_depth_texture,"webgl_depth_texture extension not supported"),"depth"in e&&("boolean"==typeof e.depth?p=e.depth:(k=e.depth,g=!1)),"stencil"in e&&("boolean"==typeof e.stencil?g=e.stencil:(O=e.stencil,p=!1)),"depthStencil"in e&&("boolean"==typeof e.depthStencil?p=g=e.depthStencil:(C=e.depthStencil,p=!1,g=!1))}else o=m=1;var F=null,z=null,j=null,U=null;if(Array.isArray(y))F=y.map(v);else if(y)F=[v(y)];else for(a=0,F=Array(E);a<E;++a)F[a]=h(o,m,x,A,_);w(r.webgl_draw_buffers||F.length<=1,"you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."),w(F.length<=n.maxColorAttachments,"too many color attachments, not supported"),o=o||F[0].width,m=m||F[0].height,k?z=v(k):p&&!g&&(z=h(o,m,D,"depth","uint32")),O?j=v(O):g&&!p&&(j=h(o,m,!1,"stencil","uint8")),C?U=v(C):!k&&!O&&g&&p&&(U=h(o,m,D,"depth stencil","depth stencil")),w(!!k+!!O+!!C<=1,"invalid framebuffer configuration, can specify exactly one depth/stencil attachment");var P=null;for(a=0;a<F.length;++a)if(d(F[a],o,m),w(!F[a]||F[a].texture&&e_.indexOf(F[a].texture._texture.format)>=0||F[a].renderbuffer&&ek.indexOf(F[a].renderbuffer._renderbuffer.format)>=0,"framebuffer color attachment "+a+" is invalid"),F[a]&&F[a].texture){var B=eS[F[a].texture._texture.format]*eE[F[a].texture._texture.type];null===P?P=B:w(P===B,"all color attachments much have the same number of bits per pixel.")}return d(z,o,m),w(!z||z.texture&&6402===z.texture._texture.format||z.renderbuffer&&33189===z.renderbuffer._renderbuffer.format,"invalid depth attachment for framebuffer object"),d(j,o,m),w(!j||j.renderbuffer&&36168===j.renderbuffer._renderbuffer.format,"invalid stencil attachment for framebuffer object"),d(U,o,m),w(!U||U.texture&&34041===U.texture._texture.format||U.renderbuffer&&34041===U.renderbuffer._renderbuffer.format,"invalid depth-stencil attachment for framebuffer object"),T(i),i.width=o,i.height=m,i.colorAttachments=F,i.depthAttachment=z,i.stencilAttachment=j,i.depthStencilAttachment=U,c.color=F.map(b),c.depth=b(z),c.stencil=b(j),c.depthStencil=b(U),c.width=i.width,c.height=i.height,S(i),c}return o.framebufferCount++,c(e,a),t(c,{resize:function(e,t){w(f.next!==i,"can not resize a framebuffer which is currently in use");var r=Math.max(0|e,1),n=Math.max(0|t||r,1);if(r===i.width&&n===i.height)return c;for(var a=i.colorAttachments,o=0;o<a.length;++o)g(a[o],r,n);return g(i.depthAttachment,r,n),g(i.stencilAttachment,r,n),g(i.depthStencilAttachment,r,n),i.width=c.width=r,i.height=c.height=n,S(i),c},_reglType:"framebuffer",_framebuffer:i,destroy:function(){_(i),T(i)},use:function(e){f.setFBO({framebuffer:c},e)}})}return t(f,{getFramebuffer:function(e){if("function"==typeof e&&"framebuffer"===e._reglType){var t=e._framebuffer;if(t instanceof A)return t}return null},create:E,createCube:function(e){var i=Array(6);function o(e){w(0>i.indexOf(f.next),"can not update framebuffer which is currently in use");var n,s,c={color:null},m=0,d=null,p="rgba",v="uint8",h=1;if("number"==typeof e)m=0|e;else if(e){if(w.type(e,"object","invalid arguments for framebuffer"),"shape"in e){var b=e.shape;w(Array.isArray(b)&&b.length>=2,"invalid shape for framebuffer"),w(b[0]===b[1],"cube framebuffer must be square"),m=b[0]}else"radius"in e&&(m=0|e.radius),"width"in e?(m=0|e.width,"height"in e&&w(e.height===m,"must be square")):"height"in e&&(m=0|e.height);("color"in e||"colors"in e)&&Array.isArray(d=e.color||e.colors)&&w(1===d.length||r.webgl_draw_buffers,"multiple render targets not supported"),!d&&("colorCount"in e&&w((h=0|e.colorCount)>0,"invalid color buffer count"),"colorType"in e&&(w.oneOf(e.colorType,l,"invalid color type"),v=e.colorType),"colorFormat"in e&&(p=e.colorFormat,w.oneOf(e.colorFormat,u,"invalid color format for texture"))),"depth"in e&&(c.depth=e.depth),"stencil"in e&&(c.stencil=e.stencil),"depthStencil"in e&&(c.depthStencil=e.depthStencil)}else m=1;if(d)if(Array.isArray(d))for(n=0,s=[];n<d.length;++n)s[n]=d[n];else s=[d];else{s=Array(h);var g={radius:m,format:p,type:v};for(n=0;n<h;++n)s[n]=a.createCube(g)}for(n=0,c.color=Array(s.length);n<s.length;++n){var y=s[n];w("function"==typeof y&&"textureCube"===y._reglType,"invalid cube map"),m=m||y.width,w(y.width===m&&y.height===m,"invalid cube map shape"),c.color[n]={target:34069,data:s[n]}}for(n=0;n<6;++n){for(var x=0;x<s.length;++x)c.color[x].target=34069+n;n>0&&(c.depth=i[0].depth,c.stencil=i[0].stencil,c.depthStencil=i[0].depthStencil),i[n]?i[n](c):i[n]=E(c)}return t(o,{width:m,height:m,color:s})}return o(e),t(o,{faces:i,resize:function(e){var t,r=0|e;if(w(r>0&&r<=n.maxCubeMapSize,"invalid radius for cube fbo"),r===o.width)return o;var a=o.color;for(t=0;t<a.length;++t)a[t].resize(r);for(t=0;t<6;++t)i[t].resize(r);return o.width=o.height=r,o},_reglType:"framebufferCube",destroy:function(){i.forEach(function(e){e.destroy()})}})},clear:function(){L(x).forEach(_)},restore:function(){f.cur=null,f.next=null,f.dirty=!0,L(x).forEach(function(t){t.framebuffer=e.createFramebuffer(),S(t)})}})}(o,m,y,j,G,c),Y=function(e,r,n,a,i,o,f,u,s,l,c,m,d,p,v){var h=l.Record,b={add:32774,subtract:32778,"reverse subtract":32779};n.ext_blend_minmax&&(b.min=32775,b.max=32776);var g=n.angle_instanced_arrays,y=n.webgl_draw_buffers,x=n.oes_vertex_array_object,A={dirty:!0,profile:v.profile},_={},S=[],O={},C={};function D(e){return e.replace(".","_")}function R(e,t,r){var n=D(e);S.push(e),_[n]=A[n]=!!r,O[n]=t}function z(e,t,r){var n=D(e);S.push(e),Array.isArray(r)?(A[n]=r.slice(),_[n]=r.slice()):A[n]=_[n]=r,C[n]=t}R(ej,3024),R(eU,3042),z(eP,"blendColor",[0,0,0,0]),z(eB,"blendEquationSeparate",[32774,32774]),z(eL,"blendFuncSeparate",[1,0,1,0]),R(eI,2929,!0),z(eM,"depthFunc",513),z(eG,"depthRange",[0,1]),z(eV,"depthMask",!0),z(eq,eq,[!0,!0,!0,!0]),R(eW,2884),z(eX,"cullFace",1029),z(eN,eN,2305),z(eH,eH,1),R(e$,32823),z(eQ,"polygonOffset",[0,0]),R(eY,32926),R(eK,32928),z(eJ,"sampleCoverage",[1,!1]),R(eZ,2960),z(e0,"stencilMask",-1),z(e1,"stencilFunc",[519,0,-1]),z(e3,"stencilOpSeparate",[1028,7680,7680,7680]),z(e2,"stencilOpSeparate",[1029,7680,7680,7680]),R(e5,3089),z(e4,"scissor",[0,0,e.drawingBufferWidth,e.drawingBufferHeight]),z(e6,e6,[0,0,e.drawingBufferWidth,e.drawingBufferHeight]);var j={gl:e,context:d,strings:r,next:_,current:A,draw:m,elements:o,buffer:i,shader:c,attributes:l.state,vao:l,uniforms:s,framebuffer:u,extensions:n,timer:p,isBufferArgs:tA},U={primTypes:Q,compareFuncs:tg,blendFuncs:th,blendEquations:b,stencilOps:ty,glTypes:q,orientationType:tw};w.optional(function(){j.isArrayLike=Z}),y&&(U.backBuffer=[1029],U.drawBuffer=F(a.maxDrawbuffers,function(e){return 0===e?[0]:F(e,function(e){return 36064+e})}));var P=0;function B(){var e=function(){var e=0,r=[],n=[];function a(){var r=[],n=[];return t(function(){r.push.apply(r,eR(arguments))},{def:function(){var t="v"+e++;return n.push(t),arguments.length>0&&(r.push(t,"="),r.push.apply(r,eR(arguments)),r.push(";")),t},toString:function(){return eF([n.length>0?"var "+n.join(",")+";":"",eF(r)])}})}function i(){var e=a(),r=a(),n=e.toString,i=r.toString;function o(t,n){r(t,n,"=",e.def(t,n),";")}return t(function(){e.apply(e,eR(arguments))},{def:e.def,entry:e,exit:r,save:o,set:function(t,r,n){o(t,r),e(t,r,"=",n,";")},toString:function(){return n()+i()}})}var o=a(),f={};return{global:o,link:function(t){for(var a=0;a<n.length;++a)if(n[a]===t)return r[a];var i="g"+e++;return r.push(i),n.push(t),i},block:a,proc:function(e,r){var n=[];function a(){var e="a"+n.length;return n.push(e),e}r=r||0;for(var o=0;o<r;++o)a();var u=i(),s=u.toString;return f[e]=t(u,{arg:a,toString:function(){return eF(["function(",n.join(),"){",s(),"}"])}})},scope:i,cond:function(){var e=eF(arguments),r=i(),n=i(),a=r.toString,o=n.toString;return t(r,{then:function(){return r.apply(r,eR(arguments)),this},else:function(){return n.apply(n,eR(arguments)),this},toString:function(){var t=o();return t&&(t="else{"+t+"}"),eF(["if(",e,"){",a(),"}",t])}})},compile:function(){var e=['"use strict";',o,"return {"];Object.keys(f).forEach(function(t){e.push('"',t,'":',f[t].toString(),",")}),e.push("}");var t=eF(e).replace(/;/g,";\n").replace(/}/g,"}\n").replace(/{/g,"{\n");return Function.apply(null,r.concat(t)).apply(null,n)}}}(),n=e.link,a=e.global;e.id=P++,e.batchId="0";var i=n(j),o=e.shared={props:"a0"};Object.keys(j).forEach(function(e){o[e]=a.def(i,".",e)}),w.optional(function(){e.CHECK=n(w),e.commandStr=w.guessCommand(),e.command=n(e.commandStr),e.assert=function(e,t,r){e("if(!(",t,"))",this.CHECK,".commandRaise(",n(r),",",this.command,");")},U.invalidBlendCombinations=tb});var f=e.next={},u=e.current={};Object.keys(C).forEach(function(e){Array.isArray(A[e])&&(f[e]=a.def(o.next,".",e),u[e]=a.def(o.current,".",e))});var s=e.constants={};Object.keys(U).forEach(function(e){s[e]=a.def(JSON.stringify(U[e]))}),e.invoke=function(t,r){switch(r.type){case 0:var a=["this",o.context,o.props,e.batchId];return t.def(n(r.data),".call(",a.slice(0,Math.max(r.data.length+1,4)),")");case 1:return t.def(o.props,r.data);case 2:return t.def(o.context,r.data);case 3:return t.def("this",r.data);case 4:return r.data.append(e,t),r.data.ref;case 5:return r.data.toString();case 6:return r.data.map(function(r){return e.invoke(t,r)})}},e.attribCache={};var c={};return e.scopeAttrib=function(e){var t=r.id(e);if(t in c)return c[t];var a=l.scope[t];return a||(a=l.scope[t]=new h),c[t]=n(a)},e}function L(e,t,r){var n=e.shared.context,a=e.scope();Object.keys(r).forEach(function(i){t.save(n,"."+i);var o=r[i].append(e,t);Array.isArray(o)?a(n,".",i,"=[",o.join(),"];"):a(n,".",i,"=",o,";")}),t(a)}function I(e,t,r,n){var a,i,o=e.shared,f=o.gl,u=o.framebuffer;y&&(a=t.def(o.extensions,".webgl_draw_buffers"));var s=e.constants,l=s.drawBuffer,c=s.backBuffer;i=r?r.append(e,t):t.def(u,".next"),n||t("if(",i,"!==",u,".cur){"),t("if(",i,"){",f,".bindFramebuffer(",36160,",",i,".framebuffer);"),y&&t(a,".drawBuffersWEBGL(",l,"[",i,".colorAttachments.length]);"),t("}else{",f,".bindFramebuffer(",36160,",null);"),y&&t(a,".drawBuffersWEBGL(",c,");"),t("}",u,".cur=",i,";"),n||t("}")}function M(e,t,r){var n=e.shared,a=n.gl,i=e.current,o=e.next,f=n.current,u=n.next,s=e.cond(f,".dirty");S.forEach(function(t){var n,l,c=D(t);if(!(c in r.state))if(c in o){n=o[c],l=i[c];var m=F(A[c].length,function(e){return s.def(n,"[",e,"]")});s(e.cond(m.map(function(e,t){return e+"!=="+l+"["+t+"]"}).join("||")).then(a,".",C[c],"(",m,");",m.map(function(e,t){return l+"["+t+"]="+e}).join(";"),";"))}else{n=s.def(u,".",c);var d=e.cond(n,"!==",f,".",c);s(d),c in O?d(e.cond(n).then(a,".enable(",O[c],");").else(a,".disable(",O[c],");"),f,".",c,"=",n,";"):d(a,".",C[c],"(",n,");",f,".",c,"=",n,";")}}),0===Object.keys(r.state).length&&s(f,".dirty=false;"),t(s)}function G(e,t,r,n){var a=e.shared,i=e.current,o=a.current,f=a.gl;tT(Object.keys(r)).forEach(function(a){var u=r[a];if(!n||n(u)){var s=u.append(e,t);if(O[a]){var l=O[a];tS(u)?s?t(f,".enable(",l,");"):t(f,".disable(",l,");"):t(e.cond(s).then(f,".enable(",l,");").else(f,".disable(",l,");")),t(o,".",a,"=",s,";")}else if(Z(s)){var c=i[a];t(f,".",C[a],"(",s,");",s.map(function(e,t){return c+"["+t+"]="+e}).join(";"),";")}else t(f,".",C[a],"(",s,");",o,".",a,"=",s,";")}})}function V(e,t){g&&(e.instancing=t.def(e.shared.extensions,".angle_instanced_arrays"))}function W(e,t,r,n,a){var i,o,f,u=e.shared,s=e.stats,l=u.current,c=u.timer,m=r.profile;function d(){return"u"<typeof performance?"Date.now()":"performance.now()"}function v(e){e(i=t.def(),"=",d(),";"),"string"==typeof a?e(s,".count+=",a,";"):e(s,".count++;"),p&&(n?e(o=t.def(),"=",c,".getNumPendingQueries();"):e(c,".beginQuery(",s,");"))}function h(e){e(s,".cpuTime+=",d(),"-",i,";"),p&&(n?e(c,".pushScopeStats(",o,",",c,".getNumPendingQueries(),",s,");"):e(c,".endQuery();"))}function b(e){var r=t.def(l,".profile");t(l,".profile=",e,";"),t.exit(l,".profile=",r,";")}if(m){if(tS(m))return void(m.enable?(v(t),h(t.exit),b("true")):b("false"));b(f=m.append(e,t))}else f=t.def(l,".profile");var g=e.block();v(g),t("if(",f,"){",g,"}");var y=e.block();h(y),t.exit("if(",f,"){",y,"}")}function X(e,t,r,n,a){var i=e.shared;n.forEach(function(n){var o,f=n.name,u=r.attributes[f];if(u){if(!a(u))return;o=u.append(e,t)}else{if(!a(tO))return;var s=e.scopeAttrib(f);w.optional(function(){e.assert(t,s+".state","missing attribute "+f)}),o={},Object.keys(new h).forEach(function(e){o[e]=t.def(s,".",e)})}!function(r,n,a){var o=i.gl,f=t.def(r,".location"),u=t.def(i.attributes,"[",f,"]"),s=a.state,l=a.buffer,c=[a.x,a.y,a.z,a.w],m=["buffer","normalized","offset","stride"];function d(){t("if(!",u,".buffer){",o,".enableVertexAttribArray(",f,");}");var r,i=a.type;if(r=a.size?t.def(a.size,"||",n):n,t("if(",u,".type!==",i,"||",u,".size!==",r,"||",m.map(function(e){return u+"."+e+"!=="+a[e]}).join("||"),"){",o,".bindBuffer(",34962,",",l,".buffer);",o,".vertexAttribPointer(",[f,r,i,a.normalized,a.stride,a.offset],");",u,".type=",i,";",u,".size=",r,";",m.map(function(e){return u+"."+e+"="+a[e]+";"}).join(""),"}"),g){var s=a.divisor;t("if(",u,".divisor!==",s,"){",e.instancing,".vertexAttribDivisorANGLE(",[f,s],");",u,".divisor=",s,";}")}}function p(){t("if(",u,".buffer){",o,".disableVertexAttribArray(",f,");",u,".buffer=null;","}if(",ez.map(function(e,t){return u+"."+e+"!=="+c[t]}).join("||"),"){",o,".vertexAttrib4f(",f,",",c,");",ez.map(function(e,t){return u+"."+e+"="+c[t]+";"}).join(""),"}")}1===s?d():2===s?p():(t("if(",s,"===",1,"){"),d(),t("}else{"),p(),t("}"))}(e.link(n),function(e){switch(e){case 35664:case 35667:case 35671:return 2;case 35665:case 35668:case 35672:return 3;case 35666:case 35669:case 35673:return 4;default:return 1}}(n.info.type),o)})}function N(e,t,n,a,i,o){for(var f=e.shared,u=f.gl,s=0;s<a.length;++s){var l,c,m=a[s],d=m.name,p=m.info.type,v=n.uniforms[d],h=e.link(m)+".location";if(v){if(!i(v))continue;if(tS(v)){var b=v.value;if(w.command(null!=b,'missing uniform "'+d+'"',e.commandStr),35678===p||35680===p){w.command("function"==typeof b&&(35678===p&&("texture2d"===b._reglType||"framebuffer"===b._reglType)||35680===p&&("textureCube"===b._reglType||"framebufferCube"===b._reglType)),"invalid texture for uniform "+d,e.commandStr);var g=e.link(b._texture||b.color[0]._texture);t(u,".uniform1i(",h,",",g+".bind());"),t.exit(g,".unbind();")}else if(35674===p||35675===p||35676===p){w.optional(function(){w.command(Z(b),"invalid matrix for uniform "+d,e.commandStr),w.command(35674===p&&4===b.length||35675===p&&9===b.length||35676===p&&16===b.length,"invalid length for matrix uniform "+d,e.commandStr)});var y=e.global.def("new Float32Array(["+Array.prototype.slice.call(b)+"])"),x=2;35675===p?x=3:35676===p&&(x=4),t(u,".uniformMatrix",x,"fv(",h,",false,",y,");")}else{switch(p){case 5126:w.commandType(b,"number","uniform "+d,e.commandStr),l="1f";break;case 35664:w.command(Z(b)&&2===b.length,"uniform "+d,e.commandStr),l="2f";break;case 35665:w.command(Z(b)&&3===b.length,"uniform "+d,e.commandStr),l="3f";break;case 35666:w.command(Z(b)&&4===b.length,"uniform "+d,e.commandStr),l="4f";break;case 35670:w.commandType(b,"boolean","uniform "+d,e.commandStr),l="1i";break;case 5124:w.commandType(b,"number","uniform "+d,e.commandStr),l="1i";break;case 35671:case 35667:w.command(Z(b)&&2===b.length,"uniform "+d,e.commandStr),l="2i";break;case 35672:case 35668:w.command(Z(b)&&3===b.length,"uniform "+d,e.commandStr),l="3i";break;case 35673:case 35669:w.command(Z(b)&&4===b.length,"uniform "+d,e.commandStr),l="4i"}t(u,".uniform",l,"(",h,",",Z(b)?Array.prototype.slice.call(b):b,");")}continue}c=v.append(e,t)}else{if(!i(tO))continue;c=t.def(f.uniforms,"[",r.id(d),"]")}35678===p?(w(!Array.isArray(c),"must specify a scalar prop for textures"),t("if(",c,"&&",c,'._reglType==="framebuffer"){',c,"=",c,".color[0];","}")):35680===p&&(w(!Array.isArray(c),"must specify a scalar prop for cube maps"),t("if(",c,"&&",c,'._reglType==="framebufferCube"){',c,"=",c,".color[0];","}")),w.optional(function(){function r(r,n){e.assert(t,r,'bad data or missing for uniform "'+d+'".  '+n)}function n(e){w(!Array.isArray(c),"must not specify an array type for uniform"),r("typeof "+c+'==="'+e+'"',"invalid type, expected "+e)}function a(t,n){Array.isArray(c)?w(c.length===t,"must have length "+t):r(f.isArrayLike+"("+c+")&&"+c+".length==="+t,"invalid vector, should have length "+t,e.commandStr)}function i(t){w(!Array.isArray(c),"must not specify a value type"),r("typeof "+c+'==="function"&&'+c+'._reglType==="texture'+(3553===t?"2d":"Cube")+'"',"invalid texture type",e.commandStr)}switch(p){case 5124:case 5126:n("number");break;case 35667:case 35664:a(2,"number");break;case 35668:case 35665:a(3,"number");break;case 35669:case 35666:case 35674:a(4,"number");break;case 35670:n("boolean");break;case 35671:a(2,"boolean");break;case 35672:a(3,"boolean");break;case 35673:a(4,"boolean");break;case 35675:a(9,"number");break;case 35676:a(16,"number");break;case 35678:i(3553);break;case 35680:i(34067)}});var A=1;switch(p){case 35678:case 35680:var T=t.def(c,"._texture");t(u,".uniform1i(",h,",",T,".bind());"),t.exit(T,".unbind();");continue;case 5124:case 35670:l="1i";break;case 35667:case 35671:l="2i",A=2;break;case 35668:case 35672:l="3i",A=3;break;case 35669:case 35673:l="4i",A=4;break;case 5126:l="1f";break;case 35664:l="2f",A=2;break;case 35665:l="3f",A=3;break;case 35666:l="4f",A=4;break;case 35674:l="Matrix2fv";break;case 35675:l="Matrix3fv";break;case 35676:l="Matrix4fv"}if("M"===l.charAt(0)){t(u,".uniform",l,"(",h,",");var _=Math.pow(p-35674+2,2),S=e.global.def("new Float32Array(",_,")");Array.isArray(c)?t("false,(",F(_,function(e){return S+"["+e+"]="+c[e]}),",",S,")"):t("false,(Array.isArray(",c,")||",c," instanceof Float32Array)?",c,":(",F(_,function(e){return S+"["+e+"]="+c+"["+e+"]"}),",",S,")"),t(");")}else if(A>1){for(var E=[],k=[],O=0;O<A;++O)Array.isArray(c)?k.push(c[O]):k.push(t.def(c+"["+O+"]")),o&&E.push(t.def());o&&t("if(!",e.batchId,"||",E.map(function(e,t){return e+"!=="+k[t]}).join("||"),"){",E.map(function(e,t){return e+"="+k[t]+";"}).join("")),t(u,".uniform",l,"(",h,",",k.join(","),");"),o&&t("}")}else{if(w(!Array.isArray(c),"uniform value must not be an array"),o){var C=t.def();t("if(!",e.batchId,"||",C,"!==",c,"){",C,"=",c,";")}t(u,".uniform",l,"(",h,",",c,");"),o&&t("}")}}}function H(e,t,r,n){var a,i,o,f,u,s,l,c,m=e.shared,d=m.gl,p=m.draw,v=n.draw,h=(i=v.elements,o=t,i?((i.contextDep&&n.contextDynamic||i.propDep)&&(o=r),a=i.append(e,o),v.elementsActive&&o("if("+a+")"+d+".bindBuffer(34963,"+a+".buffer.buffer);")):(a=o.def(),o(a,"=",p,".",tt,";","if(",a,"){",d,".bindBuffer(",34963,",",a,".buffer.buffer);}","else if(",m.vao,".currentVAO){",a,"=",e.shared.elements+".getElements("+m.vao,".currentVAO.elements);",x?"":"if("+a+")"+d+".bindBuffer(34963,"+a+".buffer.buffer);","}")),a);function b(a){var i=v[a];return i?i.contextDep&&n.contextDynamic||i.propDep?i.append(e,r):i.append(e,t):t.def(p,".",a)}var y=b(tr),A=b(ta),T=(u=v.count,s=t,u?((u.contextDep&&n.contextDynamic||u.propDep)&&(s=r),f=u.append(e,s),w.optional(function(){u.MISSING&&e.assert(t,"false","missing vertex count"),u.DYNAMIC&&e.assert(s,f+">=0","missing vertex count")})):(f=s.def(p,".",tn),w.optional(function(){e.assert(s,f+">=0","missing vertex count")})),f);if("number"==typeof T){if(0===T)return}else r("if(",T,"){"),r.exit("}");g&&(l=b(ti),c=e.instancing);var _=h+".type",S=v.elements&&tS(v.elements)&&!v.vaoActive;function E(){function e(){r(c,".drawElementsInstancedANGLE(",[y,T,_,A+"<<(("+_+"-5121)>>1)",l],");")}function t(){r(c,".drawArraysInstancedANGLE(",[y,A,T,l],");")}h&&"null"!==h?S?e():(r("if(",h,"){"),e(),r("}else{"),t(),r("}")):t()}function k(){function e(){r(d+".drawElements("+[y,T,_,A+"<<(("+_+"-5121)>>1)"]+");")}function t(){r(d+".drawArrays("+[y,A,T]+");")}h&&"null"!==h?S?e():(r("if(",h,"){"),e(),r("}else{"),t(),r("}")):t()}g&&("number"!=typeof l||l>=0)?"string"==typeof l?(r("if(",l,">0){"),E(),r("}else if(",l,"<0){"),k(),r("}")):E():k()}function $(e,t,r,n,a){var i=B(),o=i.proc("body",a);return w.optional(function(){i.commandStr=t.commandStr,i.command=i.link(t.commandStr)}),g&&(i.instancing=o.def(i.shared.extensions,".angle_instanced_arrays")),e(i,o,r,n),i.compile().body}function Y(e,t,r,n){V(e,t),r.useVAO?r.drawVAO?t(e.shared.vao,".setVAO(",r.drawVAO.append(e,t),");"):t(e.shared.vao,".setVAO(",e.shared.vao,".targetVAO);"):(t(e.shared.vao,".setVAO(null);"),X(e,t,r,n.attributes,function(){return!0})),N(e,t,r,n.uniforms,function(){return!0},!1),H(e,t,t,r)}function K(e,t,r,n){function a(){return!0}e.batchId="a1",V(e,t),X(e,t,r,n.attributes,a),N(e,t,r,n.uniforms,a,!1),H(e,t,t,r)}function J(e,t,r,n){V(e,t);var a=r.contextDep,i=t.def(),o=t.def();e.shared.props=o,e.batchId=i;var f=e.scope(),u=e.scope();function s(e){return e.contextDep&&a||e.propDep}function l(e){return!s(e)}if(t(f.entry,"for(",i,"=0;",i,"<","a1",";++",i,"){",o,"=","a0","[",i,"];",u,"}",f.exit),r.needsContext&&L(e,u,r.context),r.needsFramebuffer&&I(e,u,r.framebuffer),G(e,u,r.state,s),r.profile&&s(r.profile)&&W(e,u,r,!1,!0),n)r.useVAO?r.drawVAO?s(r.drawVAO)?u(e.shared.vao,".setVAO(",r.drawVAO.append(e,u),");"):f(e.shared.vao,".setVAO(",r.drawVAO.append(e,f),");"):f(e.shared.vao,".setVAO(",e.shared.vao,".targetVAO);"):(f(e.shared.vao,".setVAO(null);"),X(e,f,r,n.attributes,l),X(e,u,r,n.attributes,s)),N(e,f,r,n.uniforms,l,!1),N(e,u,r,n.uniforms,s,!0),H(e,f,u,r);else{var c=e.global.def("{}"),m=r.shader.progVar.append(e,u),d=u.def(m,".id"),p=u.def(c,"[",d,"]");u(e.shared.gl,".useProgram(",m,".program);","if(!",p,"){",p,"=",c,"[",d,"]=",e.link(function(t){return $(K,e,r,t,2)}),"(",m,");}",p,".call(this,a0[",i,"],",i,");")}}function ee(e,t,r){var n=t.static[r];if(n&&function(e){if(!("object"!=typeof e||Z(e))){for(var t=Object.keys(e),r=0;r<t.length;++r)if(E(e[t[r]]))return!0;return!1}}(n)){var a=e.global,i=Object.keys(n),o=!1,f=!1,u=!1,s=e.global.def("{}");i.forEach(function(t){var r=n[t];if(E(r)){"function"==typeof r&&(r=n[t]=k(r));var i=tk(r,null);o=o||i.thisDep,u=u||i.propDep,f=f||i.contextDep}else{switch(a(s,".",t,"="),typeof r){case"number":a(r);break;case"string":a('"',r,'"');break;case"object":Array.isArray(r)&&a("[",r.join(),"]");break;default:a(e.link(r))}a(";")}}),t.dynamic[r]=new T(4,{thisDep:o,contextDep:f,propDep:u,ref:s,append:function(e,t){i.forEach(function(r){var a=n[r];if(E(a)){var i=e.invoke(t,a);t(s,".",r,"=",i,";")}})}}),delete t.static[r]}}return{next:_,current:A,procs:function(){var e,t=B(),r=t.proc("poll"),i=t.proc("refresh"),o=t.block();r(o),i(o);var f=t.shared,u=f.gl,s=f.next,l=f.current;o(l,".dirty=false;"),I(t,r),I(t,i,null,!0),g&&(e=t.link(g)),n.oes_vertex_array_object&&i(t.link(n.oes_vertex_array_object),".bindVertexArrayOES(null);");for(var c=0;c<a.maxAttributes;++c){var m=i.def(f.attributes,"[",c,"]"),d=t.cond(m,".buffer");d.then(u,".enableVertexAttribArray(",c,");",u,".bindBuffer(",34962,",",m,".buffer.buffer);",u,".vertexAttribPointer(",c,",",m,".size,",m,".type,",m,".normalized,",m,".stride,",m,".offset);").else(u,".disableVertexAttribArray(",c,");",u,".vertexAttrib4f(",c,",",m,".x,",m,".y,",m,".z,",m,".w);",m,".buffer=null;"),i(d),g&&i(e,".vertexAttribDivisorANGLE(",c,",",m,".divisor);")}return i(t.shared.vao,".currentVAO=null;",t.shared.vao,".setVAO(",t.shared.vao,".targetVAO);"),Object.keys(O).forEach(function(e){var n=O[e],a=o.def(s,".",e),f=t.block();f("if(",a,"){",u,".enable(",n,")}else{",u,".disable(",n,")}",l,".",e,"=",a,";"),i(f),r("if(",a,"!==",l,".",e,"){",f,"}")}),Object.keys(C).forEach(function(e){var n,a,f=C[e],c=A[e],m=t.block();if(m(u,".",f,"("),Z(c)){var d=c.length;n=t.global.def(s,".",e),a=t.global.def(l,".",e),m(F(d,function(e){return n+"["+e+"]"}),");",F(d,function(e){return a+"["+e+"]="+n+"["+e+"];"}).join("")),r("if(",F(d,function(e){return n+"["+e+"]!=="+a+"["+e+"]"}).join("||"),"){",m,"}")}else n=o.def(s,".",e),a=o.def(l,".",e),m(n,");",l,".",e,"=",n,";"),r("if(",n,"!==",a,"){",m,"}");i(m)}),t.compile()}(),compile:function(e,f,s,m,d){var p=B();p.stats=p.link(d),Object.keys(f.static).forEach(function(e){ee(p,f,e)}),tv.forEach(function(t){ee(p,e,t)});var v=function(e,t,f,s,m){var d,p,v,y,x,A,T,_,E,k,O,C,R=e.static,z=e.dynamic;w.optional(function(){var e=[e7,e9,te,tt,tr,ta,tn,ti,e8,"vao"].concat(S);function t(t){Object.keys(t).forEach(function(t){w.command(e.indexOf(t)>=0,'unknown parameter "'+t+'"',m.commandStr)})}t(R),t(z)});var j=function(e,t){var r=e.static;if("string"==typeof r[te]&&"string"==typeof r[e9]){if(Object.keys(t.dynamic).length>0)return null;var n=t.static,a=Object.keys(n);if(a.length>0&&"number"==typeof n[a[0]]){for(var i=[],o=0;o<a.length;++o)w("number"==typeof n[a[o]],"must specify all vertex attribute locations when using vaos"),i.push([0|n[a[o]],a[o]]);return i}}return null}(e,t),U=function(e,t){var r=e.static,n=e.dynamic;if(e7 in r){var a=r[e7];return a?(a=u.getFramebuffer(a),w.command(a,"invalid framebuffer object"),tE(function(e,t){var r=e.link(a),n=e.shared;t.set(n.framebuffer,".next",r);var i=n.context;return t.set(i,"."+tu,r+".width"),t.set(i,"."+ts,r+".height"),r})):tE(function(e,t){var r=e.shared;t.set(r.framebuffer,".next","null");var n=r.context;return t.set(n,"."+tu,n+"."+td),t.set(n,"."+ts,n+"."+tp),"null"})}if(!(e7 in n))return null;var i=n[e7];return tk(i,function(e,t){var r=e.invoke(t,i),n=e.shared,a=n.framebuffer,o=t.def(a,".getFramebuffer(",r,")");w.optional(function(){e.assert(t,"!"+r+"||"+o,"invalid framebuffer object")}),t.set(a,".next",o);var f=n.context;return t.set(f,"."+tu,o+"?"+o+".width:"+f+"."+td),t.set(f,"."+ts,o+"?"+o+".height:"+f+"."+tp),o})}(e,0),P=function(e,t,r){var n=e.static,a=e.dynamic;function i(e){if(e in n){var i,o,f=n[e];w.commandType(f,"object","invalid "+e,r.commandStr);var u=!0,s=0|f.x,l=0|f.y;return"width"in f?(i=0|f.width,w.command(i>=0,"invalid "+e,r.commandStr)):u=!1,"height"in f?(o=0|f.height,w.command(o>=0,"invalid "+e,r.commandStr)):u=!1,new t_(!u&&t&&t.thisDep,!u&&t&&t.contextDep,!u&&t&&t.propDep,function(e,t){var r=e.shared.context,n=i;"width"in f||(n=t.def(r,".",tu,"-",s));var a=o;return"height"in f||(a=t.def(r,".",ts,"-",l)),[s,l,n,a]})}if(e in a){var c=a[e],m=tk(c,function(t,r){var n=t.invoke(r,c);w.optional(function(){t.assert(r,n+"&&typeof "+n+'==="object"',"invalid "+e)});var a=t.shared.context,i=r.def(n,".x|0"),o=r.def(n,".y|0"),f=r.def('"width" in ',n,"?",n,".width|0:","(",a,".",tu,"-",i,")"),u=r.def('"height" in ',n,"?",n,".height|0:","(",a,".",ts,"-",o,")");return w.optional(function(){t.assert(r,f+">=0&&"+u+">=0","invalid "+e)}),[i,o,f,u]});return t&&(m.thisDep=m.thisDep||t.thisDep,m.contextDep=m.contextDep||t.contextDep,m.propDep=m.propDep||t.propDep),m}return t?new t_(t.thisDep,t.contextDep,t.propDep,function(e,t){var r=e.shared.context;return[0,0,t.def(r,".",tu),t.def(r,".",ts)]}):null}var o=i(e6);if(o){var f=o;o=new t_(o.thisDep,o.contextDep,o.propDep,function(e,t){var r=f.append(e,t),n=e.shared.context;return t.set(n,"."+tl,r[2]),t.set(n,"."+tc,r[3]),r})}return{viewport:o,scissor_box:i(e4)}}(e,U,m),B=function(e,t){var r=e.static,n=e.dynamic,a={},i=!1,f=function(){if("vao"in r){var e=r.vao;return null!==e&&null===l.getVAO(e)&&(e=l.createVAO(e)),i=!0,a.vao=e,tE(function(t){var r=l.getVAO(e);return r?t.link(r):"null"})}if("vao"in n){i=!0;var t=n.vao;return tk(t,function(e,r){var n=e.invoke(r,t);return r.def(e.shared.vao+".getVAO("+n+")")})}return null}(),u=!1,s=function(){if(tt in r){var e=r[tt];if(a.elements=e,tA(e)){var s=a.elements=o.create(e,!0);e=o.getElements(s),u=!0}else e&&(e=o.getElements(e),u=!0,w.command(e,"invalid elements",t.commandStr));var l=tE(function(t,r){if(e){var n=t.link(e);return t.ELEMENTS=n,n}return t.ELEMENTS=null,null});return l.value=e,l}if(tt in n){u=!0;var c=n[tt];return tk(c,function(e,t){var r=e.shared,n=r.isBufferArgs,a=r.elements,i=e.invoke(t,c),o=t.def("null"),f=t.def(n,"(",i,")"),u=e.cond(f).then(o,"=",a,".createStream(",i,");").else(o,"=",a,".getElements(",i,");");return w.optional(function(){e.assert(u.else,"!"+i+"||"+o,"invalid elements")}),t.entry(u),t.exit(e.cond(f).then(a,".destroyStream(",o,");")),e.ELEMENTS=o,o})}return i?new t_(f.thisDep,f.contextDep,f.propDep,function(e,t){return t.def(e.shared.vao+".currentVAO?"+e.shared.elements+".getElements("+e.shared.vao+".currentVAO.elements):null")}):null}();function c(e,o){if(e in r){var s=0|r[e];return o?a.offset=s:a.instances=s,w.command(!o||s>=0,"invalid "+e,t.commandStr),tE(function(e,t){return o&&(e.OFFSET=s),s})}if(e in n){var l=n[e];return tk(l,function(t,r){var n=t.invoke(r,l);return o&&(t.OFFSET=n,w.optional(function(){t.assert(r,n+">=0","invalid "+e)})),n})}if(o){if(u)return tE(function(e,t){return e.OFFSET=0,0});else if(i)return new t_(f.thisDep,f.contextDep,f.propDep,function(e,t){return t.def(e.shared.vao+".currentVAO?"+e.shared.vao+".currentVAO.offset:0")})}else if(i)return new t_(f.thisDep,f.contextDep,f.propDep,function(e,t){return t.def(e.shared.vao+".currentVAO?"+e.shared.vao+".currentVAO.instances:-1")});return null}var m=c(ta,!0),d=function(){if(tr in r){var e=r[tr];return a.primitive=e,w.commandParameter(e,Q,"invalid primitve",t.commandStr),tE(function(t,r){return Q[e]})}if(tr in n){var o=n[tr];return tk(o,function(e,t){var r=e.constants.primTypes,n=e.invoke(t,o);return w.optional(function(){e.assert(t,n+" in "+r,"invalid primitive, must be one of "+Object.keys(Q))}),t.def(r,"[",n,"]")})}if(u)if(!tS(s))return new t_(s.thisDep,s.contextDep,s.propDep,function(e,t){var r=e.ELEMENTS;return t.def(r,"?",r,".primType:",4)});else if(s.value)return tE(function(e,t){return t.def(e.ELEMENTS,".primType")});else return tE(function(){return 4});return i?new t_(f.thisDep,f.contextDep,f.propDep,function(e,t){return t.def(e.shared.vao+".currentVAO?"+e.shared.vao+".currentVAO.primitive:4")}):null}(),p=function(){if(tn in r){var e=0|r[tn];return a.count=e,w.command("number"==typeof e&&e>=0,"invalid vertex count",t.commandStr),tE(function(){return e})}if(tn in n){var o=n[tn];return tk(o,function(e,t){var r=e.invoke(t,o);return w.optional(function(){e.assert(t,"typeof "+r+'==="number"&&'+r+">=0&&"+r+"===("+r+"|0)","invalid vertex count")}),r})}if(u)if(tS(s))if(s)if(m)return new t_(m.thisDep,m.contextDep,m.propDep,function(e,t){var r=t.def(e.ELEMENTS,".vertCount-",e.OFFSET);return w.optional(function(){e.assert(t,r+">=0","invalid vertex offset/element buffer too small")}),r});else return tE(function(e,t){return t.def(e.ELEMENTS,".vertCount")});else{var l=tE(function(){return -1});return w.optional(function(){l.MISSING=!0}),l}else{var c=new t_(s.thisDep||m.thisDep,s.contextDep||m.contextDep,s.propDep||m.propDep,function(e,t){var r=e.ELEMENTS;return e.OFFSET?t.def(r,"?",r,".vertCount-",e.OFFSET,":-1"):t.def(r,"?",r,".vertCount:-1")});return w.optional(function(){c.DYNAMIC=!0}),c}return i?new t_(f.thisDep,f.contextDep,f.propDep,function(e,t){return t.def(e.shared.vao,".currentVAO?",e.shared.vao,".currentVAO.count:-1")}):null}();return{elements:s,primitive:d,count:p,instances:c(ti,!1),offset:m,vao:f,vaoActive:i,elementsActive:u,static:a}}(e,m),L=(d=e.static,p=e.dynamic,v={},S.forEach(function(e){var t=D(e);function r(r,n){if(e in d){var a=r(d[e]);v[t]=tE(function(){return a})}else if(e in p){var i=p[e];v[t]=tk(i,function(e,t){return n(e,t,e.invoke(t,i))})}}switch(e){case eW:case eU:case ej:case eZ:case eI:case e5:case e$:case eY:case eK:case eV:return r(function(t){return w.commandType(t,"boolean",e,m.commandStr),t},function(t,r,n){return w.optional(function(){t.assert(r,"typeof "+n+'==="boolean"',"invalid flag "+e,t.commandStr)}),n});case eM:return r(function(t){return w.commandParameter(t,tg,"invalid "+e,m.commandStr),tg[t]},function(t,r,n){var a=t.constants.compareFuncs;return w.optional(function(){t.assert(r,n+" in "+a,"invalid "+e+", must be one of "+Object.keys(tg))}),r.def(a,"[",n,"]")});case eG:return r(function(e){return w.command(Z(e)&&2===e.length&&"number"==typeof e[0]&&"number"==typeof e[1]&&e[0]<=e[1],"depth range is 2d array",m.commandStr),e},function(e,t,r){return w.optional(function(){e.assert(t,e.shared.isArrayLike+"("+r+")&&"+r+".length===2&&typeof "+r+'[0]==="number"&&typeof '+r+'[1]==="number"&&'+r+"[0]<="+r+"[1]","depth range must be a 2d array")}),[t.def("+",r,"[0]"),t.def("+",r,"[1]")]});case eL:return r(function(e){w.commandType(e,"object","blend.func",m.commandStr);var r="srcRGB"in e?e.srcRGB:e.src,n="srcAlpha"in e?e.srcAlpha:e.src,a="dstRGB"in e?e.dstRGB:e.dst,i="dstAlpha"in e?e.dstAlpha:e.dst;return w.commandParameter(r,th,t+".srcRGB",m.commandStr),w.commandParameter(n,th,t+".srcAlpha",m.commandStr),w.commandParameter(a,th,t+".dstRGB",m.commandStr),w.commandParameter(i,th,t+".dstAlpha",m.commandStr),w.command(-1===tb.indexOf(r+", "+a),"unallowed blending combination (srcRGB, dstRGB) = ("+r+", "+a+")",m.commandStr),[th[r],th[a],th[n],th[i]]},function(t,r,n){var a=t.constants.blendFuncs;function i(i,o){var f=r.def('"',i,o,'" in ',n,"?",n,".",i,o,":",n,".",i);return w.optional(function(){t.assert(r,f+" in "+a,"invalid "+e+"."+i+o+", must be one of "+Object.keys(th))}),f}w.optional(function(){t.assert(r,n+"&&typeof "+n+'==="object"',"invalid blend func, must be an object")});var o=i("src","RGB"),f=i("dst","RGB");w.optional(function(){var e=t.constants.invalidBlendCombinations;t.assert(r,e+".indexOf("+o+'+", "+'+f+") === -1 ","unallowed blending combination for (srcRGB, dstRGB)")});var u=r.def(a,"[",o,"]"),s=r.def(a,"[",i("src","Alpha"),"]");return[u,r.def(a,"[",f,"]"),s,r.def(a,"[",i("dst","Alpha"),"]")]});case eB:return r(function(t){return"string"==typeof t?(w.commandParameter(t,b,"invalid "+e,m.commandStr),[b[t],b[t]]):"object"==typeof t?(w.commandParameter(t.rgb,b,e+".rgb",m.commandStr),w.commandParameter(t.alpha,b,e+".alpha",m.commandStr),[b[t.rgb],b[t.alpha]]):void w.commandRaise("invalid blend.equation",m.commandStr)},function(t,r,n){var a=t.constants.blendEquations,i=r.def(),o=r.def(),f=t.cond("typeof ",n,'==="string"');return w.optional(function(){function r(e,r,n){t.assert(e,n+" in "+a,"invalid "+r+", must be one of "+Object.keys(b))}r(f.then,e,n),t.assert(f.else,n+"&&typeof "+n+'==="object"',"invalid "+e),r(f.else,e+".rgb",n+".rgb"),r(f.else,e+".alpha",n+".alpha")}),f.then(i,"=",o,"=",a,"[",n,"];"),f.else(i,"=",a,"[",n,".rgb];",o,"=",a,"[",n,".alpha];"),r(f),[i,o]});case eP:return r(function(e){return w.command(Z(e)&&4===e.length,"blend.color must be a 4d array",m.commandStr),F(4,function(t){return+e[t]})},function(e,t,r){return w.optional(function(){e.assert(t,e.shared.isArrayLike+"("+r+")&&"+r+".length===4","blend.color must be a 4d array")}),F(4,function(e){return t.def("+",r,"[",e,"]")})});case e0:return r(function(e){return w.commandType(e,"number",t,m.commandStr),0|e},function(e,t,r){return w.optional(function(){e.assert(t,"typeof "+r+'==="number"',"invalid stencil.mask")}),t.def(r,"|0")});case e1:return r(function(r){w.commandType(r,"object",t,m.commandStr);var n=r.cmp||"keep",a=r.ref||0,i="mask"in r?r.mask:-1;return w.commandParameter(n,tg,e+".cmp",m.commandStr),w.commandType(a,"number",e+".ref",m.commandStr),w.commandType(i,"number",e+".mask",m.commandStr),[tg[n],a,i]},function(e,t,r){var n=e.constants.compareFuncs;return w.optional(function(){function a(){e.assert(t,Array.prototype.join.call(arguments,""),"invalid stencil.func")}a(r+"&&typeof ",r,'==="object"'),a('!("cmp" in ',r,")||(",r,".cmp in ",n,")")}),[t.def('"cmp" in ',r,"?",n,"[",r,".cmp]",":",7680),t.def(r,".ref|0"),t.def('"mask" in ',r,"?",r,".mask|0:-1")]});case e3:case e2:return r(function(r){w.commandType(r,"object",t,m.commandStr);var n=r.fail||"keep",a=r.zfail||"keep",i=r.zpass||"keep";return w.commandParameter(n,ty,e+".fail",m.commandStr),w.commandParameter(a,ty,e+".zfail",m.commandStr),w.commandParameter(i,ty,e+".zpass",m.commandStr),[e===e2?1029:1028,ty[n],ty[a],ty[i]]},function(t,r,n){var a=t.constants.stencilOps;function i(i){return w.optional(function(){t.assert(r,'!("'+i+'" in '+n+")||("+n+"."+i+" in "+a+")","invalid "+e+"."+i+", must be one of "+Object.keys(ty))}),r.def('"',i,'" in ',n,"?",a,"[",n,".",i,"]:",7680)}return w.optional(function(){t.assert(r,n+"&&typeof "+n+'==="object"',"invalid "+e)}),[e===e2?1029:1028,i("fail"),i("zfail"),i("zpass")]});case eQ:return r(function(e){w.commandType(e,"object",t,m.commandStr);var r=0|e.factor,n=0|e.units;return w.commandType(r,"number",t+".factor",m.commandStr),w.commandType(n,"number",t+".units",m.commandStr),[r,n]},function(t,r,n){return w.optional(function(){t.assert(r,n+"&&typeof "+n+'==="object"',"invalid "+e)}),[r.def(n,".factor|0"),r.def(n,".units|0")]});case eX:return r(function(e){var r=0;return"front"===e?r=1028:"back"===e&&(r=1029),w.command(!!r,t,m.commandStr),r},function(e,t,r){return w.optional(function(){e.assert(t,r+'==="front"||'+r+'==="back"',"invalid cull.face")}),t.def(r,'==="front"?',1028,":",1029)});case eH:return r(function(e){return w.command("number"==typeof e&&e>=a.lineWidthDims[0]&&e<=a.lineWidthDims[1],"invalid line width, must be a positive number between "+a.lineWidthDims[0]+" and "+a.lineWidthDims[1],m.commandStr),e},function(e,t,r){return w.optional(function(){e.assert(t,"typeof "+r+'==="number"&&'+r+">="+a.lineWidthDims[0]+"&&"+r+"<="+a.lineWidthDims[1],"invalid line width")}),r});case eN:return r(function(e){return w.commandParameter(e,tw,t,m.commandStr),tw[e]},function(e,t,r){return w.optional(function(){e.assert(t,r+'==="cw"||'+r+'==="ccw"',"invalid frontFace, must be one of cw,ccw")}),t.def(r+'==="cw"?2304:2305')});case eq:return r(function(e){return w.command(Z(e)&&4===e.length,"color.mask must be length 4 array",m.commandStr),e.map(function(e){return!!e})},function(e,t,r){return w.optional(function(){e.assert(t,e.shared.isArrayLike+"("+r+")&&"+r+".length===4","invalid color.mask")}),F(4,function(e){return"!!"+r+"["+e+"]"})});case eJ:return r(function(e){w.command("object"==typeof e&&e,t,m.commandStr);var r="value"in e?e.value:1,n=!!e.invert;return w.command("number"==typeof r&&r>=0&&r<=1,"sample.coverage.value must be a number between 0 and 1",m.commandStr),[r,n]},function(e,t,r){return w.optional(function(){e.assert(t,r+"&&typeof "+r+'==="object"',"invalid sample.coverage")}),[t.def('"value" in ',r,"?+",r,".value:1"),t.def("!!",r,".invert")]})}}),v),I=function(e,t,n){var a,i=e.static,o=e.dynamic;function f(e){if(e in i){var t=r.id(i[e]);w.optional(function(){c.shader(tx[e],t,w.guessCommand())});var n=tE(function(){return t});return n.id=t,n}if(e in o){var a=o[e];return tk(a,function(t,r){var n=t.invoke(r,a),i=r.def(t.shared.strings,".id(",n,")");return w.optional(function(){r(t.shared.shader,".shader(",tx[e],",",i,",",t.command,");")}),i})}return null}var u=f(te),s=f(e9),l=null;return tS(u)&&tS(s)?(l=c.program(s.id,u.id,null,n),a=tE(function(e,t){return e.link(l)})):a=new t_(u&&u.thisDep||s&&s.thisDep,u&&u.contextDep||s&&s.contextDep,u&&u.propDep||s&&s.propDep,function(e,t){var r,n,a=e.shared.shader;r=u?u.append(e,t):t.def(a,".",te),n=s?s.append(e,t):t.def(a,".",e9);var i=a+".program("+n+","+r;return w.optional(function(){i+=","+e.command}),t.def(i+")")}),{frag:u,vert:s,progVar:a,program:l}}(e,0,j);function M(e){var t=P[e];t&&(L[e]=t)}M(e6),M(D(e4));var G=Object.keys(L).length>0,V={framebuffer:U,draw:B,shader:I,state:L,dirty:G,scopeVAO:null,drawVAO:null,useVAO:!1,attributes:{}};if(V.profile=function(e){var t,r=e.static,n=e.dynamic;if(e8 in r){var a=!!r[e8];(t=tE(function(e,t){return a})).enable=a}else if(e8 in n){var i=n[e8];t=tk(i,function(e,t){return e.invoke(t,i)})}return t}(e,m),y=f.static,x=f.dynamic,A={},Object.keys(y).forEach(function(e){var t,r=y[e];if("number"==typeof r||"boolean"==typeof r)t=tE(function(){return r});else if("function"==typeof r){var n=r._reglType;"texture2d"===n||"textureCube"===n?t=tE(function(e){return e.link(r)}):"framebuffer"===n||"framebufferCube"===n?(w.command(r.color.length>0,'missing color attachment for framebuffer sent to uniform "'+e+'"',m.commandStr),t=tE(function(e){return e.link(r.color[0])})):w.commandRaise('invalid data for uniform "'+e+'"',m.commandStr)}else Z(r)?t=tE(function(t){return t.global.def("[",F(r.length,function(n){return w.command("number"==typeof r[n]||"boolean"==typeof r[n],"invalid uniform "+e,t.commandStr),r[n]}),"]")}):w.commandRaise('invalid or missing data for uniform "'+e+'"',m.commandStr);t.value=r,A[e]=t}),Object.keys(x).forEach(function(e){var t=x[e];A[e]=tk(t,function(e,r){return e.invoke(r,t)})}),V.uniforms=A,V.drawVAO=V.scopeVAO=B.vao,!V.drawVAO&&I.program&&!j&&n.angle_instanced_arrays&&B.static.elements){var W=!0,X=I.program.attributes.map(function(e){var r=t.static[e];return W=W&&!!r,r});if(W&&X.length>0){var N=l.getVAO(l.createVAO({attributes:X,elements:B.static.elements}));V.drawVAO=new t_(null,null,null,function(e,t){return e.link(N)}),V.useVAO=!0}}return j?V.useVAO=!0:(T=t.static,_=t.dynamic,E={},Object.keys(T).forEach(function(e){var t=T[e],n=r.id(e),a=new h;if(tA(t))a.state=1,a.buffer=i.getBuffer(i.create(t,34962,!1,!0)),a.type=0;else{var o=i.getBuffer(t);if(o)a.state=1,a.buffer=o,a.type=0;else if(w.command("object"==typeof t&&t,"invalid data for attribute "+e,m.commandStr),"constant"in t){var f=t.constant;a.buffer="null",a.state=2,"number"==typeof f?a.x=f:(w.command(Z(f)&&f.length>0&&f.length<=4,"invalid constant for attribute "+e,m.commandStr),ez.forEach(function(e,t){t<f.length&&(a[e]=f[t])}))}else{o=tA(t.buffer)?i.getBuffer(i.create(t.buffer,34962,!1,!0)):i.getBuffer(t.buffer),w.command(!!o,'missing buffer for attribute "'+e+'"',m.commandStr);var u=0|t.offset;w.command(u>=0,'invalid offset for attribute "'+e+'"',m.commandStr);var s=0|t.stride;w.command(s>=0&&s<256,'invalid stride for attribute "'+e+'", must be integer betweeen [0, 255]',m.commandStr);var l=0|t.size;w.command(!("size"in t)||l>0&&l<=4,'invalid size for attribute "'+e+'", must be 1,2,3,4',m.commandStr);var c=!!t.normalized,d=0;"type"in t&&(w.commandParameter(t.type,q,"invalid type for attribute "+e,m.commandStr),d=q[t.type]);var p=0|t.divisor;w.optional(function(){"divisor"in t&&(w.command(0===p||g,'cannot specify divisor for attribute "'+e+'", instancing not supported',m.commandStr),w.command(p>=0,'invalid divisor for attribute "'+e+'"',m.commandStr));var r=m.commandStr,n=["buffer","offset","divisor","normalized","type","size","stride"];Object.keys(t).forEach(function(t){w.command(n.indexOf(t)>=0,'unknown parameter "'+t+'" for attribute pointer "'+e+'" (valid parameters are '+n+")",r)})}),a.buffer=o,a.state=1,a.size=l,a.normalized=c,a.type=d||o.dtype,a.offset=u,a.stride=s,a.divisor=p}}E[e]=tE(function(e,t){var r=e.attribCache;if(n in r)return r[n];var i={isStream:!1};return Object.keys(a).forEach(function(e){i[e]=a[e]}),a.buffer&&(i.buffer=e.link(a.buffer),i.type=i.type||i.buffer+".dtype"),r[n]=i,i})}),Object.keys(_).forEach(function(e){var t=_[e];E[e]=tk(t,function(r,n){var a=r.invoke(n,t),i=r.shared,o=r.constants,f=i.isBufferArgs,u=i.buffer;w.optional(function(){r.assert(n,a+"&&(typeof "+a+'==="object"||typeof '+a+'==="function")&&('+f+"("+a+")||"+u+".getBuffer("+a+")||"+u+".getBuffer("+a+".buffer)||"+f+"("+a+'.buffer)||("constant" in '+a+"&&(typeof "+a+'.constant==="number"||'+i.isArrayLike+"("+a+".constant))))",'invalid dynamic attribute "'+e+'"')});var s={isStream:n.def(!1)},l=new h;l.state=1,Object.keys(l).forEach(function(e){s[e]=n.def(""+l[e])});var c=s.buffer,m=s.type;function d(e){n(s[e],"=",a,".",e,"|0;")}return n("if(",f,"(",a,")){",s.isStream,"=true;",c,"=",u,".createStream(",34962,",",a,");",m,"=",c,".dtype;","}else{",c,"=",u,".getBuffer(",a,");","if(",c,"){",m,"=",c,".dtype;",'}else if("constant" in ',a,"){",s.state,"=",2,";","if(typeof "+a+'.constant === "number"){',s[ez[0]],"=",a,".constant;",ez.slice(1).map(function(e){return s[e]}).join("="),"=0;","}else{",ez.map(function(e,t){return s[e]+"="+a+".constant.length>"+t+"?"+a+".constant["+t+"]:0;"}).join(""),"}}else{","if(",f,"(",a,".buffer)){",c,"=",u,".createStream(",34962,",",a,".buffer);","}else{",c,"=",u,".getBuffer(",a,".buffer);","}",m,'="type" in ',a,"?",o.glTypes,"[",a,".type]:",c,".dtype;",s.normalized,"=!!",a,".normalized;"),d("size"),d("offset"),d("stride"),d("divisor"),n("}}"),n.exit("if(",s.isStream,"){",u,".destroyStream(",c,");","}"),s})}),V.attributes=E),k=s.static,O=s.dynamic,C={},Object.keys(k).forEach(function(e){var t=k[e];C[e]=tE(function(e,r){return"number"==typeof t||"boolean"==typeof t?""+t:e.link(t)})}),Object.keys(O).forEach(function(e){var t=O[e];C[e]=tk(t,function(e,r){return e.invoke(r,t)})}),V.context=C,V}(e,f,s,m,p);!function(e,t){var r=e.proc("draw",1);V(e,r),L(e,r,t.context),I(e,r,t.framebuffer),M(e,r,t),G(e,r,t.state),W(e,r,t,!1,!0);var n=t.shader.progVar.append(e,r);if(r(e.shared.gl,".useProgram(",n,".program);"),t.shader.program)Y(e,r,t,t.shader.program);else{r(e.shared.vao,".setVAO(null);");var a=e.global.def("{}"),i=r.def(n,".id"),o=r.def(a,"[",i,"]");r(e.cond(o).then(o,".call(this,a0);").else(o,"=",a,"[",i,"]=",e.link(function(r){return $(Y,e,t,r,1)}),"(",n,");",o,".call(this,a0);"))}Object.keys(t.state).length>0&&r(e.shared.current,".dirty=true;"),e.shared.vao&&r(e.shared.vao,".setVAO(null);")}(p,v);var y=p.proc("scope",3);p.batchId="a2";var x=p.shared,A=x.current;function T(e){var t=v.shader[e];t&&y.set(x.shader,"."+e,t.append(p,y))}return L(p,y,v.context),v.framebuffer&&v.framebuffer.append(p,y),tT(Object.keys(v.state)).forEach(function(e){var t=v.state[e].append(p,y);Z(t)?t.forEach(function(t,r){y.set(p.next[e],"["+r+"]",t)}):y.set(x.next,"."+e,t)}),W(p,y,v,!0,!0),[tt,ta,tn,ti,tr].forEach(function(e){var t=v.draw[e];t&&y.set(x.draw,"."+e,""+t.append(p,y))}),Object.keys(v.uniforms).forEach(function(e){var t=v.uniforms[e].append(p,y);Array.isArray(t)&&(t="["+t.join()+"]"),y.set(x.uniforms,"["+r.id(e)+"]",t)}),Object.keys(v.attributes).forEach(function(e){var t=v.attributes[e].append(p,y),r=p.scopeAttrib(e);Object.keys(new h).forEach(function(e){y.set(r,"."+e,t[e])})}),v.scopeVAO&&y.set(x.vao,".targetVAO",v.scopeVAO.append(p,y)),T(e9),T(te),Object.keys(v.state).length>0&&(y(A,".dirty=true;"),y.exit(A,".dirty=true;")),y("a1(",p.shared.context,",a0,",p.batchId,");"),!function(e,t){var r=e.proc("batch",2);e.batchId="0",V(e,r);var n=!1,a=!0;Object.keys(t.context).forEach(function(e){n=n||t.context[e].propDep}),n||(L(e,r,t.context),a=!1);var i=t.framebuffer,o=!1;function f(e){return e.contextDep&&n||e.propDep}i?(i.propDep?n=o=!0:i.contextDep&&n&&(o=!0),o||I(e,r,i)):I(e,r,null),t.state.viewport&&t.state.viewport.propDep&&(n=!0),M(e,r,t),G(e,r,t.state,function(e){return!f(e)}),t.profile&&f(t.profile)||W(e,r,t,!1,"a1"),t.contextDep=n,t.needsContext=a,t.needsFramebuffer=o;var u=t.shader.progVar;if(u.contextDep&&n||u.propDep)J(e,r,t,null);else{var s=u.append(e,r);if(r(e.shared.gl,".useProgram(",s,".program);"),t.shader.program)J(e,r,t,t.shader.program);else{r(e.shared.vao,".setVAO(null);");var l=e.global.def("{}"),c=r.def(s,".id"),m=r.def(l,"[",c,"]");r(e.cond(m).then(m,".call(this,a0,a1);").else(m,"=",l,"[",c,"]=",e.link(function(r){return $(J,e,t,r,2)}),"(",s,");",m,".call(this,a0,a1);"))}}Object.keys(t.state).length>0&&r(e.shared.current,".dirty=true;"),e.shared.vao&&r(e.shared.vao,".setVAO(null);")}(p,v),t(p.compile(),{destroy:function(){v.shader.program.destroy()}})}}}(o,l,m,y,x,A,0,V,{},_,z,g,b,d,i),K=function(t,r,n,a,i,o,f){function u(u){null===r.next?(w(i.preserveDrawingBuffer,'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'),s=5121):(w(null!==r.next.colorAttachments[0].texture,"You cannot read from a renderbuffer"),s=r.next.colorAttachments[0].texture._texture.type,w.optional(function(){o.oes_texture_float?(w(5121===s||5126===s,"Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"),5126===s&&w(f.readFloat,"Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float")):w(5121===s,"Reading from a framebuffer is only allowed for the type 'uint8'")}));var s,l=0,c=0,m=a.framebufferWidth,d=a.framebufferHeight,p=null;e(u)?p=u:u&&(w.type(u,"object","invalid arguments to regl.read()"),l=0|u.x,c=0|u.y,w(l>=0&&l<a.framebufferWidth,"invalid x offset for regl.read"),w(c>=0&&c<a.framebufferHeight,"invalid y offset for regl.read"),m=0|(u.width||a.framebufferWidth-l),d=0|(u.height||a.framebufferHeight-c),p=u.data||null),p&&(5121===s?w(p instanceof Uint8Array,"buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"):5126===s&&w(p instanceof Float32Array,"buffer must be 'Float32Array' when reading from a framebuffer of type 'float'")),w(m>0&&m+l<=a.framebufferWidth,"invalid width for read pixels"),w(d>0&&d+c<=a.framebufferHeight,"invalid height for read pixels"),n();var v=m*d*4;return p||(5121===s?p=new Uint8Array(v):5126===s&&(p=p||new Float32Array(v))),w.isTypedArray(p,"data buffer for regl.read() must be a typedarray"),w(p.byteLength>=v,"data buffer for regl.read() too small"),t.pixelStorei(3333,4),t.readPixels(l,c,m,d,6408,s,p),p}return function(e){var t;return e&&"framebuffer"in e?(r.setFBO({framebuffer:e.framebuffer},function(){t=u(e)}),t):u(e)}}(o,V,Y.procs.poll,b,f,m,y),ea=Y.next,ec=o.canvas,em=[],ed=[],eA=[],to=[i.onDestroy],tf=null;function tm(){if(0===em.length){d&&d.update(),tf=null;return}tf=O.next(tm),tV();for(var e=em.length-1;e>=0;--e){var t=em[e];t&&t(b,null,0)}o.flush(),d&&d.update()}function tz(){!tf&&em.length>0&&(tf=O.next(tm))}function tj(){tf&&(O.cancel(tm),tf=null)}function tU(e){e.preventDefault(),u=!0,tj(),ed.forEach(function(e){e()})}function tP(e){o.getError(),u=!1,s.restore(),z.restore(),x.restore(),j.restore(),G.restore(),V.restore(),_.restore(),d&&d.restore(),Y.procs.refresh(),tz(),eA.forEach(function(e){e()})}function tB(e){function r(e,t){var r={},n={};return Object.keys(e).forEach(function(a){var i=e[a];if(E(i)){n[a]=k(i,a);return}if(t&&Array.isArray(i)){for(var o=0;o<i.length;++o)if(E(i[o])){n[a]=k(i,a);return}}r[a]=i}),{dynamic:n,static:r}}w(!!e,"invalid args to regl({...})"),w.type(e,"object","invalid args to regl({...})");var n=r(e.context||{},!0),a=r(e.uniforms||{},!0),i=r(e.attributes||{},!1),o=r(function(e){var r=t({},e);function n(e){if(e in r){var t=r[e];delete r[e],Object.keys(t).forEach(function(n){r[e+"."+n]=t[n]})}}return delete r.uniforms,delete r.attributes,delete r.context,delete r.vao,"stencil"in r&&r.stencil.op&&(r.stencil.opBack=r.stencil.opFront=r.stencil.op,delete r.stencil.op),n("blend"),n("depth"),n("cull"),n("stencil"),n("polygonOffset"),n("scissor"),n("sample"),"vao"in e&&(r.vao=e.vao),r}(e),!1),f={gpuTime:0,cpuTime:0,count:0},s=Y.compile(o,i,a,n,f),l=s.draw,c=s.batch,m=s.scope,d=[];return t(function(e,t){var r;if(u&&w.raise("context lost"),"function"==typeof e)return m.call(this,null,e,0);if("function"==typeof t)if("number"==typeof e)for(r=0;r<e;++r)m.call(this,null,t,r);else if(!Array.isArray(e))return m.call(this,e,t,0);else for(r=0;r<e.length;++r)m.call(this,e[r],t,r);else if("number"==typeof e){if(e>0)return c.call(this,function(e){for(;d.length<e;)d.push(null);return d}(0|e),0|e)}else if(!Array.isArray(e))return l.call(this,e);else if(e.length)return c.call(this,e,e.length)},{stats:f,destroy:function(){s.destroy()}})}ec&&(ec.addEventListener(tD,tU,!1),ec.addEventListener(tR,tP,!1));var tL=V.setFBO=tB({framebuffer:S.call(null,1,"framebuffer")});function tI(e,t){var r=0;Y.procs.poll();var n=t.color;n&&(o.clearColor(+n[0]||0,+n[1]||0,+n[2]||0,+n[3]||0),r|=16384),"depth"in t&&(o.clearDepth(+t.depth),r|=256),"stencil"in t&&(o.clearStencil(0|t.stencil),r|=1024),w(!!r,"called regl.clear with no buffer specified"),o.clear(r)}function tM(e){return w.type(e,"function","regl.frame() callback must be a function"),em.push(e),tz(),{cancel:function(){var t=tF(em,e);w(t>=0,"cannot cancel a frame twice"),em[t]=function e(){var t=tF(em,e);em[t]=em[em.length-1],em.length-=1,em.length<=0&&tj()}}}}function tG(){var e=ea.viewport,t=ea.scissor_box;e[0]=e[1]=t[0]=t[1]=0,b.viewportWidth=b.framebufferWidth=b.drawingBufferWidth=e[2]=t[2]=o.drawingBufferWidth,b.viewportHeight=b.framebufferHeight=b.drawingBufferHeight=e[3]=t[3]=o.drawingBufferHeight}function tV(){b.tick+=1,b.time=tW(),tG(),Y.procs.poll()}function tq(){j.refresh(),tG(),Y.procs.refresh(),d&&d.update()}function tW(){return(C()-p)/1e3}tq();var tX=t(tB,{clear:function(e){if(w("object"==typeof e&&e,"regl.clear() takes an object as input"),"framebuffer"in e)if(e.framebuffer&&"framebufferCube"===e.framebuffer_reglType)for(var r=0;r<6;++r)tL(t({framebuffer:e.framebuffer.faces[r]},e),tI);else tL(e,tI);else tI(null,e)},prop:S.bind(null,1),context:S.bind(null,2),this:S.bind(null,3),draw:tB({}),buffer:function(e){return x.create(e,34962,!1,!1)},elements:function(e){return A.create(e,!1)},texture:j.create2D,cube:j.createCube,renderbuffer:G.create,framebuffer:V.create,framebufferCube:V.createCube,vao:_.createVAO,attributes:f,frame:tM,on:function(e,t){var r;switch(w.type(t,"function","listener callback must be a function"),e){case"frame":return tM(t);case"lost":r=ed;break;case"restore":r=eA;break;case"destroy":r=to;break;default:w.raise("invalid event, must be one of frame,lost,restore,destroy")}return r.push(t),{cancel:function(){for(var e=0;e<r.length;++e)if(r[e]===t){r[e]=r[r.length-1],r.pop();return}}}},limits:y,hasExtension:function(e){return y.extensions.indexOf(e.toLowerCase())>=0},read:K,destroy:function(){em.length=0,tj(),ec&&(ec.removeEventListener(tD,tU),ec.removeEventListener(tR,tP)),z.clear(),V.clear(),G.clear(),_.clear(),j.clear(),A.clear(),x.clear(),d&&d.clear(),to.forEach(function(e){e()})},_gl:o,_refresh:tq,poll:function(){tV(),d&&d.update()},now:tW,stats:c});return i.onDone(null,tX),tX}}()},62524,58083,e=>{"use strict";var t=e.i(43476),r=e.i(71645);class n{state;constructor(){this.state={uTime:0,uResolution:[1,1],uMouse:[.5,.5],uScroll:0,uOpacity:1,uDt:.016}}update(e){this.state.uTime+=e,this.state.uDt=e}resize(e,t){this.state.uResolution=[e,t]}setMouse(e,t){this.state.uMouse=[e,1-t]}setScroll(e){this.state.uScroll=e}}var a=e.i(25443);function i(e,t){try{return e.getExtension(t)}catch{return null}}function o(e,t,r){let n,a,o;if(t)a=e.RGBA,"float"===r?(n=e.RGBA32F,o=e.FLOAT):(n=e.RGBA16F,o=e.HALF_FLOAT);else if(n=e.RGBA,a=e.RGBA,"float"===r)o=e.FLOAT;else{let t=i(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;o=t.HALF_FLOAT_OES}let f=e.createTexture(),u=e.createFramebuffer();if(!f||!u)return!1;let s=!1;try{if(e.bindTexture(e.TEXTURE_2D,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,n,4,4,0,a,o,null),e.getError()!==e.NO_ERROR)return!1;e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,f,0),(s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE)&&(e.viewport(0,0,4,4),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.getError()!==e.NO_ERROR&&(s=!1))}catch{s=!1}finally{e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(f),e.deleteFramebuffer(u)}return s}function f(e,t,r){let n,a,o;if(t)a=e.RGBA,"float"===r?(n=e.RGBA32F,o=e.FLOAT):(n=e.RGBA16F,o=e.HALF_FLOAT);else if(n=e.RGBA,a=e.RGBA,"float"===r)o=e.FLOAT;else{let t=i(e,"OES_texture_half_float");if(!t||!t.HALF_FLOAT_OES)return!1;o=t.HALF_FLOAT_OES}let f=e.createTexture();if(!f)return!1;let u=!1;try{e.bindTexture(e.TEXTURE_2D,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,n,4,4,0,a,o,null),u=e.getError()===e.NO_ERROR}catch{u=!1}finally{e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(f)}return u}function u(e,t,r,n,a,i){let o=t._texture?.texture;if(!o)return console.warn("[render-target] Could not access regl texture internals"),!1;let f="linear"===i?e.LINEAR:e.NEAREST,u="half float"===a?e.RGBA16F:e.RGBA32F,s="half float"===a?e.HALF_FLOAT:e.FLOAT;try{e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,f),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,u,r,n,0,e.RGBA,s,null);let t=e.getError();if(e.bindTexture(e.TEXTURE_2D,null),t!==e.NO_ERROR)return console.warn(`[render-target] GL error reinitializing texture: ${t}`),!1;return!0}catch(t){return e.bindTexture(e.TEXTURE_2D,null),console.warn("[render-target] Exception reinitializing texture:",t),!1}}function s(e,t,r){let{width:n,height:a,linear:i=!1}=r,o=[],f=e._gl,s=[];for(let r of(t.isWebGL2,t.canRTTHalfFloat&&s.push("half float"),t.canRTTFloat&&s.push("float"),s.push("uint8"),s)){let s,l="linear"==(s=i&&("half float"===r&&t.canLinearHalfFloat||"float"===r&&t.canLinearFloat||"uint8"===r)?"linear":"nearest")?"linear":"nearest",c="linear"===s?"linear":"nearest";try{let i;if(t.isWebGL2&&("half float"===r||"float"===r)){if(i=e.texture({width:n,height:a,type:"uint8",format:"rgba",min:l,mag:c,wrap:"clamp"}),!u(f,i,n,a,r,s)){i.destroy(),o.push(r),console.warn(`[render-target] Failed to reinit texture as ${r}`);continue}}else i=e.texture({width:n,height:a,type:r,format:"rgba",min:l,mag:c,wrap:"clamp"});let m=e.framebuffer({color:i,depth:!1,stencil:!1}),d=!0;try{m.use(()=>{e.clear({color:[0,0,0,1]})})}catch{d=!1}if(d){let e=m._framebuffer?.framebuffer;if(e){f.bindFramebuffer(f.FRAMEBUFFER,e);let t=f.checkFramebufferStatus(f.FRAMEBUFFER);f.bindFramebuffer(f.FRAMEBUFFER,null),t!==f.FRAMEBUFFER_COMPLETE&&(d=!1)}}if(!d){m.destroy(),i.destroy(),o.push(r),console.warn(`[render-target] ${r} FBO validation failed, trying next format`);continue}let p=t.isWebGL2&&("half float"===r||"float"===r),v={},h=(t,n)=>{if(p){m.destroy(),i.destroy();let a=e.texture({width:t,height:n,type:"uint8",format:"rgba",min:l,mag:c,wrap:"clamp"});u(f,a,t,n,r,s);let o=e.framebuffer({color:a,depth:!1,stencil:!1});i=a,m=o,v.fbo=o,v.colorTex=a}else m.resize(t,n)},b=()=>{m.destroy(),i.destroy()};return v.fbo=m,v.colorTex=i,v.type=r,v.filter=s,v.fallbackFrom=o.length>0?o:void 0,v.resize=h,v.destroy=b,v}catch(e){o.push(r),console.warn(`[render-target] Failed to create ${r} FBO:`,e);continue}}throw Error("Failed to create any render target format")}let l="#version 300 es\nprecision highp float;\n\n#define PI 3.14159265359\n\n// Common utility functions for noise and math\nfloat random(vec2 st) {\n    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);\n}\n\n// 2D Noise based on Morgan McGuire @morgan3d\n// https://www.shadertoy.com/view/4dS3Wd\nfloat noise (in vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n\n    // Four corners in 2D of a tile\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n\n    vec2 u = f * f * (3.0 - 2.0 * f);\n\n    return mix(a, b, u.x) +\n            (c - a)* u.y * (1.0 - u.x) +\n            (d - b) * u.x * u.y;\n}\n\nfloat fbm (in vec2 st) {\n    float value = 0.0;\n    float amplitude = .5;\n    // Loop of octaves\n    for (int i = 0; i < 5; i++) {\n        value += amplitude * noise(st);\n        st *= 2.;\n        amplitude *= .5;\n    }\n    return value;\n}",c="#version 300 es\nprecision highp float;\n\nin vec2 position;\nout vec2 vUv;\n\nvoid main() {\n  vUv = 0.5 * (position + 1.0);\n  gl_Position = vec4(position, 0, 1);\n}",m={ripple:{name:"Ripple Flow",description:"Interactive fluid ripples with curl noise",sim:`
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
`,includeInSlideshow:!1},eclipseWeave:{name:"Eclipse Weave",description:"Interlaced corona rings and umbral cores orbiting the cursor",sim:`
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
`,includeInSlideshow:!1},sdfMengerBloom:{name:"SDF Menger Bloom",description:"Fractal-inspired box lattice with blooming cavities",sim:`
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
`,includeInSlideshow:!1},sdfCappedColumns:{name:"SDF Capped Columns",description:"Repeating stone columns and arches in a raymarched hall",sim:`
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
`,includeInSlideshow:!1}},d=Object.keys(m),p=d.filter(e=>!1!==m[e].includeInSlideshow),v="ripple";function h(e){return m[e]||m[v]}e.s(["defaultSketchId",0,v,"getSketch",()=>h,"sketchIds",0,d,"sketches",0,m,"slideshowSketchIds",0,p],58083);let b=" .'`^\\\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";class g{regl;uniforms;caps;rt1;rt2;postRt;asciiGlyphAtlas;asciiAtlasGrid;asciiGlyphCount;cmdSim;cmdFinal;cmdAscii;currentSketchId;tickCount=0;asciiEnabled=!1;constructor(e,t,r,n=v){this.regl=e,this.uniforms=t,this.caps=r,this.currentSketchId=n,this.rt1=s(e,r,{width:1,height:1,linear:!0}),this.rt2=s(e,r,{width:1,height:1,linear:!0}),this.postRt=s(e,r,{width:1,height:1,linear:!1});const a=function(e){let t=b.length,r=Math.ceil(t/16),n=document.createElement("canvas");n.width=160,n.height=16*r;let a=n.getContext("2d");if(!a)throw Error("Unable to create 2D context for ASCII glyph atlas.");a.clearRect(0,0,n.width,n.height),a.fillStyle="#ffffff",a.font="14px monospace",a.textAlign="center",a.textBaseline="middle";for(let e=0;e<t;e++){let t=e%16*10+5,r=16*Math.floor(e/16)+8;a.fillText(b[e],t,r)}return{texture:e.texture({data:n,mag:"nearest",min:"nearest",wrapS:"clamp",wrapT:"clamp"}),atlasGrid:[16,r],glyphCount:t}}(e);this.asciiGlyphAtlas=a.texture,this.asciiAtlasGrid=a.atlasGrid,this.asciiGlyphCount=a.glyphCount,console.log(`[pipeline] Using RT type: ${this.rt1.type}, filter: ${this.rt1.filter}`+(this.rt1.fallbackFrom?` (fallback from: ${this.rt1.fallbackFrom.join(", ")})`:""));const i=h(n);this.cmdSim=this.createSimCommand(i),this.cmdFinal=this.createFinalCommand(i),this.cmdAscii=this.createAsciiCommand()}createSimCommand(e){let t=l+"\n"+e.sim;return this.regl({frag:t,vert:c,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uPrevState:this.regl.prop("inputTexture"),uTime:()=>this.uniforms.state.uTime,uResolution:()=>this.uniforms.state.uResolution,uMouse:()=>this.uniforms.state.uMouse,uDt:()=>this.uniforms.state.uDt},framebuffer:this.regl.prop("outputFbo")})}createFinalCommand(e){let t=l+"\n"+e.final;return this.regl({frag:t,vert:c,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uTexture:this.regl.prop("inputTexture"),uTime:()=>this.uniforms.state.uTime,uOpacity:()=>this.uniforms.state.uOpacity,uResolution:()=>this.uniforms.state.uResolution},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}createAsciiCommand(){return this.regl({frag:"#version 300 es\nprecision highp float;\n\nuniform sampler2D uTexture;\nuniform sampler2D uGlyphAtlas;\nuniform vec2 uResolution;\nuniform vec2 uCellSize;\nuniform vec2 uAtlasGrid;\nuniform float uGlyphCount;\n\nin vec2 vUv;\nout vec4 fragColor;\n\nfloat sampleGlyph(vec2 localUv, float glyphIndex) {\n  float col = mod(glyphIndex, uAtlasGrid.x);\n  float row = floor(glyphIndex / uAtlasGrid.x);\n\n  vec2 cellOrigin = vec2(col, row) / uAtlasGrid;\n  vec2 cellUv = (localUv / uAtlasGrid) + cellOrigin;\n\n  return texture(uGlyphAtlas, cellUv).r;\n}\n\nvoid main() {\n  vec2 frag = gl_FragCoord.xy;\n  vec2 cell = max(uCellSize, vec2(1.0));\n\n  vec2 cellOriginPx = floor(frag / cell) * cell;\n  vec2 cellCenterPx = cellOriginPx + 0.5 * cell;\n  vec2 sceneUv = cellCenterPx / uResolution;\n\n  vec3 sourceColor = texture(uTexture, sceneUv).rgb;\n  float luminance = dot(sourceColor, vec3(0.2126, 0.7152, 0.0722));\n\n  float clampedLum = clamp(luminance, 0.0, 0.99999);\n  float glyphIndex = floor(clampedLum * uGlyphCount);\n\n  vec2 localUv = fract(frag / cell);\n  float glyphMask = sampleGlyph(localUv, glyphIndex);\n\n  vec3 bg = vec3(0.0);\n  vec3 color = mix(bg, sourceColor, glyphMask);\n\n  fragColor = vec4(color, 1.0);\n}\n",vert:c,attributes:{position:[[-1,-1],[1,-1],[-1,1],[-1,1],[1,-1],[1,1]]},count:6,uniforms:{uTexture:this.regl.prop("inputTexture"),uGlyphAtlas:()=>this.asciiGlyphAtlas,uResolution:()=>this.uniforms.state.uResolution,uCellSize:()=>[10,16],uAtlasGrid:()=>this.asciiAtlasGrid,uGlyphCount:()=>this.asciiGlyphCount},framebuffer:this.regl.prop("outputFbo"),depth:{enable:!1}})}setSketch(e){if(e===this.currentSketchId)return;let t=h(e);console.log(`[pipeline] Switching to sketch: ${t.name}`),this.cmdSim=this.createSimCommand(t),this.cmdFinal=this.createFinalCommand(t),this.currentSketchId=e,this.clearTargets()}setAsciiEnabled(e){this.asciiEnabled=e}clearTargets(){this.regl({framebuffer:this.rt1.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})}),this.regl({framebuffer:this.rt2.fbo})(()=>{this.regl.clear({color:[0,0,0,0]})})}resize(e,t){this.rt1.resize(e,t),this.rt2.resize(e,t),this.postRt.resize(e,t),this.uniforms.resize(e,t)}render(){this.tickCount++;let e=this.tickCount%2==0?this.rt1:this.rt2,t=this.tickCount%2==0?this.rt2:this.rt1;this.cmdSim({inputTexture:e.colorTex,outputFbo:t.fbo}),this.cmdFinal({inputTexture:t.colorTex,outputFbo:this.asciiEnabled?this.postRt.fbo:null}),this.asciiEnabled&&this.cmdAscii({inputTexture:this.postRt.colorTex,outputFbo:null})}dispose(){this.rt1.destroy(),this.rt2.destroy(),this.postRt.destroy(),this.asciiGlyphAtlas.destroy()}}let y=(0,r.forwardRef)(({mode:e="contained",sketch:u=v,asciiMode:s=!1,onLoaded:l,className:c="",style:m={}},d)=>{let p,h=(0,r.useRef)(null),b=(0,r.useRef)(null),y=(0,r.useRef)(null);return(0,r.useImperativeHandle)(d,()=>({setSketch:e=>{y.current&&y.current.pipeline.setSketch(e)},getCurrentSketch:()=>y.current?.pipeline.currentSketchId||v}),[]),(0,r.useEffect)(()=>{y.current&&u&&y.current.pipeline.setSketch(u)},[u]),(0,r.useEffect)(()=>{y.current&&y.current.pipeline.setAsciiEnabled(s)},[s]),(0,r.useEffect)(()=>{let t,r,c,m,d;if(!h.current||!b.current)return;let{regl:p,caps:v}=function(e={}){let{canvas:t=document.createElement("canvas"),preferWebGL2:r=!0,attributes:n={}}=e,u={alpha:!0,antialias:!1,depth:!1,stencil:!1,preserveDrawingBuffer:!1,...n},s=null,l=!1;if(r)try{(s=t.getContext("webgl2",u))&&(l=!0)}catch{}if(!s)try{(s=t.getContext("webgl",u))||(s=t.getContext("experimental-webgl",u))}catch{}if(!s)throw Error("WebGL is not supported in this browser");if(console.log(`[regl] Context: ${s.constructor.name}`),r&&!l)throw Error("WebGL2 was requested but only WebGL1 is available");let c=["OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear","EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float"];for(let e of c)try{s.getExtension(e)}catch{}let m=(0,a.default)({gl:s,optionalExtensions:c});m._gl!==s&&console.warn("[regl] WARNING: regl._gl !== gl passed to constructor"),console.log(`[regl] regl._gl: ${m._gl.constructor.name}`);let d=function(e,t){let r,n,a=function(e,t){let r=[];for(let n of t)i(e,n)&&r.push(n);return r}(e,["EXT_color_buffer_float","EXT_color_buffer_half_float","WEBGL_color_buffer_float","OES_texture_float","OES_texture_half_float","OES_texture_float_linear","OES_texture_half_float_linear"]),u=t||a.includes("OES_texture_float"),s=t||a.includes("OES_texture_half_float"),l=!1,c=!1;if(t)a.includes("EXT_color_buffer_float")&&(u&&o(e,t,"float")&&(l=!0),s&&o(e,t,"half float")&&(c=!0)),!c&&s&&a.includes("EXT_color_buffer_half_float")&&o(e,t,"half float")&&(c=!0);else u&&a.includes("WEBGL_color_buffer_float")&&o(e,t,"float")&&(l=!0),s&&a.includes("EXT_color_buffer_half_float")&&o(e,t,"half float")&&(c=!0);let m=!1,d=!1;if(t)d=s&&f(e,t,"half float"),a.includes("OES_texture_float_linear")&&(m=u&&f(e,t,"float"));else a.includes("OES_texture_float_linear")&&u&&(m=f(e,t,"float")),a.includes("OES_texture_half_float_linear")&&s&&(d=f(e,t,"half float"));return n="half float"==(r=t&&c?"half float":t&&l?"float":!t&&c?"half float":!t&&l?"float":"uint8")&&d||"float"===r&&m||"uint8"===r?"linear":"nearest",{isWebGL2:t,extensions:a,canTexFloat:u,canTexHalfFloat:s,canRTTFloat:l,canRTTHalfFloat:c,canLinearFloat:m,canLinearHalfFloat:d,chosenRTType:r,chosenFilterPolicy:n}}(s,l);return{regl:m,gl:s,canvas:t,caps:d}}({canvas:h.current,preferWebGL2:!0,attributes:{alpha:!0,antialias:!1,stencil:!1,depth:!1,preserveDrawingBuffer:!1}});t=v.isWebGL2?"WebGL2":"WebGL1",r=`RT: ${v.chosenRTType}`,c=`filter: ${v.chosenFilterPolicy}`,m=[],v.canRTTHalfFloat&&m.push("half"),v.canRTTFloat&&m.push("float"),0===m.length&&m.push("uint8-only"),d=[],v.canLinearHalfFloat&&d.push("half"),v.canLinearFloat&&d.push("float"),console.log(`[caps] ${t} | ${r} (${c}) | RTT: [${m.join(",")}] | Linear: [${d.join(",")||"uint8-only"}]`),console.log(`[caps] Extensions: ${v.extensions.join(", ")||"none"}`);let x=new n,w=new g(p,x,v,u);w.setAsciiEnabled(s);let A=e=>{let{clientX:t,clientY:r}=e,{innerWidth:n,innerHeight:a}=window;x.setMouse(t/n,r/a)};"contained"!==e?window.addEventListener("mousemove",A):b.current.addEventListener("mousemove",e=>{let t=b.current.getBoundingClientRect();x.setMouse((e.clientX-t.left)/t.width,(e.clientY-t.top)/t.height)});let T=()=>{if(!b.current||!h.current)return;let e=b.current.clientWidth,t=b.current.clientHeight,r=window.devicePixelRatio||1;h.current.width=e*r,h.current.height=t*r,p.poll(),w.resize(e*r,t*r)},_=new ResizeObserver(T);_.observe(b.current),T();let S=!1,E=performance.now(),k=0,O=()=>{if(S)return;let e=performance.now(),t=(e-E)/1e3;E=e,x.update(t),p.clear({color:[0,0,0,0],depth:1}),w.render(),k=requestAnimationFrame(O)};return y.current={regl:p,uniforms:x,pipeline:w,caps:v,rafId:k=requestAnimationFrame(O),observer:_},l&&l(),()=>{S=!0,cancelAnimationFrame(k),_.disconnect(),w.dispose(),p.destroy(),"contained"!==e&&window.removeEventListener("mousemove",A),y.current=null}},[]),(0,t.jsx)("div",{ref:b,style:(p={...m},"background"===e?{...p,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:-1,pointerEvents:"none"}:"overlay"===e?{...p,position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:50,pointerEvents:"none"}:{...p,position:"relative",width:"100%",height:"100%",overflow:"hidden"}),className:c,children:(0,t.jsx)("canvas",{ref:h,style:{width:"100%",height:"100%",display:"block"}})})});y.displayName="ShaderCanvas",e.s(["default",0,y],62524)}]);