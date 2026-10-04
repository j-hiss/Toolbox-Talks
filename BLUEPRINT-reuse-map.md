# BLUEPRINT reuse map

**Read this before wiring anything new.** A new industry, talk, language or report is **content + config**, never a
new pipeline. Cite the component you reuse (`file:line`) in your build report.

This file is the lookup table: what exists, where it lives, what it's for. Line numbers drift; **name + role are
canonical**. If you cite a line that has moved, fix it here in the same change.

## How to use it
1. Find the row that covers what you're about to build.
2. Reuse it and cite it: `Blueprint: reused <name> (file:line)`.
3. If nothing fits, **say so (that's a finding)**, build it, then **add a row here in the same change**.

## Status of this map
The real app has not been built yet. Every row below points at the **prototype** (`prototype/index.html`), which is
the reference behavior. When a component is ported, change its row to the real file and mark the prototype line as
the origin. Do not build a second version of anything listed here.

---

## Content: talks, industries, languages

| Component | Prototype | Role |
|---|---|---|
| `TALKS` | `prototype/index.html:184` | The talk library. Each talk: `id`, `ind` (industries or `all`), `code` (OSHA standard or topic tag), `title`, `hook`, `sections[]`, `ask`. One shape for every talk |
| `ES` | `prototype/index.html:297` | Spanish versions keyed by talk id, same structure as English. Every translated talk must match the English section/item counts |
| `INDUSTRIES` | `prototype/index.html:395` | Industry list (construction, manufacturing, agriculture & fertilizer, warehouse & logistics) |
| `talksFor` · `talkFits` | `prototype/index.html:417` · `:381` | Which talks apply to an industry + location. Hurricane talk only where hurricanes happen; cold talk hidden where there's no winter |
| `LANGS` · `UI` | `prototype/index.html:382` · `:390` | Supported languages (ready vs coming soon) and the crew-facing UI strings per language |

## Location and the 52-week plan

| Component | Prototype | Role |
|---|---|---|
| `ZIP3` · `climateFor` | `prototype/index.html:368` · `:372` | ZIP prefix → state → climate profile (`cold`: none/light/full, `hotLong`, `hurricane`). South and Southwest Florida split out as no-cold |
| `buildPlan` | `prototype/index.html:418` | **The** plan builder: 52 weeks, seasonal heat/cold/storm placement by climate, round-robin for the rest, per-week overrides |
| `cycleStart` · `thisWeek` | `prototype/index.html:438` · `:442` | Week 1 anchored to the company's program start date; returns this week's number (1–52) and scheduled talk |
| `mondayOf` · `isoDay` · `weekLabel` | `prototype/index.html:415`–`:445` | The week convention: weeks start Monday, keyed by ISO date. Do not invent a second one |

## Presenting

| Component | Prototype | Role |
|---|---|---|
| `readAloud` · `pickVoice` · `voiceScore` | `prototype/index.html:576` · `:566` · `:553` | Device text-to-speech fallback with line highlighting and pauses. Replaced by pre-generated audio files in the real app (see SPEC: Voice), kept as the offline fallback |

## Company admin, teams, attendance

| Component | Prototype | Role |
|---|---|---|
| company / roles / people / teams model | `prototype/index.html:629` (`exampleOrg`) | Company info (name, licenses, address, phone), roles that can present, people (name, role, team), teams (name, lead) |
| `presenters` | `prototype/index.html:645` | Anyone whose role isn't "Crew member" can give a talk |
| `rosterFor` | `prototype/index.html:851` | A team's roster, team lead first |
| `saveSession` | `prototype/index.html:941` | Builds the saved record: talk, week, team, presenter, every roster person with a status |
| `counts` · `STATUS` | `prototype/index.html:958` | **The** attendance status model: `signed` · `unsigned` (shown "Not signed") · `absent`. Every report counts with this |
| `sigPad` | `prototype/index.html:895` | Finger signature capture with timestamp |

## Records, PDF, reports

| Component | Prototype | Role |
|---|---|---|
| `buildPdf` · `pdfName` | `prototype/index.html:967` · `:1049` | **The** PDF record: company header, week line (scheduled vs substitute), details, attendance summary, talk content, sign-in sheet with flagged rows, presenter block, no-compliance-claim footer |
| `reportData` | `prototype/index.html:684` | **The** report query: talks held, weekly coverage per team (held / missed / this week open), employee totals, flags, sign-in rate |
| `reports` · `exportCsv` | `prototype/index.html:713` · `:764` | Admin reports screen and CSV export (one row per person per talk) |
