# TinySteps

**Play • Listen • Learn**

A private, offline-first preschool learning app for children aged 2–6 and their grown-ups. Built with Angular, a custom responsive SCSS design system, and local content. No backend, accounts, advertising, analytics SDK, camera, microphone, or location access.

## What works

- Three-step onboarding: welcome, nickname/age/avatar, English or Hindi.
- Multiple local profiles with isolated progress and parent-protected switching.
- Six complete learning categories: 26 English letters, numbers 1–10, 10 colors, 8 shapes, 16 animals, and 10 fruits. All 80 objects have English and Hindi content.
- Visual lessons, replayable pronunciation, and a lesson-to-Find-It journey targeting the selected object.
- Find It, tap-to-Match It, Count It, and Memory Match. Five-question sessions, gentle retries, explicit next steps, and equal effort rewards regardless of mistakes. Memory supports 4, 6, or 12 cards.
- Configurable smart practice, repeated-session mastery, stars, four deterministic badges, and parent learning insights.
- SVG tracing for A–Z, a–z, 0–9, circle, square, and triangle. Ordered path validation, starting dots, touch/pointer drawing, keyboard drawing, and completion feedback.
- Protected parent settings, 5/10/15-minute daily goals, sound controls, reset/delete confirmation, and a weekly activity view. Only visible, recently interacted-with learning screens contribute to learning time.
- Installable PWA with a versioned offline shell, locally cached English/Hindi packs, and an update prompt.

## Run locally

Requirements: **Node 22.18+**, npm, and Chrome for browser tests. The repository was validated with Node 22.18.0. Node must also satisfy the pinned Angular toolchain's requirements.

```sh
npm ci
npm start
```

Open `http://localhost:4200`. The first visit opens onboarding. Create a nickname and choose a language. Settings and additional profiles live behind Parent Zone in the profile button or desktop sidebar.

```sh
npm run lint
npm run test:unit
npm run build
npm run test:e2e
npm run format:check
```

`npm run test:unit` uses the existing Karma/Jasmine stack and headless Chrome. `CHROME_BIN` can select a nonstandard Chrome installation. Playwright uses the installed Chrome channel; alternatively install Chrome with `npx playwright install chrome` on your development/CI machine. Tests launch the production preview server automatically.

```sh
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. This is the production build and enables the service worker; development mode deliberately does not register it. `scripts/serve.mjs` is a local preview server, not an internet-facing deployment server.

## Architecture

```text
src/app/
  core/
    models.ts              Typed content, profiles, progress, and games
    audio/                 Recorded-audio playback and replaceable speech adapter
    content/               Lazy, validated, versioned content packs
    game-engine/           Pure question, option, scoring, and memory functions
    i18n/                  Language catalog, translations, locale and direction
    platform/              Parent gate, updates, error handling, haptics, no-op analytics
    progress/              Mastery rules, practice selection, local-day learning time
    storage/               Adapter, transactional repository, family state
  shared/                  Reusable category cards and learning artwork
  features/                Lazy home, onboarding, learning, games, tracing, rewards, parent
public/assets/
  content/catalog.json
  content/en/*.json
  content/hi/*.json
  content/tracing.json
  i18n/languages.json
  i18n/en.json
  i18n/hi.json
  illustrations/           Original local SVG category art and mascot
  icons/                   Installable PWA icons
```

Standalone components use OnPush, signals and computed state. RxJS handles router and service-worker event streams. Promises handle finite content and IndexedDB operations. Components do not access `localStorage`. Forms use typed reactive controls. Angular's template escaping remains enabled; there is no remote HTML injection.

### Toolchain decision

The starter already used Angular **20.3**, TypeScript **5.8**, strict templates, zoneless change detection, and Karma/Jasmine. This implementation preserves that working combination and adds its matching Angular service worker instead of mixing major versions. It does **not** claim Angular 20 is the latest release. A future major upgrade should migrate the framework, compiler, TypeScript, test builder, and lint tooling together. See [Angular compatibility](https://angular.dev/reference/versions).

The production initial bundle is approximately **275 kB raw / 79 kB estimated transfer**, before hosting-specific compression. Routes split into separate feature chunks. No remote fonts or image library are loaded. All route chunks are cached during service-worker installation so even a route never previously visited works offline.

### State and persistence

`StorageAdapter` is the replacement boundary for IndexedDB, native storage, or a future remote repository. `LocalRepository` serializes full family snapshots into one IndexedDB transaction: settings, profiles, and progress cannot be partially written. `FamilyService` exposes profile and settings operations; `ProgressService` implements learning behavior.

A failed write keeps learning usable in memory and displays a notice that progress is not being saved. The next successful write retries the latest state. This is deliberately not a silent persistence guarantee. Browser storage can be cleared or evicted; there is no cloud backup. Activity history is bounded to 500 entries per profile; concept totals remain cumulative.

All stored names are local nicknames. Parent gate permission exists only in memory, expires after five minutes, and locks on returning to Kids Mode. The gate separates child and adult UX; it is not authentication or a security boundary against someone controlling browser developer tools.

### Progress and mastery

Lessons establish familiarity and do not grant mastery. Completed answers record attempts, first-try success, concept/category, session ID, date, and stars. Mastery requires at least three successful interactions in at least three separate activity sessions, with at least 70% successful answers relative to attempts. Thresholds and the practice ratio are in `MASTERY_RULES`.

Practice ranks familiar concepts by accuracy and recency, then blends approximately 70% familiar/practice items with 30% new items. When one pool is small it fills from available content. Age initializes difficulty; parents can choose two, three, or four options. There are no diagnostic, developmental, or comparative labels.

Daily goals use active learning time in 10-second increments, excluding hidden tabs and idle periods over one minute. A completed session encourages a break when the goal has been reached. Rewards have no purchases, random loot, streak penalties, or countdown pressure.

## Extending content

### Add an item

Add an entry to both relevant language packs. Keep a stable `id` across languages:

```json
{
  "id": "elephant",
  "category": "animals",
  "name": "Elephant",
  "shortDescription": "An elephant uses its long trunk to pick things up.",
  "emoji": "🐘",
  "image": "/assets/images/animals/elephant.webp",
  "audio": "/assets/audio/en/animals/elephant.mp3",
  "audioAvailable": true,
  "difficulty": 1,
  "tags": ["animal", "large"],
  "enabled": true
}
```

Only reference files that actually exist. `image` is optional: `ItemArtComponent` falls back to a local color swatch or emoji/glyph. Animal and fruit lesson objects currently use platform emoji; home/category artwork is original SVG. This is a replaceable MVP asset system, not a completed professional illustration library. Production art should use one consistent style and local optimized WebP/AVIF assets.

The loader rejects duplicate IDs, unsupported schemas, mismatched category/language, and nonlocal asset URLs. Each pack declares `version`, `language`, `category`, and `items`. `version: 1` denotes the supported schema. Normal content edits are picked up by Angular's hashed service-worker manifest; a schema change requires a loader migration.

### Add a category

1. Add a `catalog.json` category with ID, translation keys, theme, illustration, and pack identifier.
2. Add a JSON pack for each supported language and both UI translation keys.
3. Supply its illustration. Category, lesson, and Find It screens need no new components.
4. Run the content validation tests and offline E2E suite.

### Add a language

1. Add a catalog entry to `i18n/languages.json` with ID, display label, speech locale, and `dir` (`ltr` or `rtl`).
2. Translate every UI key in a new `i18n/<id>.json`.
3. Provide matching content packs under `content/<id>/` with the same IDs.
4. Add recorded audio if available. Check the actual device's speech support.

The app sets HTML `lang` and `dir` from metadata. Layout uses logical properties for its main shell. English/Hindi are validated; a future RTL language needs translation and native-speaker/device review, including directional artwork and navigation arrows. Hindi currently localizes English alphabet names; it does not introduce a separate Devanagari alphabet curriculum.

### Add audio

Place a real recording under `assets/audio/<language>/<category>/<id>.mp3`, update the metadata, and set `audioAvailable: true`. Do not create empty placeholder binaries. Recorded audio takes precedence; missing or failed playback falls back to `SpeechAdapter`.

The MVP contains **no recorded voice packs**. Pronunciation uses browser/device speech synthesis. Voice availability, pronunciation quality, and offline speech vary by OS; Hindi may require an installed voice. All learning interactions remain visually usable without audio. Replace `SpeechAdapter` with a native implementation for guaranteed packaged Android speech. Sound effects are synthesized locally.

### Add a game

Extend `GameKind` and `GAMES`, then add pure question generation/scoring to `core/game-engine`. Reuse content, `AudioService`, `ProgressService`, result feedback and the session flow. Keep game-specific interaction state in its feature. New complex interaction types should have their own focused view instead of growing the shared game component indefinitely.

### Tracing

Paths are data in `content/tracing.json`, sampled into ordered points. A stroke must begin near its next guide point and move locally along the guide. Pointer capture handles drawing beyond the SVG edge; keyboard users hold Space and move with arrow keys. Completion is based on guide coverage, not merely drawing a long line. These are simple monoline practice forms, not a certified handwriting curriculum. Shape tracing currently includes circle, square and triangle.

## PWA and deployment

Deploy `dist/kids-edtech/browser/` to a static HTTPS host with SPA fallback to `index.html`. Serve `ngsw-worker.js`, `ngsw.json`, and `index.html` with revalidation rather than long immutable caching. Hashed application assets can use long immutable caching. Manifest scope and asset paths assume deployment at the origin root.

The service worker prefetches the shell, route chunks, small original SVGs, and core English/Hindi JSON. Larger future image/audio assets are lazy cached. Therefore **new optional media is not guaranteed offline until downloaded**; future packs should have an explicit download-and-verify lifecycle. The current core MVP requires no remote assets. Offline operation starts after a successful initial load and service-worker activation. Updates show a friendly reload action and do not interrupt an activity automatically. See [Angular service-worker configuration](https://angular.dev/ecosystem/service-workers/config).

The manifest supplies 192px, 512px and maskable PNG icons. Rebuild icons with `node scripts/generate-icons.mjs` after changing the local logo. Test installation and offline reload on actual Android hardware before store release.

Suggested hosting headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`. The application uses no eval or third-party scripts. A CSP should permit same-origin scripts/assets, local media and the Angular worker. Angular-inserted styles need a hosting-provided nonce (or a reviewed style policy); SVG/progress style bindings also need consideration. Do not blindly copy a strict CSP that breaks the app.

## Quality checks

Unit/component tests cover question generation, age-based options, attempts/scoring, memory pairs, mastery across sessions, practice priority, profile isolation, storage failure/recovery, pack validation/caching, answer feedback, audio mute/interruption, tracing ordering, and parent gating.

Playwright runs desktop and Pixel-sized Chrome projects against a production build. It covers onboarding, Elephant → Find It → reward → persisted progress, Hindi preferences, additional profiles, four complete games, offline cold-route reloads, and axe WCAG A/AA checks. It also verifies horizontal overflow and captures home screenshots. Keyboard tracing and destructive parent confirmations are included in the browser regression suite. Automated accessibility checks complement rather than replace testing with children, parents, and assistive technology.

`npm audit` currently reports a development-only `braces`/Karma watcher advisory, propagated through six packages. The registry proposes incompatible downgrades; those were not applied. The shipped runtime dependencies are unaffected. Keep dev/test servers local and reassess the test toolchain during the next supported Angular upgrade.

## Android and future services

For Capacitor packaging, set its web directory to `dist/kids-edtech/browser`, add native projects in a separate packaging phase, and replace speech/storage/haptic adapters where necessary. Native-bundled assets and updates need their own lifecycle; do not blindly enable the browser service worker inside a native WebView. No Android package or Play Store submission is included.

Future parent authentication and synchronization should implement repository boundaries with explicit conflict resolution and consent. Educational content and gameplay must remain usable offline. `AnalyticsService` currently does nothing and sends no events. Backend sync, remote packs, billing, school accounts, and third-party tracking are intentionally absent.

The wider roadmap—additional categories, pattern/sorting/shadow games, downloadable voice packs, and cloud sync—is separate from this six-category/four-game MVP. No placeholder menu entries advertise those features.
