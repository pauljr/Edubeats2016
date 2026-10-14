# Edubeats2016: Math meets the mic

This repository preserves the original Android/Cordova project and adds the reviewed browser app.

The web app combines order-of-operations piano challenges, earned backing stages, three rounds of four verses, and a 116-device writing explorer with live feedback. Progress is held only in page memory; refresh clears it. Download lyrics keeps a text copy. Uploaded song definitions and audio are reusable local assets, separate from learner progress.

## Build and review

Requires Python 3 and Node 22+ for tests. No production npm dependencies or backend are needed.

```sh
python3 scripts/build-web.py
npm test
python3 -m http.server 4173 --directory web
```

Open http://localhost:4173/ in a browser. The production-ready static directory is `web/`, with this app at its domain root. The 2016 edition retains its welcome/progress/gameplay/writing flow.

## Source

- `web-src/template.html`: this edition's interface.
- `web-src/shared/`: runtime, styles, audio, scoring, progression, session writing and feedback modules.
- `data/literary-devices.json`: editable device definitions and three examples each.
- `assets/`: original project assets, retained unchanged.
- `web/`: generated standalone app; committed for reproducible static publication.
- `tests/`: logic and session regression checks.
- `docs/`: system behavior, original-logic audit, source research and feedback limitations.
- `examples/stem-song.json`: configurable future song definition.

Sound checks use the locally bundled Carnegie Mellon Pronouncing Dictionary, with its license in `web-src/shared/cmudict-LICENSE`. Literary interpretations are tentative cues, not semantic grades.

## Release scope

Edubeats2016 is source-only for this release. Do not create or deploy a hosting project for this edition.

Optional browser smoke check: install development dependencies with `npm install`, install Chromium with `npx playwright install chromium`, start the local server, then run `npm run test:browser`. Set `EDUBEATS_REVIEW_URL` to check another origin.
