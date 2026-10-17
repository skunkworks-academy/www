import fs from 'node:fs';
import {chromium} from 'playwright';

// Pre-release smoke for the Docusaurus learner experience: real mobile and
// desktop Chromium, real Academy chrome, responsive SVG assets and exercises.
const origin=process.env.SKW_STUDIO_TEST_ORIGIN || 'http://127.0.0.1:4178';
const slugs=['ai','cyber','it-support','microsoft-productivity','cloud'];
const browser=await chromium.launch({headless:true});
let count=0;
try {
 for(const viewport of [{width:390,height:844},{width:1280,height:900}]){
   const page=await browser.newPage({viewport,deviceScaleFactor:1});
   // Serve canonical production scripts from the checked-out main website, so
   // new web releases do not depend on network/CDN propagation during CI.
   for(const filename of ['skunkworks-ui.js','skunkworks-footer.js']){
     const body=fs.readFileSync('assets/'+filename,'utf8');
     await page.route('**/assets/'+filename+'*',route=>route.fulfill({
       status:200,contentType:'application/javascript',body
     }));
   }
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   for(const slug of slugs){
     for(const suffix of ['/','/modules/01/']){
       const route='/digital-platform-courses/beginner/'+slug+suffix;
       const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:30000});
       if(!response?.ok())throw Error(route+' returned HTTP '+response?.status());
       await page.locator('.swa-global-nav').waitFor({timeout:18000});
       await page.locator('.swa-global-footer').waitFor({timeout:18000});
       await page.locator('.studioHeroArt').scrollIntoViewIfNeeded();
       await page.waitForFunction(()=>{const img=document.querySelector('.studioHeroArt');return img instanceof HTMLImageElement && img.complete && img.naturalWidth>0;},{timeout:12000});
       const state=await page.evaluate(()=>{
         const nav=document.querySelectorAll('.swa-global-nav').length;
         const footer=document.querySelectorAll('.swa-global-footer').length;
         const visibleNav=document.querySelector('.swa-global-nav')?.getBoundingClientRect().height || 0;
         const image=document.querySelector('.studioHeroArt, .studioCourseCover');
         const imgOk=image instanceof HTMLImageElement && image.complete && image.naturalWidth>0;
         return {nav,footer,visibleNav,imgOk,bodyWidth:document.body.scrollWidth,
           screenWidth:window.innerWidth,studio:document.querySelectorAll('.studio').length,
           oldLoader:document.querySelectorAll('script[src*="academy-navigation.js"]').length};
       });
       if(state.nav!==1||state.footer!==1)throw Error(route+' missing/duplicate Academy header-footer: '+JSON.stringify(state));
       if(state.visibleNav<50)throw Error(route+' Academy navigation not visible');
       if(state.oldLoader)throw Error(route+' loads legacy DOM-mutating shell');
       if(!state.imgOk)throw Error(route+' illustrated course visual did not render');
       if(state.bodyWidth>state.screenWidth+2)throw Error(route+' horizontal overflow at '+viewport.width+': '+JSON.stringify(state));
       if(!state.studio)throw Error(route+' missing visual learning studio');
       if(suffix.includes('modules')){
         const flip=page.locator('.studioFlip').first();
         await flip.waitFor({timeout:10000});
         await flip.click();
         if(await flip.getAttribute('aria-pressed')!=='true')throw Error(route+' concept flip did not reveal');
         await page.locator('.studioChoice').first().click();
         await page.locator('.studioFeedback').waitFor({timeout:5000});
       }
       if(errors.length)throw Error(route+' runtime errors: '+errors.join(' | '));
       count++;
     }
   }
   await page.close();
 }
} finally {await browser.close();}
console.log('Academy beginner visual experience passed '+count+' desktop/mobile course page loads, shared chrome, diagrams, interactive flip cards and scenarios.');
