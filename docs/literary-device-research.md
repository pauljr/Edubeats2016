# Literary Devices: source review and content decisions

Reviewed October 14, 2026. Implementation serves both Edubeats variants locally. No deployment, account system, database, or persistent activity store was added.

## Requested resources

| Resource | Access and useful material | Decision |
|---|---|---|
| [Rap Genius glossary](https://genius.com/Rap-genius-glossary-of-literary-devices-and-forms-of-wordplay-used-in-hip-hop-lyrics) | Direct fetch failed. A [UC Irvine-hosted Rap on Trial guide](https://bpb-us-e2.wpmucdn.com/sites.uci.edu/dist/d/2220/files/2021/06/Rap-on-Trial-Legal-Guide-v1.0.pdf) cites it as covering over 100 techniques. The glossary itself could not be verified. | Do not claim to have read or reproduced its full catalog. Provide our own extensible catalog. |
| [Hip Hop Guide to Poetic Devices handout](https://www.scribd.com/document/604091593/Poetic-Devices-Hip-Hop-Handout) | The two-page text was readable. It connects comparison, sound, repetition and wordplay with hip-hop examples. | Cover its core terms with newly written classroom examples. Refine consonance to include internal sounds. Some examples are weak demonstrations: money slang does not by itself prove euphemism; a figurative comparison is not automatically an oxymoron; alliteration alone does not demonstrate harsh cacophony. |
| [Techniques in Hip-Hop](https://www.scribd.com/doc/239428642/Techniques-in-Hip-Hop) | Fetch timed out; canonical document URL was also inaccessible. | Contents remain unverified. Do not invent a summary or copy presumed examples. |
| [Rhetorical Devices in Hip Hop](https://ultracrepidarian.home.blog/2019/02/24/rhetorical-devices-in-hip-hop/) | Readable discussion of sound patterns, repeated openings, questions and classical figures. | Useful discovery prompts, not a definitive glossary. Immediate repetition is narrower than repeated whole sentences. A strange lyric alone is not evidence of catachresis. Dialect is not automatically a grammatical mistake. Avoid its disparaging framing and explicit song quotations in student content. |
| [Poetic Devices in Rap Music](https://prezi.com/zl9tcjcrx-sz/poetic-devices-in-rap-music/) | Readable transcript connecting rap and poetry through rhyme, vowel sound, stress and delivery. | Include rhyme types, meter and line structure. Do not adopt sweeping claims about early versus modern rap or confuse free verse with improvised freestyle. |

## Definition references and distinctions

Cross-checks used Gideon O. Burton's **Silva Rhetoricae**, Brigham Young University ([schemes](https://rhetoric.byu.edu/Figures/Schemes.htm), [tropes](https://rhetoric.byu.edu/Figures/Tropes.htm)), and the [Academy of American Poets glossary](https://poets.org/glossary). These distinguish patterns of arrangement from figurative meaning and place poetic forms alongside devices. Our student explanations are concise paraphrases; examples were composed for the app, rather than extracted from the supplied song lyrics. Some familiar examples remain, including the user's stage comparison.

Specific checks:

- [Anacoluthon](https://rhetoric.byu.edu/Figures/A/~anacoluthon.htm): an expected grammatical structure is interrupted or changed, rather than merely taking a pause.
- [Diacope](https://rhetoric.byu.edu/Figures/D/diacope.htm): intervening words separate repeated wording; epizeuxis has no intervening words.
- [Procatalepsis](https://rhetoric.byu.edu/Figures/P/procatalepsis.htm): anticipate and answer an objection.
- [Symploce](https://rhetoric.byu.edu/Figures/S/symploce.htm): repeat both beginnings and endings; this is a distinct combination, not a duplicate synonym for either component.
- [Epanorthosis](https://rhetoric.byu.edu/Figures/E/epanorthosis.htm): self-correction intensifies a thought.
- [Aposiopesis](https://rhetoric.byu.edu/Figures/A/aposiopesis.htm): deliberately break off speech.
- [Paralipsis](https://rhetoric.byu.edu/Figures/P/paralipsis.htm): mentioning by pretending to pass over. Modern “apophasis” is searchable as an alias, rather than a second counted entry; BYU uses that name for a different elimination figure.
- [Zeugma](https://rhetoric.byu.edu/Figures/Z/zeugma.htm): one governing word links several terms; our examples teach the comic difference in meanings often called syllepsis, which is not added as a duplicate entry.

The catalog contains **116 entries and 348 examples** under the single heading Literary Devices. It includes broader writing tools (tone, diction, imagery, narrative techniques), precise rhetorical figures, and practical poetic forms/sound patterns. Related parent/subtype concepts have different descriptions and exercises; alternate names are searchable aliases, not separate completion credits. Eye rhyme examples explicitly use words that do not rhyme aloud. Multi-line examples use actual line breaks. Capital letters in meter examples mark stresses; a performed reading can change those stresses.

## Educational feedback boundary

Completion means at least one currently saved verse is associated with the device, not that a machine has certified its use. All 116 devices now have an explainable cue check and a device-specific revision suggestion. Metaphor/simile interpretation remains tentative. Sound checks use local pronunciation data; structural checks find repetition, line counts, rhyme, and grammatical cues; meaning-dependent checks use visible contextual signals. No detected cue is treated as a certified semantic grade, and Needs review means no recognized cue was found rather than proof that the device is absent. No LLM call or semantic literary grading has been added.

## Source and extension workflow

`data/literary-devices.json` is the single editable catalog. `scripts/build.py` generates the shared runtime module and both local/static app bundles. Entries have stable device/example IDs, description, exactly three examples, aliases, tags, difficulty, grade levels and standards. Optional metadata can be expanded without changing progress rules. Adding an entry changes the progress denominator automatically. Preserve existing IDs when editing wording.

## Live feedback extension

Pronunciation checks use the [Carnegie Mellon Pronouncing Dictionary](https://github.com/cmusphinx/cmudict), bundled locally as `web/shared/pronunciations.json` with its license. This is US English pronunciation data with known omissions; alternate accents and performed stress can differ. We retain pronunciations for 124,926 word entries, with a documented compound reading for streetlights. No verse is uploaded to an external service.

Rules are separate from definitions (`literary-patterns.js`, `literary-structures.js`, `literary-sound.js`). Every catalog device has a rule and a specific rewrite task; each recognizes at least one catalog teaching example in the tests. That fixture coverage is not a measure of recall on arbitrary poetry. Semantic checks use contextual phrase patterns and have a narrower recognition range than a human reading. If a valid creative use is not detected, the UI explicitly allows that possibility and offers a device-specific example rather than declaring the verse wrong.
