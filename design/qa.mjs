import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for(const [app,port] of [['shader-shed',8795],['three-planet-clouds',8796]]) {
 const root=new URL(`../../${app}/design/`,import.meta.url); const catalog=JSON.parse(await readFile(new URL('collection.json',root)));
 for(const mobile of [false,true]) for(const sandbox of [false,true]) {
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:800},colorScheme:mobile?'light':'dark'});
  const page=await context.newPage();
  for(const fixture of catalog.fixtures){
   const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
   const url=new URL(fixture.url); if(sandbox) {url.searchParams.set('route',url.pathname);url.pathname='/_sandbox';}
   await page.goto(url.href); await page.waitForTimeout(1100);
   const frame=sandbox?page.frames()[1]:page.mainFrame();
   const state=await frame.evaluate(()=>({ready:document.documentElement.dataset.fixtureReady,canvas:!!document.querySelector('canvas'),text:document.body.innerText.slice(-1600),select:document.querySelector('#sketch-select')?.value,about:!!document.querySelector('#sketch-about-panel'),ascii:[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('ASCII:'))?.textContent}));
   report.push({app,mobile,sandbox,id:fixture.id,...state,errors:[...new Set(errors)]});
   if(fixture.id==='about'||fixture.id==='diagnostics') {await mkdir(new URL('evidence/',root),{recursive:true});await page.screenshot({path:new URL(`evidence/${fixture.id}-${mobile?'mobile':'desktop'}-${sandbox?'sandbox':'direct'}.png`,root).pathname});}
   page.removeAllListeners('pageerror');
  }
  await context.close();
 }
}
await browser.close();
await writeFile(new URL('qa-results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report.map(({app,id,mobile,sandbox,canvas,ready,errors})=>({app,id,mobile,sandbox,canvas,ready,errors})),null,2));
