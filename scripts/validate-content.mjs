import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const json = async (path) =>
  JSON.parse(await readFile(`public/assets/${path}`, "utf8"));
const languages = await json("i18n/languages.json");
const catalog = await json("content/catalog.json");
const baseMessages = await json("i18n/en.json");
const audioManifest = new Map(
  (await json("audio/manifest.json")).map((clip) => [clip.path, clip]),
);
let total = 0;
for (const language of languages) {
  const messages = await json(`i18n/${language.id}.json`);
  assert.deepEqual(
    Object.keys(messages).sort(),
    Object.keys(baseMessages).sort(),
    `${language.id}: translation keys differ`,
  );
  for (const category of catalog.categories) {
    assert(messages[category.titleKey] && messages[category.descriptionKey]);
    await access(`public${category.illustration}`);
    const pack = await json(`content/${language.id}/${category.id}.json`);
    const baseline = await json(`content/en/${category.id}.json`);
    assert.equal(pack.version, 1);
    assert.equal(pack.language, language.id);
    assert.equal(pack.category, category.id);
    assert.deepEqual(
      pack.items.map((item) => item.id).sort(),
      baseline.items.map((item) => item.id).sort(),
      `${language.id}/${category.id}: content IDs differ`,
    );
    const ids = new Set();
    for (const item of pack.items) {
      assert(!ids.has(item.id), `Duplicate ${item.id}`);
      ids.add(item.id);
      assert.equal(item.category, category.id);
      assert(item.name && item.shortDescription && item.emoji);
      if (item.imageGrid) {
        const { columns, rows, index } = item.imageGrid;
        assert(item.image && Number.isInteger(columns) && columns > 0);
        assert(Number.isInteger(rows) && rows > 0);
        assert(Number.isInteger(index) && index >= 0 && index < columns * rows);
      }
      for (const path of [
        item.image,
        item.audioAvailable ? item.audio : undefined,
        item.lessonAudio,
      ]) {
        if (path) {
          assert(path.startsWith("/assets/"));
          await access(`public${path}`);
        }
      }
      for (const [path, text] of [
        [item.audioAvailable ? item.audio : undefined, item.name],
        [item.lessonAudio, `${item.name}. ${item.shortDescription}`],
      ]) {
        if (!path) continue;
        const clip = audioManifest.get(path);
        assert(clip, `Missing audio manifest entry: ${path}`);
        assert.equal(
          clip.text,
          text,
          `Regenerate audio after editing text: ${path}`,
        );
        const bytes = await readFile(`public${path}`);
        assert(
          bytes.length > 1000 && clip.rms > 50,
          `Empty or silent clip: ${path}`,
        );
        assert.equal(
          createHash("sha256").update(bytes).digest("hex"),
          clip.sha256,
        );
      }
      total++;
    }
  }
}
const traces = await json("content/tracing.json");
assert.equal(new Set(traces.map((trace) => trace.id)).size, traces.length);
for (const trace of traces)
  assert(
    trace.paths.length && trace.paths.every((path) => path.startsWith("M")),
  );
console.log(
  `Validated ${total} localized learning items, ${languages.length} UI dictionaries, and ${traces.length} tracing definitions.`,
);

const storyPack = await json("content/stories.json");
assert.equal(storyPack.version, 1);
assert.equal(
  new Set(storyPack.stories.map((story) => story.id)).size,
  storyPack.stories.length,
);
let storyPages = 0;
for (const story of storyPack.stories) {
  assert(/^[a-z0-9-]+$/.test(story.id));
  assert(Number.isInteger(story.art) && story.art >= 0 && story.art < 16);
  assert(story.pages.length > 0 && story.pages.length <= 6);
  for (const language of ["en", "hi"]) {
    const copy = story[language];
    assert(copy.title && copy.theme && copy.question);
    assert(
      copy.options.length >= 2 &&
        copy.options.some((option) => option.id === story.answerId),
    );
    assert.equal(
      new Set(copy.options.map((option) => option.id)).size,
      copy.options.length,
    );
    const entries = story.pages.map((page) => {
      assert(Number.isInteger(page.art) && page.art >= 0 && page.art < 16);
      assert(page[language].text);
      return page[language];
    });
    entries.push({
      text: `${copy.question} ${copy.options.map((option) => option.text + ".").join(" ")}`,
      audio: copy.questionAudio,
    });
    for (const entry of entries) {
      assert(entry.audio.startsWith(`/assets/audio/${language}/stories/`));
      const clip = audioManifest.get(entry.audio);
      assert(clip && clip.rms > 50);
      assert.equal(
        clip.text,
        entry.text,
        `Regenerate story narration: ${entry.audio}`,
      );
      const bytes = await readFile(`public${entry.audio}`);
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        clip.sha256,
      );
    }
    storyPages += story.pages.length;
  }
}
console.log(
  `Validated ${storyPack.stories.length} bilingual stories and ${storyPages} localized story pages.`,
);
