import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const shader = "shader-shed" === 'shader-shed';
const port = Number(process.env.PORT || 8795);
const types = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.md':'text/plain'};
createServer(async (req,res) => {
 try {
  if (!['GET','HEAD'].includes(req.method)) return res.writeHead(405).end();
  const u = new URL(req.url,'http://localhost'); const path = decodeURIComponent(u.pathname);
  if (path.split('/').some(p=>p.startsWith('.'))) return res.writeHead(403).end();
  let body, file;
  if(path === '/_sandbox') { body = `<iframe title="Source preview" sandbox="allow-scripts" src="${['/','/slideshow/','/slideshow-ascii/'].includes(u.searchParams.get('route'))?u.searchParams.get('route'):'/'}?${u.searchParams}" style="position:fixed;inset:0;width:100%;height:100%;border:0"></iframe>`; file='test.html'; }
  else {
   const allowed = shader ? /^(?:\/(?:slideshow(?:-ascii)?\/)?|\/_next\/static\/[^?]+|\/design\/(?:fixture.js|theme.mjs|theme-adapter.mjs))$/ : /^(?:\/|\/demo\/(?:index.html|main.js|style.css)|\/src\/[a-z0-9-]+\.js|\/node_modules\/three\/(?:build\/three.module.js|examples\/jsm\/controls\/OrbitControls.js)|\/(?:README|CREDITS)\.md|\/docs\/[A-Z-]+\.md|\/design\/(?:fixture.js|theme.mjs|theme-adapter.mjs))$/;
   if(!allowed.test(path)) return res.writeHead(404).end();
   let rel = path === '/' ? (shader?'out/index.html':'demo/index.html') : path.slice(1);
   if(shader && !path.startsWith('/design/') && path !== '/') rel='out/'+rel+(path.endsWith('/')?'index.html':'');
   file = await realpath(resolve(root,rel)); if(!file.startsWith(root+sep) && !file.startsWith(root)) return res.writeHead(403).end();
   body = await readFile(file);
   if(file.endsWith('.html')) body=body.toString().replace('</head>','<script defer src="/design/fixture.js"></script><script type="module" src="/design/theme.mjs"></script></head>');
  }
  res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Access-Control-Allow-Origin':'*','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self'; worker-src 'self' blob:; frame-src 'self'"}); res.end(req.method==='HEAD'?undefined:body);
 } catch { res.writeHead(404).end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`Local catalog: http://127.0.0.1:${port}`));
