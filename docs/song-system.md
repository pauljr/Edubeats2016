# Edubeats song system

**Current session policy:** Verse text, saved-library entries, math progress, earned beats, and takes live only in page memory. Refreshing or restarting clears them. Previously stored verse/progress keys are retired. Song definitions and uploaded audio may remain local; no verse text is written to persistent storage.

## Review and decisions

The original activity has four MP3 backing tracks, not verified isolated instrument stems. Original scoring was correct key +10, wrong key -10, Sound Match +50, wrong match -50, numeric bonus +11, verse confirmation +3. Legacy verse unlocks occurred every 100 cumulative points, including mid-round, and stopped at four. See `song-progression-audit.md` for the pre-change review.

The approved structure is three Round Verses, R1–R3, each containing four earned activity rounds and four verses V1–V4. A song therefore has twelve earned beat steps and twelve verses. Each activity round comprises four original question sets. The twelve activities reuse the original nineteen-round expression bank; later songs can choose a question offset. Completed Round Verse groups require their four verses saved before the next group proceeds.

## Difficulty and economics

| Rule | Easy | Normal | Hard |
|---|---:|---:|---:|
| Correct operation key | +12 | +10 | +8 |
| Wrong key | -5 | -10 | -15 |
| Sound Match | +50 | +50 | +50 |
| Wrong Sound Match | -25 | -50 | -75 |
| Correct numeric bonus | +11 | +11 | +11 |
| Wrong or invalid numeric answer | -5 | -10 | -15 |
| First verse save | +3 | +3 | +3 |
| Points required within activity round | 80 | 100 | 200 |
| Correct Sound Matches out of 4 | 2 | 3 | 4 |
| Piano sequences completed per question | 1 | 3 | 3 |

A qualifying activity round must reach both its point target and correct-match requirement. No unlock occurs until its fourth question is completed. A failed round gets a fresh attempt without awarding an audio asset or verse. Lifetime/session points remain visible; the round-local score governs earning. Changing difficulty restarts the active activity while retaining earned beats, saved verses, and song progress.

Wrong keys reset only that piano's input sequence. Other pianos retain completed progress. A correct key is credited only once per question, preventing reward farming after repeated resets.

## Beat cycling and playback

The layer cursor is `completedSteps % song.layers.length`. Earned asset IDs remain accumulated when it wraps. Repeated steps require another qualifying activity round; they do not automatically add unlocks or duplicate the same instrument in the mix. With four assets, the twelve earned steps cycle 1–4 three times. One, four, and twelve assets are covered by tests.

- `stages`: original assets are earned backing-track versions. Preview plays the highest earned stage. The full MP3 tracks are not stacked or described as isolated instruments.
- `stems`: all earned stems start on a common AudioContext clock and share the configured loop length. Offsets and gains come from song configuration. Tracks too short for their configured loop are rejected. No unearned source is started.

The default catalog has two songs using the legacy audio, with later question content for the second. The second becomes available when all twelve activities and twelve verse saves complete. Earlier unlocked songs remain reviewable from the Song selector. Create another archives the current song and starts a fresh run with its beat assets.

## Configuration and uploads

- `web/shared/song-config.js`: built-in catalog, fixed 3 × 4 structure, difficulty presets, configuration validation.
- `web/shared/song-progress.js`: round validation, song state, progression, archives, migration and resume.
- `web/shared/song-audio.js`: stage playback, earned-only stem mixing, IndexedDB audio storage.
- `web/shared/song-ui.js`: common UI, vertical verse navigation, per-app screen adapters.
- `web/shared/app.js`: application orchestration and existing piano/hint interaction.

Use Add song (desktop/tablet) or Settings → Add song (phone). Select a JSON definition and all referenced audio files. They are stored locally; nothing is uploaded to a server. `examples/stem-song.json` demonstrates the schema; its named audio files must be supplied. New songs are added after the existing catalog and unlock sequentially. Array length determines layer count; no code change is required for new instrument counts. Difficulty economics can be overridden per song; Sound Match remains +50.

## Progress compatibility

**Historical migration behavior (superseded in the browser):** Existing `<app>-verses` arrays were read without modification and copied into R1 drafts. The previous implementation did not persist confirmations, score, or math activity progress, so those cannot safely be inferred from draft text. When all four legacy drafts exist, Restore previously saved R1 verses offers an explicit restoration of their saved state and the four legacy backing stages. No old points are invented. The model import/export API can retain activity placements, sequence state, score, earned assets, verses, completed songs, and archives when passed a snapshot; the current browser app does not read or persist these snapshots.

Desktop/tablet retain a viewport shell. The writing booth has a scrollable left list: four vertical verse cards under R1, then R2, then R3. Phones collapse that list behind Your verses to prioritize the editor. Main-page saved verses display full text in a compact vertical review area; the full writing view remains available.

## Verification

- 16 model tests: original expression handling and unique hints, twelve-step completion, round-only gating, penalties/reset isolation, difficulty, 1/4/12-layer cycling, persistence, migration, song switching and config validation.
- Both apps: full 48-question / twelve-verse browser completion; earned-only stage playback after cycling; reload and next-song unlock.
- Local upload test: generated WAV stems, JSON import, IndexedDB storage, synchronized one-stem/two-stem playback, reload.
- Migration test: existing drafts, explicit R1 completion restore, difficulty UI, reload.
- Responsive checks: desktop/tablet viewport containment and reduced phone keyboard space.

Browser QA uses Chromium. Native Safari/Android/iOS playback and keyboard behavior still require device verification before deployment. Both apps remain local and undeployed.

## Answer timing and consolidated rules

Answer anytime is enabled by default in the browser interface. Its switch above the answer choices lets players skip the piano-sequence prerequisite. Switching it off applies the difficulty-specific sequence requirement. The choice stays within the page session without resetting the activity or earned progress. Activity point targets, correct-match requirements, wrong-key deductions, and round-only beat unlocks apply in both modes.

All point rewards, penalties, numeric bonuses, and beat requirements live in the Points & rules dialog beside Round/Verse progress. The former green rules paragraph, separate scoring footer, and duplicated answer-bonus badge are removed. Model and browser tests verify gate switching and continuity within the page session.

## Writing playback and session library

Opening an earned writing activity automatically starts the earned backing stage or earned stem mix. The Play/Pause control remains available. New activity slots start empty and do not import old verse text. Left navigation lists the current activity slots and assigned devices; the center holds the current draft; the right library groups saved session work by its assigned literary device. Previous takes remain in the library only within the current page session.

Literary feedback is a deterministic local cue check. Possible metaphor/simile labels identify surface patterns; Needs review and alternative-device cues give revision guidance. It does not certify figurative meaning or automatically grade poetry, and literal comparisons may require human review. Mobile library/activity navigation collapses to preserve editor space. `scripts/check-session-library.cjs` verifies automatic earned audio, separation of saved work, clean next activity, keyboard space, and clearing on refresh in both apps. Earlier persistence QA describes the superseded browser-storage behavior; model import/export functions remain available but the app does not auto-save verse data persistently.

## Hint attempts, replay economics, and save audio

Each question starts with one free hint. Additional hint clicks cost Easy 10, Normal 50, or Hard 200 points each. The deduction happens immediately, affects the activity-round point target, and is separate from wrong-key penalties. Every hint resets all three piano input sequences but preserves points already earned, key-credit history, saved work and earned audio. Resetting attempts or changing difficulty does not restore a free hint; the counter resets on answering and advancing. Rapid clicks each incur their replay charge while only the latest requested hint is scheduled.

Points & rules includes the free first hint and repeat penalty, and explains their effect on earning. Saving a verse pauses the earned audio before returning; opening the writer still starts earned audio. Activity navigation and saved-library cards use compact V-number / writing-goal headers followed by full verse text. Round save counts remain visible, and main-page verse scrolling is unchanged. `scripts/check-hint-economics.cjs` verifies browser replay/reset, next-question counters, pause on save, and verse display.

## Hint-cost preview and numeric scoring

Play hint displays Free before the first playback and the difficulty-specific cost before subsequent clicks, on both the progress-screen control and gameplay replay control. The label updates when difficulty or question changes. Submitting a Sound Match also validates any numeric input against the selected piano expression. Correct arithmetic earns the numeric bonus independently of whether that piano matches the hint. Blank numeric input has no penalty. Incorrect or invalid nonblank numeric input deducts 5 / 10 / 15 points on Easy / Normal / Hard, separately from the wrong Sound Match penalty. A Normal correct piano with wrong arithmetic earns +40; a wrong piano with wrong arithmetic loses 60. The live status shows both scoring components and their total; session points and activity points receive the same delta. `check-score-display.cjs` verifies +61 for a correct match plus numeric answer, separate numeric credit with a wrong Sound Match, and difficulty-aware next-hint costs in both apps.

## Literary Devices and temporary writing progress

The alternating Metaphor/Simile assignment is replaced by a 116-entry static catalog (`data/literary-devices.json`, generated as `literary-devices.js`). Each entry has three examples and stable IDs. Metaphor and Simile remain selectable, with existing tentative highlighting/feedback. Read `literary-device-research.md` for the requested resource review and content boundaries.

`LiterarySession` owns page-memory exploration, verse selections, saved-text snapshots and practice assignment counts independently of piano points, beat layers and song completion. New verse activity IDs use a take ID plus verse index, so archived work cannot populate a new take. Random assignment chooses an unviewed/unassigned device first, then an explored device without saved work, then any device. A random example is selected on assignment; reopening never reassigns it. Switching goals preserves the draft and updates a saved verse's association immediately, as required. Editing a draft leaves its previous saved-text snapshot intact until save.

Completion is derived from the currently saved records, counted once per device. Viewing details or assigning marks exploration; merely listing/searching does not. Reassignment and deletion recalculate completion; removing the last verse returns a device to Explored. First-save score credit is tracked separately so delete/re-save cannot farm points. Deletion does not deduct points or remove earned beats. Earlier takes remain editable in the session library; saved-verse edits and deletions update the shared device counts. Account-free refresh creates a new empty `LiterarySession`, with no progress read/write in localStorage, sessionStorage, IndexedDB or a backend. Existing asset upload storage remains for reusable song definitions/audio only.

The writer provides Change Literary Device and See Literary Devices. The accessible native explorer dialog has search (including aliases), A–Z, All / Not Explored / Explored / Completed / Not Completed filters, explanations, all examples, Use This Device, per-device saved verses, counts and completion bar. The right library groups only devices actually used, rather than rendering 116 activity buttons. The 2016 example screen now follows the selected goal and retains its original illustrations for Metaphor/Simile.

Activity previews preserve authored newlines with no soft wrapping. Desktop width follows measured longest-line text, capped to protect the editor; exceptionally long lines can scroll horizontally inside their preview. At tablet widths, the library becomes a toggle; on small screens activity/history lists are toggles around a full-screen editor. Main-page verse preview scrolling styles are unchanged.

Tests: `tests/literary-session.test.js` covers catalog shape, random priority, exploration, unique/reversible completion, drafts/selections, repeated saves, deletion, library expansion, take IDs and piano/beat independence. `scripts/check-literary-browser.cjs` verifies both apps through actual controls, including browse/search/filter/selection, four-line preview, reassignment/deletion, reopening, 1440/1280/1024/768/390 layouts, keyboard-sized height and full refresh reset. Screenshots are in `qa/literary-*`.

## Feedback and revision acknowledgement

`assessDevice` recomputes evidence from the supplied text; there is no cached verdict to go stale. All 116 catalog IDs have a cue rule and a concrete rewrite task. Results contain exact line indices, original evidence lines, an explanation, and a suggestion. Structural/multi-line patterns highlight all contributing lines. Sound patterns use bundled CMUdict pronunciation data rather than letters alone, with loading/unavailable states. All figurative and meaning-dependent conclusions remain Possible, not certified grades. Needs review does not prove absence.

The writer redraws feedback on every input, including a highlighted evidence preview with line numbers. The existing saved-library card for an edited verse temporarily shows a labeled Draft preview and fresh feedback; the saved-text snapshot remains unchanged until save. Revision history (`revisionCount`, `previousSavedText`) lives only in `LiterarySession`. A changed re-save increments the revision once; unchanged saves do not. Reopening shows Revision saved with an assessment of current saved wording. Deleting clears that revision history. Earlier-take editing and explorer saved cards reuse the same feedback/highlighting. Feedback never affects piano points, device completion, beat earning or song gates.

The screenshot case “The world is like my friend” now recognizes a possessive noun phrase after like. Comparison rules also accept bare nouns, common movement verbs and contractions, and keep literal likes/desires separate.

Validation: 41 logic tests pass, including catalog-wide rule/rewrite coverage, a teaching example for every device, pronunciation-sensitive positive/negative checks, multi-line evidence, live/saved revisions and session revision counting. `check-live-feedback.cjs` verifies the screenshot fix before save and after reopen in both apps, updates in saved-card previews, alliteration/personification/oxymoron feedback, removal of cues, refresh reset, and viewport sizes down to keyboard height. Existing literary-browser, full-song, hint/key economics and numeric penalty checks remain separate regressions.

## Toolbar and example controls

Download lyrics replaces the old Download song label; it still exports the current lyrics/drafts as plain text. Mute sound / Unmute sound is a page-session toggle across both audio engines (pianos/hints and backing stages/stems). Master gains silence active and future sources without resetting scores, hint counts or playback position. It is distinct from Pause song. The lime See Literary Devices toolbar button opens the same explorer from the main screens. Start new take now presents an explicit confirmation describing resets (current rounds/verses/attempts/earned beats) and retained session data (points, difficulty, saved earlier verses and device progress), including a reminder to download unsaved drafts.

The ↻ icon beside the writer example shows the next of three examples, with a 1/3 indicator, and wraps back to the beginning. It changes only the example ID, preserving the draft, saved verse, chosen device, assignment count and completion. The chosen example is retained when reopening within the session. Tests: 42 model tests; `scripts/check-toolbar-examples.cjs` exercises both variants and checks live mute output, toolbar explorer, cycling, text retention and restart cancel/confirm behavior.
