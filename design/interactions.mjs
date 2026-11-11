import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
for(const port of [8795,8796]) {
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.goto(`http://127.0.0.1:${port}/_sandbox`);await page.waitForTimeout(1200); const f=page.frames()[1];
 if(port===8795){const about=f.getByRole('button',{name:'About',exact:true});for(let i=0;i<3;i++){await about.click();assert.equal(await about.getAttribute('aria-expanded'),'true');await about.click();assert.equal(await about.getAttribute('aria-expanded'),'false');} const ascii=f.getByRole('button',{name:'ASCII: Off'});await ascii.focus();await page.keyboard.press('Space');assert.equal(await f.getByRole('button',{name:'ASCII: On'}).count(),1);await f.locator('#sketch-select').selectOption('voronoi');assert.equal(await f.locator('#sketch-select').inputValue(),'voronoi');await page.reload();await page.waitForTimeout(1200);assert.equal(await page.frames()[1].locator('#sketch-select').inputValue(),'ripple');}
 else {for(let i=0;i<3;i++){await f.locator('#seed').fill('73');await f.locator('#regenerate').click();await f.locator('#seed').fill('39');await f.locator('#regenerate').click();} await f.locator('#pause').focus();await page.keyboard.press('Space');assert.equal(await f.locator('#pause').isChecked(),false);await f.locator('#model').selectOption('legacy');await f.locator('#quality').selectOption('high');await page.waitForTimeout(1000); console.log('Cloud native status:',await f.locator('#status').innerText());await page.reload();await page.waitForTimeout(1200);assert.equal(await page.frames()[1].locator('#seed').inputValue(),'39');}
 console.log(port,'keyboard, repeated controls and reload reset passed');await page.close();
}
for(const port of [8795,8796]) for(const path of ['/.git/config','/package.json','/design/source-hashes.json']) assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status>=400,true);
await browser.close();
