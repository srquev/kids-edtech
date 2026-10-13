// macOS authoring utility; playback of the generated AAC files is cross-platform.
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const voices = {
  en: { name: "Samantha", rate: 145 },
  hi: { name: "Lekha", rate: 140 },
};
const catalog = JSON.parse(
  readFileSync("public/assets/content/catalog.json", "utf8"),
);
const temporary = mkdtempSync(join(tmpdir(), "tinysteps-voice-"));
const storiesOnly = process.argv.includes("--stories");
const manifest = storiesOnly
  ? JSON.parse(
      readFileSync("public/assets/audio/manifest.json", "utf8"),
    ).filter((clip) => !clip.path.includes("/stories/"))
  : [];
function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0)
    throw new Error(
      `${command}: ${result.stderr || result.error || result.status}`,
    );
}
function waveform(path) {
  const buffer = readFileSync(path);
  let samples = 0,
    energy = 0,
    peak = 0;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const length = buffer.readUInt32LE(offset + 4);
    if (buffer.toString("ascii", offset, offset + 4) === "data") {
      for (let n = offset + 8; n + 1 < offset + 8 + length; n += 2) {
        const value = buffer.readInt16LE(n);
        samples++;
        energy += value * value;
        peak = Math.max(peak, Math.abs(value));
      }
    }
    offset += 8 + length + (length % 2);
  }
  const rms = Math.sqrt(energy / samples);
  if (samples < 1000 || !Number.isFinite(rms) || rms < 50 || peak < 500)
    throw new Error(`Empty or silent speech output: ${path}`);
  return { samples, rms: Math.round(rms), peak };
}
function generateClip(text, path, language, voice) {
  const source = join(temporary, "voice.aiff");
  const decoded = join(temporary, "voice.wav");
  run("/usr/bin/say", [
    "-v",
    voice.name,
    "-r",
    String(voice.rate),
    "-o",
    source,
    text,
  ]);
  run("/usr/bin/afconvert", ["-f", "WAVE", "-d", "LEI16", source, decoded]);
  const levels = waveform(decoded);
  run("/usr/bin/afconvert", [
    "-f",
    "m4af",
    "-d",
    "aac",
    "-b",
    "48000",
    decoded,
    `public${path}`,
  ]);
  const encoded = readFileSync(`public${path}`);
  if (encoded.length < 1000) throw new Error(`Invalid audio: ${path}`);
  manifest.push({
    path,
    text,
    language,
    voice: voice.name,
    rate: voice.rate,
    bytes: encoded.length,
    sha256: createHash("sha256").update(encoded).digest("hex"),
    ...levels,
  });
}
try {
  for (const [language, voice] of Object.entries(voices)) {
    for (const category of storiesOnly ? [] : catalog.categories) {
      const packPath = `public/assets/content/${language}/${category.id}.json`;
      const pack = JSON.parse(readFileSync(packPath, "utf8"));
      const base = `/assets/audio/${language}/${category.id}`;
      mkdirSync(`public${base}`, { recursive: true });
      for (const item of pack.items) {
        for (const kind of ["name", "lesson"]) {
          const text =
            kind === "name"
              ? item.name
              : `${item.name}. ${item.shortDescription}`;
          const path = `${base}/${item.id}${kind === "lesson" ? "-lesson" : ""}.m4a`;
          generateClip(text, path, language, voice);
          if (kind === "name") {
            item.audio = path;
            item.audioAvailable = true;
          } else item.lessonAudio = path;
        }
      }
      writeFileSync(packPath, JSON.stringify(pack, null, 2) + "\n");
      console.log(
        `Generated ${language}/${category.id}: ${pack.items.length * 2} validated clips`,
      );
    }
  }
  const { stories } = JSON.parse(
    readFileSync("public/assets/content/stories.json", "utf8"),
  );
  for (const [language, voice] of Object.entries(voices)) {
    mkdirSync(`public/assets/audio/${language}/stories`, { recursive: true });
    for (const story of stories) {
      for (const page of story.pages)
        generateClip(
          page[language].text,
          page[language].audio,
          language,
          voice,
        );
      const copy = story[language];
      generateClip(
        `${copy.question} ${copy.options.map((option) => option.text + ".").join(" ")}`,
        copy.questionAudio,
        language,
        voice,
      );
      console.log(
        `Generated ${language}/stories/${story.id}: ${story.pages.length + 1} clips`,
      );
    }
  }
  writeFileSync(
    "public/assets/audio/manifest.json",
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(
    `Generated ${manifest.length} non-silent clips, ${(manifest.reduce((sum, clip) => sum + clip.bytes, 0) / 1024 / 1024).toFixed(2)} MB`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
