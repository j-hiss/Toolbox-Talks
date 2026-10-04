# CLAUDE.md — read before you build

Toolbox Talks (working name in the prototype: Tailgate Talks) is a company-neutral, multi-company app for running
weekly safety toolbox talks: pick the week's talk, read it to the crew (in their language, or have the phone read it),
collect signatures, and keep a PDF record an owner can hand to OSHA or an insurer.

It is built separately from RomanOS. Roman Roofing is a **customer** of this app (company #1), never
a dependency. Nothing in this repo is Roman Roofing–specific.

## Platforms and stack
One codebase ships three ways: the **website**, the **iPhone app**, and the **Android app**.
- **Next.js (App Router) built as a static export** (`output: "export"` → `out/`). No server code: no API routes,
  server actions, middleware, or runtime image optimization. Anything that seems to need a server is a database
  function or an offline script instead. Raise it as a finding before adding a server.
- **Capacitor** wraps `out/` as the iPhone and Android apps (`capacitor.config.ts`). Native projects live in `ios/`
  and `android/`, generated on a Mac.
- **Supabase** (Postgres, Auth, Storage) is the only backend. The browser talks to it directly; row-level security is
  what keeps companies apart. Schema changes are SQL files in `supabase/migrations/`. No Prisma (it needs a server).
- **Local first.** Everything runs on a Mac with local Supabase (`npm run db:start`). No cloud account is needed to
  build or test.
- **Offline-first.** Jobsites lose signal. Talks, audio and signatures must save on the device and upload when the
  connection returns. Design every flow for that.
- **Phones first.** The foreman's phone is the main screen; the office computer is second.
- **Core logic stays separate from screens.** `src/core/` is pure TypeScript (no React, no Supabase, no
  `"use client"`): plan, climate, attendance, talks. Screens call it; they never re-implement it.

## Before you build (every task)
1. Read **`docs/SPEC.md`** (what the product does and why) and **`BLUEPRINT-reuse-map.md`** (what already exists).
2. Read the **area `CLAUDE.md`** where you're working, once areas have them.
3. **Grep before adding.** The thing you're about to write probably exists. The prototype (`prototype/index.html`)
   is the reference behavior: port its logic, don't reinvent it.
4. Read **`docs/lessons-learned.md`**. Those mistakes were already paid for on another project.

## Blueprint check (every build, before wiring anything new)
Consult `BLUEPRINT-reuse-map.md` and **cite the component you're reusing (file:line)**. A new industry, talk, language
or report is **content + config**, never a new pipeline. If nothing fits and you must build new: say so (that's a
finding), then **add the new component to the blueprint in the same change**. Line numbers drift; name + role are
canonical. Fix a stale line reference when you touch it.

## Pre-build checklist (must pass, and be reported)
- **Reuse, don't clone.** One plan builder, one PDF builder, one attendance-status model, one report query layer.
  A second copy is a defect.
- **Change no shared code unless essential.** If you must, run the full test suite and say so in the report.
- **Every query is company-scoped.** No query, route, storage path, or report runs without a `company_id` filter,
  and Supabase RLS enforces it independently of app code. A test that can't fail on a cross-company read is not a test.
- **New migration?** Additive by default. One monotonic counter; never edit or renumber a migration that has been
  applied. Destructive changes (drop, rename, type change) are proposed in the report and wait for Joe's go.
- **Before you push:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:db` when
  the schema changed. Each as its own command.
- **Content is data, not code.** Talks, translations, and audio files live in the content store with a version.
  Changing a talk's wording creates a new version; existing records keep pointing at the version that was read.

## Hard invariants (never relax)
- **Tenant isolation.** A company only ever sees its own people, teams, records, signatures, and reports. RLS on every
  table holding company data; the Supabase service-role key never reaches the browser.
- **Records are append-only.** A saved attendance record (talk version, roster, statuses, signatures, timestamps,
  presenter) is never edited in place. A correction is a new linked record with a reason. The PDF regenerated from
  a record must match what was signed.
- **Honest status, never hidden.** Every person on the roster ends as `signed`, `not_signed`, or `absent`. Flags are
  never dropped to make a report look better. Zero records for a week is "missed", not "fine".
- **No compliance claims.** The app documents safety meetings. It never says or implies a company is "OSHA
  compliant". The PDF footer carries this.
- **Company-neutral.** No customer's name, logo, licenses, or data in code, seeds, tests, or fixtures. Examples are
  labelled as examples.
- **Translations are reviewed before they ship.** Machine or Claude translations are `draft` until a native speaker
  marks them `reviewed`. Safety wording is not guessed.
- **Voice licenses are checked before use.** No voice model is used for shipped audio until it has a row in
  `docs/voice-licenses.md` showing commercial use is allowed.
- **Signatures and PII stay private.** Signature images and employee data live in private storage, served by
  short-lived signed URLs, never public buckets.

## Push discipline
- Run tests as their **own command** and read the exit code. Push is a **separate** command. Never chain
  `npm test && git push`.
- Green pushes. Red **holds**, and the report says what failed.
- Commit attribution on every Claude-authored commit:
  ```
  Co-Authored-By: Claude <noreply@anthropic.com>
  Claude-Session: <session link>
  ```
- Verify claims against the code and git history, not against a summary. A report is a hypothesis; the commit is the fact.

## Report contract (end every change with)
**Blueprint: reused X (file:line) · new components added: Y/none** · **nothing duplicated** · **shared code untouched**
(or: changed + suite run, N/N green) · **invariants upheld** (tenant isolation, append-only records, honest status,
no compliance claim, company-neutral) · **what was verified and how** (and anything that could not be verified).

## Working with Joe
Joe uses voice transcription and prefers direct answers with clear steps. Stop and ask rather than guess. Read the
actual error text before proposing a cause. Weigh logs, queries and real samples over inference, and update a
conclusion as soon as new evidence contradicts it.
