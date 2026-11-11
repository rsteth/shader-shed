import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const port of [8795,8796]){
 const page=await browser.newPage(); await page.goto(`http://127.0.0.1:${port}/_sandbox`); await page.waitForTimeout(1200);
 const result=await page.evaluate(()=>new Promise(resolve=>{const responses=[];const listener=e=>{if(e.data.type==='workbench:theme-applied')responses.push(e.data);};addEventListener('message',listener);const f=document.querySelector('iframe').contentWindow;f.postMessage({type:'workbench:set-theme',theme:'dark',requestId:'nonce-verified-42'},'*');f.postMessage({type:'workbench:set-theme',theme:'light',requestId:'reject-light'},'*');f.postMessage({type:'workbench:set-theme',theme:'dark'},'*');setTimeout(()=>{removeEventListener('message',listener);resolve(responses)},500);}));
 assert.deepEqual(result,[{type:'workbench:theme-applied',theme:'dark',requestId:'nonce-verified-42'}]);console.log(port,'native dark confirmed with nonce; unsupported theme and missing nonce rejected');await page.close();
}
await browser.close();
