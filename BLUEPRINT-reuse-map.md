# BLUEPRINT reuse map

**Read this before wiring anything new.** A new industry, talk, language or report is **content + config**, never a
new pipeline. Cite the component you reuse (`file:line`) in your build report.

This file is the lookup table: what exists, where it lives, what it's for. Line numbers drift; **name + role are
canonical**. If you cite a line that has moved, fix it here in the same change.

## How to use it
1. Find the row that covers what you're about to build.
2. Reuse it and cite it: `Blueprint: reused <name> (file:line)`.
3. If nothing fits, **say so (that's a finding)**, build it, then **add a row here in the same change**.

Rows marked **PROTOTYPE** are not ported yet: `prototype/index.html` is the reference behavior. When you port one,
point the row at the real file and keep the prototype line as its origin.

---

## Core logic (`src/core/`: pure TypeScript, no React, no Supabase)

| Component | File | Role |
|---|---|---|
| `Talk` · `TalkText` · `TranslationStatus` | `src/core/talks.ts:7` | The one talk shape: id, industries (or `all`), code, minutes, content per language, translation status |
| `talksFor` · `talkFitsClimate` | `src/core/talks.ts:35` · `:29` | Talks for an industry + location. Storm talk only where hurricanes happen; cold talk hidden with no winter |
| `talkText` | `src/core/talks.ts:42` | Talk text in a language, falling back to English |
| `INDUSTRIES` | `src/core/industries.ts:4` | Construction, manufacturing, agriculture & fertilizer, warehouse & logistics |
| `LANGUAGES` | `src/core/languages.ts:4` | Supported languages (ready vs coming soon) with voice codes |
| `climateFor` · `stateForZip` | `src/core/climate.ts:40` · `:34` | ZIP → state → climate (`cold` none/light/full, `hotLong`, `hurricane`). South/Southwest Florida = no cold |
| `buildPlan` | `src/core/plan.ts:46` | **The** plan builder: 52 weeks, seasonal heat/cold/storm by climate, round-robin for the rest, admin overrides |
| `cycleStart` · `thisWeek` | `src/core/plan.ts:26` · `:85` | Week 1 = company program start; rolls into a new cycle every 52 weeks; this week's number and talk |
| `mondayOf` · `isoDay` · `parseDay` · `weekLabel` · `weeksBetween` | `src/core/weeks.ts` | **The** week convention: weeks start Monday, keyed by that Monday's local date. Do not invent a second one |
| `AttendanceStatus` · `countStatuses` · `resolveStatus` | `src/core/attendance.ts:4` · `:16` · `:29` | **The** attendance model: `signed` · `not_signed` · `absent`. Every report counts with this |

## Content

| Component | File | Role |
|---|---|---|
| `TALKS` | `src/content/talks.ts` | The talk library: 15 talks, English + Spanish (draft). Ported from prototype `TALKS` + `ES` |

## Data and access (Supabase)

| Component | File | Role |
|---|---|---|
| companies · company_members · roles · teams · people | `supabase/migrations/20261004000001_companies_people_teams.sql` | Company info, who can sign in (owner/admin/presenter), presenting roles, teams with a lead, people. Composite keys keep a person's team and role inside their own company |
| `private.is_member` · `private.is_admin` | same file `:32` · `:37` | The access checks every RLS policy uses. Reuse them for every new company table |
| `public.create_company` | `supabase/migrations/20261004000002_default_roles.sql` | The only way to create a company; makes the caller its owner and adds the default presenting roles |
| `supabase()` | `src/lib/supabase.ts:7` | The one browser Supabase client. Public URL + anon key only |
| company isolation test | `scripts/db-isolation-test.mjs` | Applies all migrations to a throwaway DB and proves one company can't read or write another's rows; self-checks by switching RLS off. **Extend it for every new company table** |

## App (screens and data access)

| Component | File | Role |
|---|---|---|
| `SessionProvider` · `useSession` | `src/lib/session.tsx` | **The** session: signed-in user, their companies, the current company, sign out |
| company data functions | `src/lib/data/company.ts` | **The** data access for companies, roles, teams, people. Every call is scoped by `company_id` as well as RLS. People are deactivated (`deactivatePerson`), never deleted |
| row types · `canAdmin` | `src/lib/data/types.ts` | Supabase row shapes; who can change setup (owner/admin) |
| `RequireCompany` · `NotConfigured` | `src/components/Guard.tsx` | Gate for every signed-in screen: loading, not configured, signed out → sign-in, no company → setup, admin-only |
| UI kit (`Button`, `ConfirmButton`, `Field`, `Shell`, `Notice`, …) | `src/components/ui.tsx` | Shared, phone-first pieces on the prototype's tokens. `ConfirmButton` = two-tap destructive action |
| `CompanyForm` | `src/components/CompanyForm.tsx` | Company info form used by setup and Admin; rounds Week 1 to Monday, validates ZIP |
| sign-in | `src/app/sign-in/page.tsx` | Email 6-digit code (no passwords, no links), same in browser and phone apps |
| company setup | `src/app/setup/page.tsx` | First company for a new user |
| admin setup | `src/app/admin/page.tsx` | Tabs: People, Teams, Roles, Company. Ported from prototype admin screen |
| home | `src/app/page.tsx` | This week's talk from the company's own plan; company switcher |

## Not ported yet (PROTOTYPE)

| Component | Prototype | Role |
|---|---|---|
| `readAloud` · `pickVoice` · `voiceScore` | `prototype/index.html:576` · `:566` · `:553` | Device text-to-speech fallback with line highlighting. Real app plays pre-generated audio files; this stays as the offline fallback |
| `rosterFor` · `presenters` | `prototype/index.html:851` · `:645` | Team roster (lead first); everyone who isn't a crew member can present |
| `sigPad` | `prototype/index.html:895` | Finger signature capture with timestamp |
| `saveSession` | `prototype/index.html:941` | Builds the saved record: talk, week, team, presenter, every roster person's status |
| `buildPdf` · `pdfName` | `prototype/index.html:967` · `:1049` | **The** PDF record: company header, week line, details, attendance summary, talk content, sign-in sheet with flagged rows, presenter block, no-compliance-claim footer |
| `reportData` · `reports` · `exportCsv` | `prototype/index.html:684` · `:713` · `:764` | **The** report query (talks held, weekly coverage, employee totals, flags) and CSV export |
