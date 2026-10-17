import fs from 'node:fs';
import {chromium} from 'playwright';

/**
 * Real Chromium conformance checks against the final Academy-composed site.
 * Every one of the five courses has 16 independent learning pages. Test each
 * page at mobile and desktop widths, not only the introductory pages.
 */
const origin=process.env.SKW_STUDIO_TEST_ORIGIN || 'http://127.0.0.1:4178';
const slugs=['ai','cyber','it-support','microsoft-productivity','cloud'];
const modules=Array.from({length:6},(_,i)=>'/modules/'+String(i+1).padStart(2,'0')+'/');
const labs=Array.from({length:3},(_,i)=>'/labs/lab-'+String(i+1).padStart(2,'0')+'/');
const paths=['/','/course-guide/',...modules,...labs,
  '/assessment/knowledge-check/','/assessment/capstone/','/assessment/rubric/','/references/','/assessment/completion/'];
if(paths.length!==16)throw Error('A course no longer has the required 16 pages');
const browser=await chromium.launch({headless:true});
let checked=0,actions=0,assessments=0;
function assert(ok,message){if(!ok)throw Error(message)}
async function hasVisible(locator){return (await locator.count())>0 && await locator.first().isVisible()}
async function checkHome(page,slug){
 const diag=page.locator('.skillsDiagnostic');
 assert(await hasVisible(diag),'Missing before/after diagnostic '+slug);
 await diag.locator('.diagnosticSubmit').click();
 assert((await diag.locator('[role="status"]').last().textContent())?.includes('Answer all five'),'Empty diagnostic accepted '+slug);
 const items=diag.locator('.diagnosticQuestion');
 assert(await items.count()===5,'Missing five diagnostic questions '+slug);
 for(let n=0;n<5;n++)await items.nth(n).locator('input[type="radio"]').first().check();
 await diag.locator('.diagnosticSubmit').click();
 assert(await diag.locator('.diagnosticFeedback').count()===5,'Diagnostic explanations missing after scoring '+slug);
 await diag.getByRole('button',{name:'After learning'}).click();
 assert(await diag.locator('.diagnosticFeedback').count()===0,'Previous diagnostic answer leaked into a fresh phase '+slug);
 const progress=page.locator('.courseProgress');
 assert(await hasVisible(progress),'Missing learner progress '+slug);
 await progress.locator('.progressItems input[type="checkbox"]').first().check();
 const v=await progress.locator('progress').getAttribute('value');
 assert(v==='1','Learner progress checkbox did not update '+slug);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('.courseProgress').waitFor();
 await page.locator('.courseProgress .progressItems input').first().waitFor();
 await page.waitForFunction(()=>document.querySelector('.courseProgress progress')?.getAttribute('value')==='1');
 assert(await page.locator('.progressItems input').first().isChecked(),'Course progress did not persist on refresh '+slug);
 await page.getByRole('button',{name:'Reset progress'}).click();
 await page.getByRole('button',{name:'Confirm reset'}).click();
 assert((await page.locator('.courseProgress progress').getAttribute('value'))==='0','Course progress did not reset '+slug);
 actions+=14;
}
async function checkQuiz(page,slug){
 const quiz=page.locator('.masteryQuiz');
 assert(await hasVisible(quiz),'Missing 12-question assessment '+slug);
 await quiz.getByRole('button',{name:'Score my attempt'}).click();
 assert((await quiz.locator('[role="status"]').last().textContent())?.includes('remaining'),
   'Quiz allowed incomplete answers '+slug);
 const questions=quiz.locator('.masteryQuestion');
 assert(await questions.count()===12,'Unexpected assessment question count '+slug);
 for(let n=0;n<12;n++)await questions.nth(n).locator('input[type="radio"]').first().check();
 await quiz.getByRole('button',{name:'Score my attempt'}).click();
 assert(await quiz.locator('.masteryFeedback').count()===12,'Quiz did not show answer explanations '+slug);
 assert((await quiz.locator('.masteryActions').textContent())?.includes('Result:'),'Quiz score not calculated '+slug);
 await quiz.getByRole('button',{name:'Try again'}).click();
 assert(await quiz.locator('.masteryFeedback').count()===0,'Quiz reset retained answers '+slug);
 assert((await quiz.locator('progress').getAttribute('value'))==='0','Quiz reset retained progress '+slug);
 assessments++;actions+=19;
}
async function checkWorkbook(page,slug,path,full){
 const book=page.locator('#page-workbook');
 assert(await hasVisible(book),'Missing page workbook '+slug+path);
 assert(await book.locator('.workbookChecks input[type="checkbox"]').count()===3,'Incomplete practical checklist '+slug+path);
 const first=book.locator('.workbookChecks input').first();
 await first.check();
 assert(await first.isChecked(),'Workbook checklist failed '+slug+path);
 const field=book.locator('textarea').first();
 await field.fill('Fictional practice observation: I followed the task, compared expected and actual results, and identified a limitation.');
 await book.getByRole('button',{name:'Save my notes'}).click();
 assert((await book.locator('.workbookStatus').textContent())?.length>3,'Save produced no feedback '+slug+path);
 await book.getByRole('button',{name:'Copy blank evidence template'}).click();
 await page.waitForFunction(()=>{
   const msg=document.querySelector('#page-workbook .workbookStatus')?.textContent||'';
   return msg.includes('copied')||msg.includes('Clipboard access was blocked');
 },null,{timeout:7000});
 if(full){
   await page.reload({waitUntil:'domcontentloaded'});
   const b=page.locator('#page-workbook');await b.waitFor();
   await page.waitForFunction(()=>document.querySelector('#page-workbook textarea')?.value?.includes('Fictional practice observation'));
   assert(await b.locator('.workbookChecks input').first().isChecked(),'Workbook checklist did not persist '+slug+path);
   await b.getByRole('button',{name:'Clear saved work'}).click();
   assert(await b.getByRole('button',{name:'Cancel clear'}).isVisible(),'Workbook clear did not require confirmation '+slug+path);
   await b.getByRole('button',{name:'Cancel clear'}).click();
   assert((await b.locator('textarea').first().inputValue()).length>0,'Cancel incorrectly cleared notes '+slug+path);
   await b.getByRole('button',{name:'Clear saved work'}).click();
   await b.getByRole('button',{name:'Confirm clear saved work'}).click();
   assert((await b.locator('textarea').first().inputValue())==='','Workbook notes did not clear '+slug+path);
   assert(!(await b.locator('.workbookChecks input').first().isChecked()),'Workbook checklist did not clear '+slug+path);
   actions+=8;
 }
 actions+=4;
}
async function checkStudio(page,slug,path){
 const studio=page.locator('#learning-studio');
 assert(await hasVisible(studio),'Missing interactive visual studio '+slug+path);
 const card=studio.locator('.studioFlip').first();
 await card.focus();
 await page.keyboard.press('Enter');
 assert((await card.getAttribute('aria-pressed'))==='true','Keyboard flip-card reveal failed '+slug+path);
 await page.keyboard.press('Space');
 assert((await card.getAttribute('aria-pressed'))==='false','Keyboard flip-card hide failed '+slug+path);
 const approach=studio.locator('button[aria-expanded]').first();
 await approach.click();
 assert(await approach.getAttribute('aria-expanded')==='true','Worked example did not expand '+slug+path);
 assert(await studio.locator('.studioEvidence').count()===1,'Expanded worked example missing '+slug+path);
 await approach.click();
 assert(await approach.getAttribute('aria-expanded')==='false','Worked example did not collapse '+slug+path);
 const choice=studio.locator('.studioChoice').first();
 await choice.click();
 assert((await choice.getAttribute('aria-pressed'))==='true','Scenario option not selected '+slug+path);
 assert(await hasVisible(studio.locator('.studioFeedback')),'Scenario feedback missing '+slug+path);
 await studio.getByRole('button',{name:'Reset this activity'}).click();
 assert(await studio.locator('.studioFeedback').count()===0,'Reset did not clear scenario feedback '+slug+path);
 assert(await choice.getAttribute('aria-pressed')==='false','Reset did not clear selected answer '+slug+path);
 actions+=7;
}
try {
 for(const viewport of [{width:390,height:844},{width:1280,height:900}]){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  for(const filename of ['skunkworks-ui.js','skunkworks-footer.js']){
   const body=fs.readFileSync('assets/'+filename,'utf8');
   await page.route('**/assets/'+filename+'*',route=>route.fulfill({status:200,contentType:'application/javascript',body}));
  }
  let errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const slug of slugs){
   for(const path of paths){
    const route='/digital-platform-courses/beginner/'+slug+path;
    errors=[];
    const response=await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:35000});
    assert(response?.ok(),route+' returned HTTP '+response?.status());
    await page.locator('.swa-global-nav').waitFor({timeout:20000});
    await page.locator('.swa-global-footer').waitFor({timeout:20000});
    if(path==='/assessment/completion/'){
      const end=page.locator('#course-completion');
      await end.waitFor({timeout:20000});
      assert(await page.locator('.swa-global-nav').count()===1,'Missing Academy header on completion '+route);
      assert(await page.locator('.swa-global-footer').count()===1,'Missing Academy footer on completion '+route);
      assert(await page.locator('#learning-studio').count()===0,'The finished course should not append another learning drill '+route);
      assert(await page.locator('#page-workbook').count()===0,'The finished course should not append another workbook '+route);
      assert(await page.locator('.pagination-nav__link--next').count()===0,'Completion must not navigate into another course '+route);
      assert(await end.locator('a[href*="/beginner/"]').count()>0,'Missing return to beginners catalogue '+route);
      const portal=end.locator('a[href*="portal.skunkworksacademy.com/?certificate="]').first();
      assert(await portal.count()===1,'Missing verified awards portal link '+route);
      assert((await portal.getAttribute('href'))?.includes('certificate=SKW-BEG-'),'Incorrect certificate portal course ID '+route);
      assert((await page.locator('body').evaluate(el=>el.scrollWidth))<=viewport.width+2,'Horizontal overflow on completion '+route);
      if(errors.length)throw Error(route+' runtime errors: '+errors.join(' | '));
      actions+=6;checked++;continue;
    }
    await page.locator('#learning-studio').waitFor({timeout:20000});
    await page.locator('#page-workbook').waitFor({timeout:20000});
    const links=page.locator('.learningPageJumps a');
    assert(await links.count()===2,'Missing page interaction shortcut links '+route);
    const sameOrigin=await page.evaluate(()=>{
     const nav=document.querySelectorAll('.swa-global-nav').length;
     const footer=document.querySelectorAll('.swa-global-footer').length;
     return {nav,footer,legacy:document.querySelectorAll('script[src*="academy-navigation.js"]').length,
       width:document.documentElement.scrollWidth,screen:innerWidth,
       brandVisible:(document.querySelector('.swa-global-nav')?.getBoundingClientRect().height||0)>=50};
    });
    assert(sameOrigin.nav===1&&sameOrigin.footer===1&&sameOrigin.brandVisible,route+' global Academy header/footer invalid '+JSON.stringify(sameOrigin));
    assert(sameOrigin.legacy===0,route+' loads mutation-heavy legacy navigation');
    assert(sameOrigin.width<=sameOrigin.screen+2,route+' horizontal page overflow '+JSON.stringify(sameOrigin));
    await links.first().click();
    assert(await page.evaluate(()=>location.hash)==='#learning-studio','Practice shortcut not working '+route);
    await links.last().click();
    assert(await page.evaluate(()=>location.hash)==='#page-workbook','Workbook shortcut not working '+route);
    await page.locator('.studioHeroArt').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const img=document.querySelector('.studioHeroArt');return img instanceof HTMLImageElement && img.complete && img.naturalWidth>0;},null,{timeout:15000});
    await checkStudio(page,slug,path);
    await checkWorkbook(page,slug,path,path==='/course-guide/');
    if(path==='/')await checkHome(page,slug);
    if(path==='/assessment/knowledge-check/')await checkQuiz(page,slug);
    if(path.startsWith('/modules/')){
      const details=page.locator('details summary').first();
      if(await details.count()){await details.click();assert(await details.evaluate(el=>el.parentElement?.hasAttribute('open')),'Module self-check did not expand '+route);actions++;}
    }
    assert(errors.length===0,route+' JavaScript error(s): '+errors.join(' | '));
    checked++;
   }
  }
  await context.close();
 }
} finally {await browser.close();}
console.log('Beginner interactive conformance passed: '+checked+' live-style page loads (80 pages × mobile and desktop), '+actions+' user actions, '+assessments+' graded-formative quiz attempts, Academy global chrome, local persistence and responsive diagrams.');
