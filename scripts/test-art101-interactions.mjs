import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

// After the Docusaurus navbar fix, validate the full rendered controls.
const lazyChunk='assets/js/17896441.89204aaf.js';
if (fs.existsSync(lazyChunk)) {
 const source=fs.readFileSync(lazyChunk,'utf8');
 const matches=[...source.matchAll(/clientHeight/g)].slice(0,8).map(m=>source.slice(Math.max(0,m.index-230),m.index+180));
 console.log('ART101 chunk clientHeight contexts:',JSON.stringify(matches));
}
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const page = await browser.newPage({viewport:{width:390,height:844},permissions:['microphone']});
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('console',msg=>{if(msg.type()==='error') errors.push(msg.text());});
try {
  await page.addInitScript(() => {
    navigator.mediaDevices.getUserMedia = async () => {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const destination = context.createMediaStreamDestination();
      oscillator.connect(destination);
      oscillator.start();
      window.__art101AudioFixture = {context,oscillator};
      return destination.stream;
    };
  });
  await page.goto('http://127.0.0.1:4175/courses/professional-articulation',{waitUntil:'networkidle',timeout:45000});
  const lab=page.locator('section[aria-labelledby="dino-lab-heading"]');
  console.log('ART101 diagnostics:', JSON.stringify({url:page.url(),title:await page.title(),labCount:await lab.count(),body:(await page.locator('body').innerText()).slice(0,800),errors}));
  await lab.getByRole('button',{name:/Triceratops number clarity/}).click({timeout:6000});
  await page.waitForTimeout(400);
  if (!(await lab.locator('#art101-active-challenge h3').innerText()).includes('Triceratops')) { const scripts=await page.locator('script[src]').evaluateAll(nodes=>nodes.map(n=>n.src)); const status=await page.evaluate(()=>({ready:document.readyState,path:location.pathname,webpack:!!window.webpackChunkdocusaurus})); throw Error('challenge click did not update prompt; scripts='+JSON.stringify(scripts)+'; state='+JSON.stringify(status)+'; browser errors='+JSON.stringify(errors)); }
  await lab.getByRole('button',{name:'Show delivery guide'}).click();
  if (!(await lab.getByRole('button',{name:'Hide delivery guide'}).isVisible())) throw Error('guide not expanded');
  await lab.getByRole('button',{name:'Mark challenge completed'}).click();
  if (!(await lab.getByText('1 of 6 challenges completed this session').isVisible())) throw Error('progress did not update');
  await lab.getByRole('button',{name:'Baseline recording'}).click();
  await lab.getByLabel('Intelligibility').selectOption('4');
  await lab.getByRole('button',{name:'Final recording'}).click();
  await lab.getByLabel('Intelligibility').selectOption('5');
  await lab.getByRole('button',{name:'Play example'}).click();
  if (await lab.getByRole('button',{name:'Stop example'}).isEnabled()) await lab.getByRole('button',{name:'Stop example'}).click();
  await lab.getByRole('button',{name:'Start recording'}).click();
  await lab.getByRole('button',{name:'Stop recording'}).waitFor({state:'visible',timeout:8000});
  await page.waitForTimeout(1100);
  await lab.getByRole('button',{name:'Stop recording'}).click();
  await lab.locator('audio[controls]').waitFor({state:'visible',timeout:10000});
  await lab.getByRole('button',{name:'Export practice record'}).click();
  await lab.getByRole('button',{name:'Export progress record (JSON)'}).click();
  if (errors.some(msg=>/Loading chunk|Cannot read properties|Uncaught TypeError|This page crashed/i.test(msg))) throw Error('Fatal browser errors: '+errors.join(' | '));
  console.log('ART-101 live browser interaction test passed: selection, guide, progress, rating, reference audio, recording, replay, export.');
} finally {await browser.close();}
