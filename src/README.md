# المختبر الافتراضي للكيمياء التحليلية
Virtual Analytical Chemistry Lab — an interactive lab for the practical part of analytical chemistry (13 experiments + review + mock exam).
Arabic interface (RTL) with English terms and a full English mode.

## How to build
```
node build_free.js        # writes freelab.html (single self-contained page)
```
`freelab_app.html` is the shell (CSS + static markup) with two placeholders:
`/*CHEM*/` ← the `chem_*.js` files, and `/*UIEXT*/` ← all the other JS files, concatenated in the order listed in `build_free.js`.
The ready-to-open page is the separate file `المختبر_الافتراضي_الكيمياء_التحليلية.html`.

## Structure of each week (weeks 1–13)
Routes: `#/ac/w/<week>/<interface>/<part>`

| Interface | Parts |
|---|---|
| 1 `explain` — شرح التجربة | 1.1 `id` (card, goal, why, outcomes) · 1.2 `theory` · 1.3 `rx` (reactions as animated videos + applications) |
| 2 `lab` — المختبر | 2.1 `app` apparatus & safety · 2.2 `mats` week stockroom · 2.3 `eq` laws & worked example · 2.4 `proc` written procedure + film · 2.5 `exp` interactive simulator · 2.6 `obs` observations & errors |
| 3 `assess` — النتائج والتقييم | 3.1 `sheet` worksheet · 3.2 `sum` conclusion · 3.3 `test` levelled test (5 levels) · 3.4 `report` notebook/report |

Weeks 14 (review) and 15 (mock exam) use single-part interfaces. Branch definitions: `lecBranches0()` in `lecture.js`.

## Files
| File | Role |
|---|---|
| `chem_*.js` | Chemistry core: periodic table, equation balancing, formula parsing, solubility, phase data, naming |
| `i18n.js`, `i18n_dict.js`, `inv_en.js` | Language switch. `L(ar,en)`, `isEN()`, dictionary translation of Arabic text in English mode |
| `guide.js` / `guide_en.js` | Per-week content `GW`: title, goal, why, theory, definitions, scientists, laws, reactions, worked example, worksheet |
| `lecture_data.js` / `_en` | Per-week outcomes, written procedure, safety, errors, summary, MCQs |
| `laws.js` / `_en` | Detailed law cards `LAWX` (variables, units, meaning, example) |
| `explain.js` / `_en` | "Idea in plain words", real-world examples, observations, how to read results |
| `stock_data.js`, `stock_ui.js`, `tubes.js` | Samples per experiment and the week stockroom (test-tube cards, filters, "use in experiment") |
| `proc.js` | The interactive simulator: `SIM[w]` = {title, pick, setup, steps, result}; step kinds `choice`/`read`/`calc`/`info`; UI in `procDraw`/`procResult` |
| `bench.js` | Animated SVG bench scenes per simulator step (`BXS[w]`) and the apparatus cards |
| `rxvideo.js` | **Reaction video engine**: frame-rendered SVG (glassware, drops, colour spreading, bubbles, precipitate settling, gas through a delivery tube, thermometer, pH meter, flames) with play/pause/scrub/speed, synced captions and equations. `rvHTML(spec)` + `rvMount(root)` |
| `rxspecs.js` | **Reaction video scripts**: `RVW[week][itemIndex]` for each week's reactions and `RVEQ[equation]` for the reaction atlas. A spec = vessels (`A`, optional `B`), tools, timed events (`drip`, `pour`, `burette`, `col`, `ppt`, `fizz`, `pipe`, `bcol`, `temp`, `ph`, `dis`, `melt`, `boil`, `crys`, `coat`, `gas`, `paper`, `flame`, `burn` …) each with a bilingual caption |
| `live.js` | **Live bench**: each simulator step plays in real time and ends exactly on the value to be read (melting in the capillary, Siwoloboff bubbles, balance digits settling, burette draining with indicator flashes, hydrometer bobbing, pH drift, crystallization). Also `LABNOTE`: a standard-based practical note for every step |
| `unc.js` | **Measurement uncertainty (GUM)**: per-week measurement models and instrument specs (`INSTR`, `UNCDEF`), the uncertainty budget and En shown on the result screen, repeated-trial statistics, and `SOURCES` (primary source of each week's constants) |
| `film.js` | Auto-playing "experiment film" built from the simulator steps |
| `assess.js` | Levelled test (5 levels, randomized numbers) |
| `lecture.js` | Week page rendering: interfaces, parts, numbered sections |
| `portal.js`, `nav.js` | Lab home (`SITE.name`), experiment schedule, routing, breadcrumbs. Old `#/stages` and `#/s/N` links redirect to the schedule `#/ac` |
| `store.js`, `tools.js`, `quiz.js`, `notebook.js`, `rx_atlas.js`, `dev_*.js` | Chemical store, calculators, quizzes, lab notebook, reaction atlas, free interactive devices |

## Notes for editing
- Arabic text goes in the main files; English in the `_en` files or via `L("عربي","English")`.
- Interactive simulator element ids use the `sx` prefix (`sxGo`, `sxIn`, `sxNx` …) — keep ids unique; a duplicate id once made the "Next" button dead.
- Reaction videos: SVG ids are prefixed per player (`rv1…`) so several videos can coexist on a page.
- Repeating the same sample keeps the same unknown and glassware/instrument errors (`FRESH` in proc.js lists what is redrawn); results are judged by En = |Δ|/U ≤ 1.
- Units: solubility in g/100 mL (weeks 6, 7, 13); titrant NaOH 0.1012 M; week 9 aliquot 25.00 mL.
- After any change: rebuild, and check the page in a browser at desktop and phone width.
