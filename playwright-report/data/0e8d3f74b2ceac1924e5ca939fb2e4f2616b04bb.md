# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journey.spec.ts >> all four games can finish and memory pairs are accessible
- Location: e2e/journey.spec.ts:11:5

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for locator('.answer-card').nth(1)
    - locator resolved to <button aria-label="Cow" class="answer-card" _ngcontent-ng-c1854657387="">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    85 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - link "Skip to learning" [ref=f1e3] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=f1e4]:
    - link "TinySteps" [ref=f1e5] [cursor=pointer]:
      - /url: /
      - generic [ref=f1e6]:
        - text: TinySteps
        - generic [ref=f1e7]: Play • Listen • Learn
    - navigation "TinySteps" [ref=f1e8]:
      - link "Home" [ref=f1e9] [cursor=pointer]:
        - /url: /
      - link "Learn" [ref=f1e14] [cursor=pointer]:
        - /url: /learn
      - link "Play" [ref=f1e19] [cursor=pointer]:
        - /url: /play
      - link "Trace" [ref=f1e24] [cursor=pointer]:
        - /url: /trace
      - link "My treasures" [ref=f1e29] [cursor=pointer]:
        - /url: /rewards
    - generic [ref=f1e34]:
      - generic [ref=f1e35]:
        - paragraph [ref=f1e36]: Made for curious little minds
        - text: No ads. No rush. Just discovery.
      - link "Parent Zone" [ref=f1e37] [cursor=pointer]:
        - /url: /parent
        - text: Parent Zone
        - generic [aria-hidden] [ref=f1e40]: ↗
  - generic [ref=f1e41]:
    - banner [ref=f1e42]:
      - generic [ref=f1e43]: Play • Listen • Learn
      - generic [ref=f1e44]:
        - generic [ref=f1e45]: EN
        - button "Sound off" [ref=f1e46] [cursor=pointer]
        - link "2 stars" [ref=f1e49] [cursor=pointer]:
          - /url: /rewards
          - generic [aria-hidden] [ref=f1e50]: ★
          - text: "2"
          - generic [ref=f1e51]: stars
        - link "Parent Zone" [ref=f1e52] [cursor=pointer]:
          - /url: /parent
          - generic [aria-hidden] [ref=f1e53]: 🐻
          - generic [ref=f1e54]: Sunny
          - generic [aria-hidden] [ref=f1e55]: ⌄
    - main [ref=f1e56]:
      - generic [ref=f1e58]:
        - link "← Play" [ref=f1e59] [cursor=pointer]:
          - /url: /play
        - generic [ref=f1e60]:
          - generic [ref=f1e61]:
            - generic [ref=f1e62]: Find It
            - generic [ref=f1e63]: Activity 2 of 5
            - button "Listen again" [ref=f1e64] [cursor=pointer]
          - progressbar "Find It" [ref=f1e67]
          - heading "Can you find Bear?" [level=1] [ref=f1e69]
          - generic [ref=f1e70]:
            - button "Bear" [disabled] [ref=f1e71]:
              - generic [ref=f1e72]: 🐻
              - generic [aria-hidden] [ref=f1e76]: ✓
            - button "Cow" [disabled] [ref=f1e77]:
              - generic [ref=f1e78]: 🐮
          - paragraph [ref=f1e83]: You found it! Wonderful!
          - button "Keep exploring" [ref=f1e84] [cursor=pointer]:
            - text: Keep exploring
            - generic [aria-hidden] [ref=f1e85]: →
    - contentinfo [ref=f1e86]:
      - generic [ref=f1e87]: ♡ No ads. No rush. Just discovery.
      - generic [ref=f1e88]: ✧ Little adventures, even offline
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
> 13 |  for(const kind of ['find-it','match','count']){await page.goto('/play/'+kind);for(let n=0;n<5;n++){await expect(page.locator('.answer-card').first()).toBeVisible();const options=page.locator('.answer-card');const count=await options.count();for(let k=0;k<count;k++){await options.nth(k).click();if(await page.locator('.answer-card.correct').count())break;}await page.getByRole('button',{name:'Keep exploring'}).click();}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();}
     |                                                                                                                                                                                                                                                                                                 ^ Error: locator.click: Test timeout of 45000ms exceeded.
  14 |  await page.goto('/play/memory');const cards=page.locator('.memory-card');const found=new Map<string,number>();while(!(await page.locator('.result').count())){let paired=false;for(let n=0;n<4;n++){if(await cards.nth(n).isDisabled())continue;await cards.nth(n).click();const label=await cards.nth(n).getAttribute('aria-label');if(label){const prior=found.get(label);if(prior!==undefined && prior!==n && !(await cards.nth(prior).isDisabled())){await cards.nth(prior).click();paired=true;break;}found.set(label,n);}if(await page.locator('.memory-card.face-up:not(.matched)').count()===2)await page.waitForTimeout(1300);}if(!paired)await page.waitForTimeout(1300);}await expect(page.getByRole('heading',{name:'Look what you did!'})).toBeVisible();
  15 | });
  16 | test('offline reload reaches uncached routes and Hindi content',async({page,context})=>{
  17 |  await onboard(page);await page.evaluate(async()=>{const registration=await navigator.serviceWorker.ready;if(!registration.active)throw new Error('No active service worker');});await page.reload();await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);await context.setOffline(true);await page.goto('/learn/fruits');await expect(page.getByRole('link',{name:'Apple',exact:false})).toBeVisible();await page.goto('/learn/animals/elephant');await expect(page.getByRole('heading',{name:'Elephant',exact:true})).toBeVisible();await expect(page.getByText('You’re offline. Let’s keep learning!')).toBeVisible();const hi=await page.evaluate(async()=>{const r=await fetch('/assets/content/hi/animals.json');return r.ok;});expect(hi).toBe(true);
  18 | });
  19 | test('responsive layouts, keyboard access and accessibility',async({page},testInfo)=>{
  20 |  await onboard(page);for(const route of ['/','/learn','/learn/animals','/learn/animals/elephant','/play','/play/find-it','/rewards','/parent/gate','/trace']){await page.goto(route);await expect(page.locator('main h1').first()).toBeVisible();await page.waitForTimeout(100);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations,`${route}: ${JSON.stringify(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}await page.goto('/');await page.screenshot({path:`test-results/home-${testInfo.project.name}.png`,fullPage:true});if(testInfo.project.name==='mobile'){await page.setViewportSize({width:320,height:720});await page.screenshot({path:'test-results/home-320.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}
  21 | });
  22 | 
```