# Song progression audit — 2026-10-14

## Verified current implementation

- Both apps share `web/shared/game.js`, the unchanged original expression bank, and identical original media.
- The question bank contains 19 activity rounds with four question sets each (76 total).
- Correct key: +10; wrong key: -10; Sound Match: +50; wrong match: -50; correct numeric answer: +11; first verse confirmation: +3.
- Unlocks currently use cumulative score milestones of 100, 200, 300, and 400. They occur on answering a question, including mid-round, and stop after four verse unlocks.
- Original code pauses the preceding backing track and plays the next. It does not mix instrument stems.
- Four backing MP3 files exist: makeverse1–4. Browser-decoded durations from the audio QA were approximately 91.24, 94.70, 169.33, and 179.44 seconds. Unequal length plus sequential playback does not establish that these are isolated or synchronized instrument stems.
- Current draft storage contains four strings per app in `<version>-verses`. Confirmation, question progress, and score are not persisted. Existing drafts must be retained and explicitly migrated; they cannot be treated as evidence of a completed song.
- The current writer shows saved verses horizontally. The application shell already keeps desktop gameplay in the viewport and has a focused editor and separate Edubeats2016 screen flow.

## Independent repair completed

Wrong keys now deduct the existing ten points and reset only that piano's remaining sequence. Completed sequences on other pianos are preserved. Repeating already credited steps after a reset does not award points again. A regression test verifies this behavior.

## Decisions resolved with the user

1. Three song rounds with one instrument unlock each can provide only three unlocks, so cannot cycle a four-layer bank. Proposed resolution: three Round Verse groups R1–R3, each containing four earned activity rounds and V1–V4. This yields 12 earned unlock steps per song. Each activity-round completion must meet the selected difficulty requirements before earning its unlock. An alternative is only three activity rounds with grouped layer unlocks, which needs different cycling rules.
2. Treat the four existing MP3s as earned backing-track stages, or mix all earned MP3s? The original assets are not confirmed isolated stems. The first option preserves existing playback while introducing a separate synchronized-stem mode for future uploaded songs; it cannot honestly be described as an isolated-instrument mix for the legacy tracks.

## Implementation contract (now implemented; see song-system.md)

Separate song definitions/assets, difficulty economics, activity-round validation, song progress/persistence, audio playback, and UI adapters. Fix song structure at three Round Verse groups and four verses per group. Do not hardcode audio-layer counts. Preserve accumulated earned asset IDs when a modular layer-unlock cursor wraps. Every new step requires another completed qualifying activity round; score alone must not unlock mid-round. Persist/archive completed songs and keep restart separate from reset. Migrate existing four drafts into R1 V1–V4 without inventing confirmations or math progress. Provide vertical R1/R2/R3 navigation, explicit song preview on gameplay and in the writer, and future-song configuration/upload validation.

Future QA must cover multi-song completion, different layer counts, modulo cursor wrap, difficulty thresholds, round gating, isolated sequence resets, persistence/migration, earned-only audio, archive/restart, and both responsive UI flows.

User confirmed twelve earned activity rounds grouped into R1–R3, and legacy backing-track stages with synchronized stem support for future songs.
