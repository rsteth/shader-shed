import { installThemeAdapter } from './theme-adapter.mjs';
const dispose=installThemeAdapter(async theme=>{
 if(document.readyState !== 'complete') await new Promise(resolve=>addEventListener('load',resolve,{once:true}));
 const target=document.body;
 const style=getComputedStyle(target);
 if(theme!=='dark'||style.colorScheme!=='dark'||style.backgroundColor!=="rgb(0, 0, 0)") throw new Error('Native palette does not match');
}, {themes:['dark']});
addEventListener('pagehide',dispose,{once:true});
