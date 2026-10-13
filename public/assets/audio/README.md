# Bundled lesson voice clips

Every learning item has a name clip (`<id>.m4a`) and a name-plus-description clip (`<id>-lesson.m4a`). English uses the installed macOS Samantha voice at 145 words/minute; Hindi uses Lekha at 140 words/minute. These are synthesized speech recordings, not human voice-actor recordings.

Regenerate from the current content packs on macOS:

```sh
node scripts/generate-lesson-audio.mjs
npm run validate:content
```

The generator validates non-silent PCM before encoding AAC at 48 kbit/s. `manifest.json` records source text, voice, rate, waveform levels, byte counts, and SHA-256 hashes. Generated files are committed app assets; the browser does not need macOS voices, a speech API, or a network speech provider to play them.

All clips are prefetched by the service worker. The Playwright suite verifies browser decoding and non-silent samples for all 350 files, as well as real playback for the lesson controls with speech synthesis unavailable.

Story pages and questions live in each language’s `stories/` directory (30 clips). Regenerate just those clips with `node scripts/generate-lesson-audio.mjs --stories`.
