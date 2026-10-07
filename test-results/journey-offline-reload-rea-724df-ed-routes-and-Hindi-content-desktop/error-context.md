# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> offline reload reaches uncached routes and Hindi content
- Location: e2e/journey.spec.ts:16:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Apple' })
Expected: visible
Error: strict mode violation: getByRole('link', { name: 'Apple' }) resolved to 2 elements:
    1) <a class="item-card panel" _ngcontent-ng-c40913609="" href="/learn/fruits/apple">…</a> aka getByRole('link', { name: '🍎 Apple' })
    2) <a class="item-card panel" _ngcontent-ng-c40913609="" href="/learn/fruits/pineapple">…</a> aka getByRole('link', { name: '🍍 Pineapple' })

Call log:
  - Expect "toBeVisible" getByRole('link', { name: 'Apple' }) with timeout 10000ms
  - waiting for getByRole('link', { name: 'Apple' })

```

# Page snapshot

```yaml
- generic [ref=f2e2]:
  - link "Skip to learning" [ref=f2e3] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=f2e4]:
    - link "TinySteps" [ref=f2e5] [cursor=pointer]:
      - /url: /
      - generic [ref=f2e6]:
        - text: TinySteps
        - generic [ref=f2e7]: Play • Listen • Learn
    - navigation "TinySteps" [ref=f2e8]:
      - link "Home" [ref=f2e9] [cursor=pointer]:
        - /url: /
      - link "Learn" [ref=f2e14] [cursor=pointer]:
        - /url: /learn
      - link "Play" [ref=f2e19] [cursor=pointer]:
        - /url: /play
      - link "Trace" [ref=f2e24] [cursor=pointer]:
        - /url: /trace
      - link "My treasures" [ref=f2e29] [cursor=pointer]:
        - /url: /rewards
    - generic [ref=f2e34]:
      - generic [ref=f2e35]:
        - paragraph [ref=f2e36]: Made for curious little minds
        - text: No ads. No rush. Just discovery.
      - link "Parent Zone" [ref=f2e37] [cursor=pointer]:
        - /url: /parent
        - text: Parent Zone
        - generic [aria-hidden] [ref=f2e40]: ↗
  - generic [ref=f2e41]:
    - banner [ref=f2e42]:
      - generic [ref=f2e43]: Play • Listen • Learn
      - generic [ref=f2e44]:
        - generic [ref=f2e45]: EN
        - button "Sound off" [ref=f2e46] [cursor=pointer]
        - link "0 stars" [ref=f2e49] [cursor=pointer]:
          - /url: /rewards
          - generic [aria-hidden] [ref=f2e50]: ★
          - text: "0"
          - generic [ref=f2e51]: stars
        - link "Parent Zone" [ref=f2e52] [cursor=pointer]:
          - /url: /parent
          - generic [aria-hidden] [ref=f2e53]: 🐻
          - generic [ref=f2e54]: Sunny
          - generic [aria-hidden] [ref=f2e55]: ⌄
    - main [active] [ref=f2e56]:
      - status [ref=f2e57]: You’re offline. Let’s keep learning!
      - generic [ref=f2e59]:
        - link "Learn" [ref=f2e60] [cursor=pointer]:
          - /url: /learn
          - generic [aria-hidden] [ref=f2e61]: ←
          - text: Learn
        - generic [ref=f2e63]:
          - heading "Fruits" [level=1] [ref=f2e64]
          - paragraph [ref=f2e65]: 10 little discoveries · Tap a picture. Hear something new.
        - generic [ref=f2e66]:
          - link "🍎 Apple" [ref=f2e67] [cursor=pointer]:
            - /url: /learn/fruits/apple
            - generic [ref=f2e68]: 🍎
            - strong [ref=f2e71]: Apple
            - generic [aria-hidden] [ref=f2e72]: ♪
          - link "🍌 Banana" [ref=f2e73] [cursor=pointer]:
            - /url: /learn/fruits/banana
            - generic [ref=f2e74]: 🍌
            - strong [ref=f2e77]: Banana
            - generic [aria-hidden] [ref=f2e78]: ♪
          - link "🍇 Grapes" [ref=f2e79] [cursor=pointer]:
            - /url: /learn/fruits/grapes
            - generic [ref=f2e80]: 🍇
            - strong [ref=f2e83]: Grapes
            - generic [aria-hidden] [ref=f2e84]: ♪
          - link "🍊 Orange" [ref=f2e85] [cursor=pointer]:
            - /url: /learn/fruits/orange
            - generic [ref=f2e86]: 🍊
            - strong [ref=f2e89]: Orange
            - generic [aria-hidden] [ref=f2e90]: ♪
          - link "🍓 Strawberry" [ref=f2e91] [cursor=pointer]:
            - /url: /learn/fruits/strawberry
            - generic [ref=f2e92]: 🍓
            - strong [ref=f2e95]: Strawberry
            - generic [aria-hidden] [ref=f2e96]: ♪
          - link "🍉 Watermelon" [ref=f2e97] [cursor=pointer]:
            - /url: /learn/fruits/watermelon
            - generic [ref=f2e98]: 🍉
            - strong [ref=f2e101]: Watermelon
            - generic [aria-hidden] [ref=f2e102]: ♪
          - link "🍍 Pineapple" [ref=f2e103] [cursor=pointer]:
            - /url: /learn/fruits/pineapple
            - generic [ref=f2e104]: 🍍
            - strong [ref=f2e107]: Pineapple
            - generic [aria-hidden] [ref=f2e108]: ♪
          - link "🥭 Mango" [ref=f2e109] [cursor=pointer]:
            - /url: /learn/fruits/mango
            - generic [ref=f2e110]: 🥭
            - strong [ref=f2e113]: Mango
            - generic [aria-hidden] [ref=f2e114]: ♪
          - link "🍐 Pear" [ref=f2e115] [cursor=pointer]:
            - /url: /learn/fruits/pear
            - generic [ref=f2e116]: 🍐
            - strong [ref=f2e119]: Pear
            - generic [aria-hidden] [ref=f2e120]: ♪
          - link "🍒 Cherry" [ref=f2e121] [cursor=pointer]:
            - /url: /learn/fruits/cherry
            - generic [ref=f2e122]: 🍒
            - strong [ref=f2e125]: Cherry
            - generic [aria-hidden] [ref=f2e126]: ♪
    - contentinfo [ref=f2e127]:
      - generic [ref=f2e128]: ♡ No ads. No rush. Just discovery.
      - generic [ref=f2e129]: ✧ Little adventures, even offline
```

# Test source

```ts
  1  | import { expect, Page, test } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | async function onboard(page:Page,name='Sunny'):Promise<void>{await page.goto('/');await page.getByRole('button',{name:'Let’s get started'}).click();await page.getByRole('textbox').fill(name);await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'Start my adventure'}).click();await expect(page.getByRole('heading',{name:`Hello, ${name}!`})).toBeVisible();}
  4  | async function gate(page:Page):Promise<void>{await page.goto('/parent');const challenge=await page.locator('.challenge').innerText();const numbers=challenge.match(/\d+/g)?.map(Number)??[];await page.getByRole('spinbutton').fill(String(numbers[0]*numbers[1]));await page.getByRole('button',{name:'Enter Parent Zone'}).click();await expect(page.getByRole('heading',{name:'A window into their world'})).toBeVisible();}
  5  | test('complete learning flow, gentle retry, stars and persisted progress',async({page})=>{
  6  |  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));await onboard(page);await page.locator('app-category-card').filter({hasText:'Animals'}).click();await page.getByRole('link',{name:'Elephant',exact:false}).click();await page.getByRole('button',{name:'Listen again'}).click();await page.getByRole('link',{name:'Let’s find it!'}).click();await expect(page.getByRole('heading',{name:'Can you find Elephant?'})).toBeVisible();const wrong=page.locator('.answer-card').filter({hasNotText:'Elephant'}).first();await wrong.click();await expect(page.getByText('Almost! Let’s try again.')).toBeVisible();await page.getByRole('button',{name:'Elephant',exact:true}).click();await expect(page.locator('.feedback')).toHaveText('You found it! Wonderful!');await page.reload();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('1');await gate(page);await expect(page.locator('.category-progress-row').filter({hasText:'Animals'})).toContainText('1 / 16');await expect(page.locator('.stats-grid .panel').nth(2).locator('strong')).toHaveText('0');expect(errors).toEqual([]);
  7  | });
  8  | test('English and Hindi profile preferences, protected settings and profile isolation',async({page})=>{
  9  |  await onboard(page);await page.goto('/parent/settings');await expect(page.getByRole('heading',{name:'Hello, grown-up!'})).toBeVisible();await gate(page);await page.getByRole('link',{name:'Little learners',exact:true}).click();await page.getByRole('link',{name:'Add a little learner'}).click();await page.getByRole('textbox').fill('Tara');await page.getByRole('button',{name:'Continue',exact:false}).click();await page.getByRole('button',{name:'हिन्दी',exact:true}).click();await page.getByRole('button',{name:'मेरा सफ़र शुरू करें'}).click();await expect(page.getByRole('heading',{name:'नमस्ते, Tara!'})).toBeVisible();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','hi');await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'हाथी',exact:true})).toBeVisible();await page.goto('/rewards');await expect(page.locator('.star-collection>strong')).toHaveText('0');
  10 | });
  11 | test('all four games can finish and memory pairs are accessible',async({page})=>{
  12 |  await onboard(page);
  13 |  for(const kind of ['find-it','match','count']){await page.goto('/play/'+kind);for(let n=0;n<5;n++){await expect(page.locator('.answer-card').first()).toBeVisible();const options=page.locator('.answer-card');const count=await options.count();for(let k=0;k<count;k++){await options.nth(k).click();if(await page.locator('.answer-card.correct').count())break;}await page.getByRole('button',{name:'Keep exploring'}).click();}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();}
  14 |  await page.goto('/play/memory');const cards=page.locator('.memory-card');const found=new Map<string,number>();while(!(await page.locator('.result').count())){let paired=false;for(let n=0;n<4;n++){if(await cards.nth(n).isDisabled())continue;await cards.nth(n).click();const label=await cards.nth(n).getAttribute('aria-label');if(label){const prior=found.get(label);if(prior!==undefined && prior!==n && !(await cards.nth(prior).isDisabled())){await cards.nth(prior).click();paired=true;break;}found.set(label,n);}if(await page.locator('.memory-card.face-up:not(.matched)').count()===2)await page.waitForTimeout(1300);}if(!paired)await page.waitForTimeout(1300);}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();
  15 | });
  16 | test('offline reload reaches uncached routes and Hindi content',async({page,context})=>{
> 17 |  await onboard(page);await page.evaluate(async()=>{const registration=await navigator.serviceWorker.ready;if(!registration.active)throw new Error('No active service worker');});await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.goto('/learn/fruits');await expect(page.getByRole('link',{name:'Apple',exact:false})).toBeVisible();await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'Elephant',exact:true})).toBeVisible();await expect(page.getByText('You’re offline. Let’s keep learning!')).toBeVisible();const hi=await page.evaluate(async()=>{const r=await fetch('/assets/content/hi/animals.json');return r.ok;});expect(hi).toBe(true);
     |                                                                                                                                                                                                                                                                                                                                                                                                                                ^ Error: expect(locator).toBeVisible() failed
  18 | });
  19 | test('responsive layouts, keyboard access and accessibility',async({page},testInfo)=>{
  20 |  await onboard(page);for(const route of ['/','/learn','/learn/animals','/learn/animals/elephant','/play','/play/find-it','/rewards','/parent/gate','/trace']){await page.goto(route);await expect(page.locator('main h1').first()).toBeVisible();await page.waitForTimeout(100);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations,`${route}: ${JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}await page.goto('/');await page.screenshot({path:`test-results/home-${testInfo.project.name}.png`,fullPage:true});if(testInfo.project.name==='mobile'){await page.setViewportSize({width:320,height:720});await page.screenshot({path:'test-results/home-320.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
  21 | });
  22 | 
```