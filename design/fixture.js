const fixture = new URLSearchParams(location.search).get('fixture');
// Wait for React hydration, then use the original controls without replacing markup.
addEventListener('load',()=>setTimeout(()=>{
 const select=document.querySelector('#sketch-select'); if(!select) {document.documentElement.dataset.fixtureReady='true';return;}
 if(fixture && !['ascii','about'].includes(fixture)) { select.value=fixture; select.dispatchEvent(new Event('change',{bubbles:true})); }
 setTimeout(()=>{ if(fixture==='ascii') [...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('ASCII:'))?.click();
 if(fixture && fixture!=='ascii') [...document.querySelectorAll('button')].find(b=>b.textContent==='About')?.click(); document.documentElement.dataset.fixtureReady='true'; },150);
},350));
