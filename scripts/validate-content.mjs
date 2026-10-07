import { readFile, access } from "node:fs/promises";
import assert from "node:assert/strict";
const json = async (path) =>
  JSON.parse(await readFile(`public/assets/${path}`, "utf8"));
const languages = await json("i18n/languages.json");
const catalog = await json("content/catalog.json");
const baseMessages = await json("i18n/en.json");
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
      for (const path of [
        item.image,
        item.audioAvailable ? item.audio : undefined,
      ]) {
        if (path) {
          assert(path.startsWith("/assets/"));
          await access(`public${path}`);
        }
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
