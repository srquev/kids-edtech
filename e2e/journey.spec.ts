import { expect, Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function onboard(page: Page, name = 'Sunny'): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'Let’s get started' }).click();
  await page.getByRole('textbox').fill(name);
  await page.getByRole('button', { name: 'Continue', exact: false }).click();
  await page.getByRole('button', { name: 'Start my adventure' }).click();
  await expect(
    page.getByRole('heading', { name: `Hello, ${name}!` }),
  ).toBeVisible();
}
async function gate(page: Page): Promise<void> {
  await page.goto('/parent');
  const challenge = await page.locator('.challenge').innerText();
  const numbers = challenge.match(/\d+/g)?.map(Number) ?? [];
  await page.getByRole('spinbutton').fill(String(numbers[0] * numbers[1]));
  await page.getByRole('button', { name: 'Enter Parent Zone' }).click();
  await expect(
    page.getByRole('heading', { name: 'A window into their world' }),
  ).toBeVisible();
}
test('complete learning flow, gentle retry, stars and persisted progress', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await onboard(page);
  await page
    .locator('app-category-card')
    .filter({ hasText: 'Animals' })
    .click();
  await page.getByRole('link', { name: 'Elephant', exact: false }).click();
  await page.getByRole('button', { name: 'Listen again' }).click();
  await page.getByRole('link', { name: 'Let’s find it!' }).click();
  await expect(
    page.getByRole('heading', { name: 'Can you find Elephant?' }),
  ).toBeVisible();
  const wrong = page
    .locator('.answer-card')
    .filter({ hasNotText: 'Elephant' })
    .first();
  await wrong.click();
  await expect(page.getByText('Almost! Let’s try again.')).toBeVisible();
  await page.getByRole('button', { name: 'Elephant', exact: true }).click();
  await expect(page.locator('.feedback')).toHaveText(
    'You found it! Wonderful!',
  );
  await page.reload();
  await page.goto('/rewards');
  await expect(page.locator('.star-collection>strong')).toHaveText('1');
  await gate(page);
  await expect(
    page.locator('.category-progress-row').filter({ hasText: 'Animals' }),
  ).toContainText('1 / 16');
  await expect(
    page.locator('.stats-grid .panel').nth(2).locator('strong'),
  ).toHaveText('0');
  expect(errors).toEqual([]);
});
test('English and Hindi profile preferences, protected settings and profile isolation', async ({
  page,
}) => {
  await onboard(page);
  await page.goto('/parent/settings');
  await expect(
    page.getByRole('heading', { name: 'Hello, grown-up!' }),
  ).toBeVisible();
  await gate(page);
  await page
    .getByRole('link', { name: 'Little learners', exact: true })
    .click();
  await page.getByRole('link', { name: 'Add a little learner' }).click();
  await page.getByRole('textbox').fill('Tara');
  await page.getByRole('button', { name: 'Continue', exact: false }).click();
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await page.getByRole('button', { name: 'मेरा सफ़र शुरू करें' }).click();
  await expect(
    page.getByRole('heading', { name: 'नमस्ते, Tara!' }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  await page.goto('/learn/animals/elephant');
  await expect(
    page.getByRole('heading', { name: 'हाथी', exact: true }),
  ).toBeVisible();
  await page.goto('/rewards');
  await expect(page.locator('.star-collection>strong')).toHaveText('0');
});
test('all four games can finish and memory pairs are accessible', async ({
  page,
}) => {
  await onboard(page);
  for (const kind of ['find-it', 'match', 'count']) {
    await page.goto('/play/' + kind);
    for (let n = 0; n < 5; n++) {
      await expect(page.locator('.game-position')).toHaveText(
        `Activity ${n + 1} of 5`,
      );
      const options = page.locator('.answer-card');
      await expect(options.first()).toBeEnabled();
      if (kind === 'find-it') {
        const prompt = await page.locator('.game-prompt').innerText();
        const answer = prompt.replace('Can you find ', '').replace('?', '');
        await page.getByRole('button', { name: answer, exact: true }).click();
      } else if (kind === 'count') {
        const number = await page.locator('.count-objects>span').count();
        await page
          .getByRole('button', { name: String(number), exact: true })
          .click();
      } else {
        const name = await page
          .locator('.match-target')
          .getAttribute('aria-label');
        await page.getByRole('button', { name: name!, exact: true }).click();
      }
      await expect(page.locator('.feedback')).toHaveText(
        'You found it! Wonderful!',
      );
      await page.getByRole('button', { name: 'Keep exploring' }).click();
    }
    await expect(
      page.getByRole('heading', { name: 'Look what you did!' }),
    ).toBeVisible();
  }
  await page.goto('/play/memory');
  const cards = page.locator('.memory-card');
  await expect(cards).toHaveCount(4);
  const labels: string[] = [];
  for (let n = 0; n < 4; n += 2) {
    for (const index of [n, n + 1]) {
      await cards.nth(index).click();
      await expect
        .poll(() =>
          page.evaluate(
            (idx) =>
              !!document.querySelector('.result') ||
              !!document
                .querySelectorAll('.memory-card')
                .item(idx)
                ?.classList.contains('face-up'),
            index,
          ),
        )
        .toBe(true);
      if (await page.locator('.result').count()) break;
      await expect(cards.nth(index)).toHaveClass(/face-up/);
      labels[index] = (await cards.nth(index).getAttribute('aria-label')) ?? '';
    }
    if (await page.locator('.result').count()) break;
    await page.waitForTimeout(1300);
  }
  if (!(await page.locator('.result').count())) {
    const pairs = new Map<string, number[]>();
    labels.forEach((label, index) =>
      pairs.set(label, [...(pairs.get(label) ?? []), index]),
    );
    for (const pair of pairs.values()) {
      if (pair.length !== 2 || (await cards.nth(pair[0]).isDisabled()))
        continue;
      await cards.nth(pair[0]).click();
      await expect(cards.nth(pair[0])).toHaveClass(/face-up/);
      await cards.nth(pair[1]).click();
    }
  }
  await expect(
    page.getByRole('heading', { name: 'Look what you did!' }),
  ).toBeVisible();
});
test('offline reload reaches uncached routes and Hindi content', async ({
  page,
  context,
}) => {
  await onboard(page);
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) throw new Error('No active service worker');
  });
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await context.setOffline(true);
  await page.goto('/learn/fruits');
  await expect(
    page.getByRole('link', { name: 'Apple', exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('.item-card img')
        .first()
        .evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.goto('/learn/animals/elephant');
  await expect(
    page.getByRole('heading', { name: 'Elephant', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('You’re offline. Let’s keep learning!'),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('.lesson-art img')
        .evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  const hi = await page.evaluate(async () => {
    const r = await fetch('/assets/content/hi/animals.json');
    return r.ok;
  });
  expect(hi).toBe(true);
  const offlineAudio = await page.evaluate(async () => {
    const audioContext = new AudioContext();
    try {
      for (const language of ['en', 'hi']) {
        for (const suffix of ['', '-lesson']) {
          const response = await fetch(
            `/assets/audio/${language}/animals/elephant${suffix}.m4a`,
          );
          if (!response.ok) return false;
          const decoded = await audioContext.decodeAudioData(
            await response.arrayBuffer(),
          );
          if (
            !decoded
              .getChannelData(0)
              .some((sample) => Math.abs(sample) > 0.005)
          )
            return false;
        }
      }
      return true;
    } finally {
      await audioContext.close();
    }
  });
  expect(offlineAudio).toBe(true);
  await page.goto('/stories/cat-bedtime?lang=hi');
  await expect(
    page.getByRole('heading', { name: 'बिल्ली चली सोने' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'यह पन्ना सुनें', exact: true })
    .click();
  const storyAudio = await page.evaluate(async () => {
    const response = await fetch('/assets/audio/hi/stories/cat-bedtime-1.m4a');
    const context = new AudioContext();
    try {
      const buffer = await context.decodeAudioData(
        await response.arrayBuffer(),
      );
      return (
        buffer.duration > 0 &&
        buffer.getChannelData(0).some((value) => Math.abs(value) > 0.005)
      );
    } finally {
      await context.close();
    }
  });
  expect(storyAudio).toBe(true);
});
test('responsive layouts, keyboard access and accessibility', async ({
  page,
}, testInfo) => {
  await onboard(page);
  for (const route of [
    '/',
    '/learn',
    '/learn/animals',
    '/learn/animals/elephant',
    '/stories',
    '/stories/rabbit-picnic',
    '/play',
    '/play/find-it',
    '/rewards',
    '/parent/gate',
    '/trace',
  ]) {
    await page.goto(route);
    await expect(page.locator('main h1').first()).toBeVisible();
    await page.waitForTimeout(400);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect
      .soft(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
        `${route}: ${JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
      )
      .toEqual([]);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await page.goto('/');
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  if (testInfo.project.name === 'mobile') {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.screenshot({
      path: 'test-results/home-320.png',
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});
test('parent settings persist and progress reset needs confirmation', async ({
  page,
}) => {
  await onboard(page);
  await page.goto('/play/find-it?category=animals&target=elephant');
  await page.getByRole('button', { name: 'Elephant', exact: true }).click();
  await expect(page.locator('.feedback')).toHaveText(
    'You found it! Wonderful!',
  );
  await gate(page);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await page
    .getByLabel('Gentle daily goal')
    .selectOption({ label: '15 minutes' });
  await page.getByLabel('Spoken guidance').uncheck();
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByText('Your changes are saved.')).toBeVisible();
  await page
    .getByRole('button', { name: 'Reset this learner’s progress' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('.star-counter')).toContainText('1');
  await page
    .getByRole('button', { name: 'Reset this learner’s progress' })
    .click();
  await page.getByRole('button', { name: 'Yes, reset progress' }).click();
  await expect(page.locator('.star-counter')).toContainText('0');
  await gate(page);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByLabel('Spoken guidance')).not.toBeChecked();
  await expect(
    page.getByLabel('Gentle daily goal').locator('option:checked'),
  ).toHaveText('15 minutes');
  await page.waitForTimeout(400);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});
test('tracing supports keyboard drawing and rewards completed paths', async ({
  page,
}) => {
  await onboard(page);
  await page.goto('/trace');
  await page
    .getByRole('button', { name: 'Shape · Square', exact: true })
    .click();
  const board = page.getByRole('application');
  await board.focus();
  await page.keyboard.down('Space');
  for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
    for (let step = 0; step < 32; step++) await page.keyboard.press(key);
  }
  await page.keyboard.up('Space');
  await expect(page.locator('.trace-status')).toHaveText(
    'A lovely little line!',
  );
  await expect(page.locator('.star-counter')).toContainText('1');
  await page.getByRole('button', { name: 'Try a fresh page' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute(
    'aria-valuenow',
    '0',
  );
});

test('lesson navigation, realistic pictures, voice actions and completion', async ({
  page,
}) => {
  await page.setViewportSize({
    width: page.viewportSize()!.width,
    height: 600,
  });
  await page.addInitScript(() => {
    const state = window as Window & { lessonMedia?: HTMLMediaElement };
    // Observe the real media element; do not stub decoding or playback.
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      state.lessonMedia = this;
      return play.call(this);
    };
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });
  });
  const played = () =>
    page.evaluate(() => {
      const media = (window as Window & { lessonMedia?: HTMLMediaElement })
        .lessonMedia;
      return media
        ? { path: new URL(media.src).pathname, rate: media.playbackRate }
        : undefined;
    });
  const playbackTime = () =>
    page.evaluate(
      () =>
        (window as Window & { lessonMedia?: HTMLMediaElement }).lessonMedia
          ?.currentTime ?? 0,
    );
  await onboard(page);
  await page.goto('/learn/animals/elephant');
  await expect(page.getByText('Lesson 1 of 16')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Back', exact: true }),
  ).toBeDisabled();
  const picture = page.locator('.lesson-art img');
  await expect(picture).toHaveAttribute(
    'src',
    '/assets/images/animals-realistic.jpg',
  );
  await expect
    .poll(() =>
      picture.evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await page
    .getByRole('button', { name: 'Listen slowly', exact: true })
    .click();
  await expect
    .poll(played)
    .toEqual({ path: '/assets/audio/en/animals/elephant.m4a', rate: 0.8 });
  await expect.poll(playbackTime).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Read to me', exact: true }).click();
  await expect
    .poll(played)
    .toEqual({ path: '/assets/audio/en/animals/elephant-lesson.m4a', rate: 1 });
  await expect.poll(playbackTime).toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator('.lesson')
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeGreaterThanOrEqual(0);
  await expect
    .poll(() =>
      page
        .locator('.lesson')
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBeLessThan(40);
  await expect(page.locator('.lesson-art')).toBeInViewport();
  await expect(
    page.getByRole('heading', { name: 'Lion', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Lesson 2 of 16')).toBeVisible();
  await expect
    .poll(played)
    .toEqual({ path: '/assets/audio/en/animals/lion.m4a', rate: 1 });
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect
    .poll(played)
    .toEqual({ path: '/assets/audio/en/animals/elephant.m4a', rate: 1 });
  await page.getByRole('button', { name: 'Listen again', exact: true }).click();
  await expect.poll(playbackTime).toBeGreaterThan(0);
  await expect(page.locator('.lesson-art')).toBeInViewport();
  await expect(
    page.getByRole('heading', { name: 'Elephant', exact: true }),
  ).toBeVisible();
  await page.goto('/learn/animals');
  await expect.poll(played).toBeUndefined();
  await page.getByRole('link', { name: 'Keep learning' }).click();
  await expect(
    page.getByRole('heading', { name: 'Tiger', exact: true }),
  ).toBeVisible();
  await page.goto('/learn/animals/zebra');
  await expect(page.getByText('Lesson 16 of 16')).toBeVisible();
  await page.getByRole('button', { name: 'Finish', exact: true }).click();
  await expect(
    page.getByRole('link', { name: 'Practice with a game' }),
  ).toBeVisible();
  await expect(page.getByText('Explored 4 of 16')).toBeVisible();
  await page.goto('/learn/fruits/cherry');
  await expect(page.locator('.lesson-art img')).toHaveAttribute(
    'src',
    '/assets/images/fruits-realistic.jpg',
  );
  await expect(page.getByText('Lesson 10 of 10')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: `test-results/lesson-${test.info().project.name}.png`,
    fullPage: true,
  });
});

test('silent audio explains blocked playback and mute, and allows a retry', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = window as Window & {
      realMediaPlay?: typeof HTMLMediaElement.prototype.play;
    };
    state.realMediaPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = () =>
      Promise.reject(new DOMException('Tap needed', 'NotAllowedError'));
  });
  await onboard(page);
  await page.goto('/learn/animals/elephant');
  await page.getByRole('button', { name: 'Listen again', exact: true }).click();
  await expect(
    page.getByText('Tap Listen again to start the voice.'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Stop listening', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Sound off', exact: true }).click();
  await expect(
    page.getByText(
      'Sound is off. Use the speaker button at the top to turn it on.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sound on', exact: true }).click();
  await page.evaluate(() => {
    HTMLMediaElement.prototype.play = (
      window as Window & {
        realMediaPlay: typeof HTMLMediaElement.prototype.play;
      }
    ).realMediaPlay;
  });
  await page.getByRole('button', { name: 'Listen again', exact: true }).click();
  await expect(page.locator('.speech-status')).toHaveText('');
});

test('all bundled voice clips decode to non-silent audio', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'Media content is shared across viewports',
  );
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const manifest = (await (
      await fetch('/assets/audio/manifest.json')
    ).json()) as { path: string }[];
    const context = new AudioContext();
    const failures: string[] = [];
    try {
      for (const { path } of manifest) {
        const response = await fetch(path);
        if (!response.ok) {
          failures.push(path + ': missing');
          continue;
        }
        try {
          const buffer = await context.decodeAudioData(
            await response.arrayBuffer(),
          );
          const samples = buffer.getChannelData(0);
          if (
            buffer.duration < 0.1 ||
            !samples.some((value) => Math.abs(value) > 0.005)
          )
            failures.push(path + ': silent');
        } catch {
          failures.push(path + ': cannot decode');
        }
      }
    } finally {
      await context.close();
    }
    return { count: manifest.length, failures };
  });
  expect(result.count).toBe(350);
  expect(result.failures).toEqual([]);
});

test('tiny stories switch languages, play real audio, turn pages and finish with a gentle question', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as Window & { storyMedia?: HTMLMediaElement }).storyMedia = this;
      return play.call(this);
    };
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });
  });
  const playback = () =>
    page.evaluate(() => {
      const media = (window as Window & { storyMedia?: HTMLMediaElement })
        .storyMedia;
      return media
        ? {
            path: new URL(media.src).pathname,
            time: media.currentTime,
            rate: media.playbackRate,
            paused: media.paused,
          }
        : undefined;
    });
  await onboard(page);
  await page.getByRole('link').filter({ hasText: 'Choose a story' }).click();
  await expect(page.locator('.story-card')).toHaveCount(3);
  await page.getByRole('link').filter({ hasText: 'Rabbit’s Picnic' }).click();
  await expect(
    page.getByRole('heading', { name: 'Rabbit’s Picnic' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Back', exact: true }),
  ).toBeDisabled();
  await page
    .getByRole('button', { name: 'Read this page', exact: true })
    .click();
  await expect
    .poll(async () => (await playback())?.time ?? 0)
    .toBeGreaterThan(0);
  await expect
    .poll(async () => (await playback())?.path)
    .toBe('/assets/audio/en/stories/rabbit-picnic-1.m4a');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.locator('.page-position')).toHaveText('Page 2 of 4');
  await expect(page.locator('.page-art')).toBeInViewport();
  await expect.poll(async () => (await playback())?.paused).toBe(true);
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'खरगोश की पिकनिक' }),
  ).toBeVisible();
  await expect(page.locator('.page-position')).toHaveText('4 में से पन्ना 2');
  await expect(page.locator('.stories-page')).toHaveAttribute('lang', 'hi');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: 'धीरे सुनें', exact: true }).click();
  await expect
    .poll(async () => (await playback())?.time ?? 0)
    .toBeGreaterThan(0);
  await expect
    .poll(async () => (await playback())?.path)
    .toBe('/assets/audio/hi/stories/rabbit-picnic-2.m4a');
  await expect.poll(async () => (await playback())?.rate).toBe(0.8);
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect.poll(async () => (await playback())?.paused).toBe(true);
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.locator('.page-position')).toHaveText('Page 1 of 4');
  for (let pageNumber = 0; pageNumber < 3; pageNumber++)
    await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'The end', exact: true }).click();
  await page.getByRole('button', { name: 'A hat', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toHaveText(
    'Have another look. Try again!',
  );
  await page.getByRole('button', { name: 'An apple', exact: true }).click();
  await expect(page.locator('.answer-feedback')).toHaveText(
    'That’s right! Lovely listening.',
  );
  await page
    .getByRole('button', { name: 'Read the question', exact: true })
    .click();
  await expect
    .poll(async () => (await playback())?.time ?? 0)
    .toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Read again', exact: true }).click();
  await expect(page.locator('.page-position')).toHaveText('Page 1 of 4');
  await page.screenshot({
    path: `test-results/story-${testInfo.project.name}.png`,
    fullPage: true,
  });
  for (const [id, title] of [
    ['elephant-friend', 'Elephant Helps a Friend'],
    ['cat-bedtime', 'Cat Says Goodnight'],
  ]) {
    await page.goto('/stories/' + id);
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toBeVisible();
    for (let pageNumber = 0; pageNumber < 3; pageNumber++)
      await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'The end', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'A lovely little story!' }),
    ).toBeVisible();
  }
  await page.goto('/stories/missing');
  await expect(
    page.getByRole('heading', { name: 'This story is not here yet.' }),
  ).toBeVisible();
});
