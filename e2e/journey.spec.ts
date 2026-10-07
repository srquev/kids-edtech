import { expect, Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function onboard(page:Page,name='Sunny'):Promise<void>{await page.goto('/');await page.getByRole('button',{name:'Let’s get started'}).click();await page.getByRole('textbox').fill(name);await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'Start my adventure'}).click();await expect(page.getByRole('heading',{name:`Hello, ${name}!`})).toBeVisible();}
async function gate(page:Page):Promise<void>{await page.goto('/parent');const challenge=await page.locator('.challenge').innerText();const numbers=challenge.match(/\d+/g)?.map(Number)??[];await page.getByRole('spinbutton').fill(String(numbers[0]*numbers[1]));await page.getByRole('button',{name:'Enter Parent Zone'}).click();await expect(page.getByRole('heading',{name:'A window into their world'})).toBeVisible();}
test('complete learning flow, gentle retry, stars and persisted progress',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await onboard(page);await page.locator('app-category-card').filter({hasText:'Animals'}).click();await page.getByRole('link',{name:'Elephant',exact:false}).click();await page.getByRole('button',{name:'Listen again'}).click();await page.getByRole('link',{name:'Let’s find it!'}).click();await expect(page.getByRole('heading',{name:'Can you find Elephant?'})).toBeVisible();const wrong=page.locator('.answer-card').filter({hasNotText:'Elephant'}).first();await wrong.click();await expect(page.getByText('Almost! Let’s try again.')).toBeVisible();await page.getByRole('button',{name:'Elephant',exact:true}).click();await expect(page.locator('.feedback')).toHaveText('You found it! Wonderful!');await page.reload();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('1');await gate(page);await expect(page.locator('.category-progress-row').filter({hasText:'Animals'})).toContainText('1 / 16');await expect(page.locator('.stats-grid .panel').nth(2).locator('strong')).toHaveText('0');expect(errors).toEqual([]);
});
test('English and Hindi profile preferences, protected settings and profile isolation',async({page})=>{
 await onboard(page);await page.goto('/parent/settings');await expect(page.getByRole('heading',{name:'Hello, grown-up!'})).toBeVisible();await gate(page);await page.getByRole('link',{name:'Little learners',exact:true}).click();await page.getByRole('link',{name:'Add a little learner'}).click();await page.getByRole('textbox').fill('Tara');await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'हिन्दी',exact:true}).click();await page.getByRole('button',{name:'मेरा सफ़र शुरू करें'}).click();await expect(page.getByRole('heading',{name:'नमस्ते, Tara!'})).toBeVisible();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','hi');await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'हाथी',exact:true})).toBeVisible();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('0');
});
test('all four games can finish and memory pairs are accessible',async({page})=>{
 await onboard(page);
 for(const kind of ['find-it','match','count']){
  await page.goto('/play/'+kind);
  for(let n=0;n<5;n++){
   await expect(page.locator('.game-position')).toHaveText(`Activity ${n+1} of 5`);
   const options=page.locator('.answer-card');
   await expect(options.first()).toBeEnabled();
   if(kind==='find-it'){
    const prompt=await page.locator('.game-prompt').innerText();
    const answer=prompt.replace('Can you find ','').replace('?','');
    await page.getByRole('button',{name:answer,exact:true}).click();
   }else if(kind==='count'){
    const number=await page.locator('.count-objects>span').count();
    await page.getByRole('button',{name:String(number),exact:true}).click();
   }else{
    const symbol=await page.locator('.match-target app-item-art').innerText();
    await options.filter({hasText:symbol}).click();
   }
   await expect(page.locator('.feedback')).toHaveText('You found it! Wonderful!');
   await page.getByRole('button',{name:'Keep exploring'}).click();
  }
  await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();
 }
 await page.goto('/play/memory');
 const cards=page.locator('.memory-card');
 await expect(cards).toHaveCount(4);
 const labels:string[]=[];
 for(let n=0;n<4;n+=2){
  for(const index of [n,n+1]){
   await cards.nth(index).click();
   if(await page.locator('.result').count())break;
   await expect(cards.nth(index)).toHaveClass(/face-up/);
   labels[index]=await cards.nth(index).getAttribute('aria-label')??'';
  }
  if(await page.locator('.result').count())break;
  await page.waitForTimeout(1300);
 }
 if(!(await page.locator('.result').count())){
  const pairs=new Map<string,number[]>();
  labels.forEach((label,index)=>pairs.set(label,[...(pairs.get(label)??[]),index]));
  for(const pair of pairs.values()){
   if(pair.length!==2 || await cards.nth(pair[0]).isDisabled())continue;
   await cards.nth(pair[0]).click();
   await expect(cards.nth(pair[0])).toHaveClass(/face-up/);
   await cards.nth(pair[1]).click();
  }
 }
 await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();
});
test('offline reload reaches uncached routes and Hindi content',async({page,context})=>{
 await onboard(page);await page.evaluate(async()=>{const registration=await navigator.serviceWorker.ready;if(!registration.active)throw new Error('No active service worker');});await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.goto('/learn/fruits');await expect(page.locator('a[href="/learn/fruits/apple"]')).toBeVisible();await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'Elephant',exact:true})).toBeVisible();await expect(page.getByText('You’re offline. Let’s keep learning!')).toBeVisible();const hi=await page.evaluate(async()=>{const r=await fetch('/assets/content/hi/animals.json');return r.ok;});expect(hi).toBe(true);
});
test('responsive layouts, keyboard access and accessibility',async({page},testInfo)=>{
 await onboard(page);for(const route of ['/','/learn','/learn/animals','/learn/animals/elephant','/play','/play/find-it','/rewards','/parent/gate','/trace']){await page.goto(route);await expect(page.locator('main h1').first()).toBeVisible();await page.waitForTimeout(400);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),`${route}: ${JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}await page.goto('/');await page.screenshot({path:`test-results/home-${testInfo.project.name}.png`,fullPage:true});if(testInfo.project.name==='mobile'){await page.setViewportSize({width:320,height:720});await page.screenshot({path:'test-results/home-320.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
});
