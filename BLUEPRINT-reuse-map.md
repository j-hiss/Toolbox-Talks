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
| `distanceMeters` · `nearestJobsite` · `AT_SITE_METERS` · `formatDistance` · `mapsLink` | `src/core/geo.ts` | **The** location math: distance, nearest jobsite with GPS (never guesses a site without one), feet/miles, maps link |
| `buildAttendees` · `recordPayload` · `unsignedPresent` | `src/core/record.ts` | **The** saved-talk builder: every roster person gets one honest status; signatures from absent people are dropped |
| `creditWeek` · `makeupWeeks` · `planWeekAt` · `canMakeUp` · `stillNeeds` · `signedFor` · `canChangeWeek` · `MAKEUP_REASONS` · `makeupReasonText` | `src/core/makeup.ts` | **The** weekly-lock and makeup rules: which week a talk counts toward (makeups keep their real date), past weeks inside the limit with their scheduled talk, who still needs a week, when an admin can still swap a week |
| `AttendanceStatus` · `countStatuses` · `resolveStatus` | `src/core/attendance.ts:4` · `:16` · `:29` | **The** attendance model: `signed` · `not_signed` · `absent`. Every report counts with this |

## Content

| Component | File | Role |
|---|---|---|
| `TALKS` | `src/content/talks.ts` | The talk library: 15 talks, English + Spanish (draft). Ported from prototype `TALKS` + `ES` |

## Data and access (Supabase)

| Component | File | Role |
|---|---|---|
| companies · company_members · roles · teams · people | `supabase/migrations/20261004000001_companies_people_teams.sql` | Company info, who can sign in (owner/admin/presenter), presenting roles, teams with a lead, people. Composite keys keep a person's team and role inside their own company |
| talk_records · talk_attendees · `save_talk_record` | `supabase/migrations/20261005000004_talk_records.sql` | Append-only records with snapshots; select+insert grants only; one-transaction, idempotent save |
| jobsites | `supabase/migrations/20261005000003_jobsites.sql` | Name, address, optional GPS point; no delete grant (deactivate only). `kind` site/office added in …05 |
| plan_overrides · lock trigger · makeup columns | `supabase/migrations/20261005000005_weekly_lock_makeups.sql` | Admin week swaps (members read, admins write); trigger refuses a swap once the week is given or over; `talk_records.makeup_for_week` + required `makeup_reason`; `companies.makeup_weeks` |
| `private.is_member` · `private.is_admin` | same file `:32` · `:37` | The access checks every RLS policy uses. Reuse them for every new company table |
| `public.create_company` | `supabase/migrations/20261004000002_default_roles.sql` | The only way to create a company; makes the caller its owner and adds the default presenting roles |
| `supabase()` | `src/lib/supabase.ts:7` | The one browser Supabase client. Public URL + anon key only |
| company isolation test | `scripts/db-isolation-test.mjs` | Applies all migrations to a throwaway DB and proves one company can't read or write another's rows; self-checks by switching RLS off. **Extend it for every new company table** |

## App (screens and data access)

| Component | File | Role |
|---|---|---|
| `SessionProvider` · `useSession` | `src/lib/session.tsx` | **The** session: signed-in user, their companies, the current company, sign out |
| `getLocation` · `LocationError` | `src/lib/location.ts` | **The** GPS read, with plain-language errors (permission off, no https, timeout) |
| `JobsitePicker` | `src/components/JobsitePicker.tsx` | Today's jobsite: pick from list or "Find nearest"; remembered per company on the device |
| `saveTalkRecord` · `listRecords` · `getRecord` · `signedForWeek` · `listRecordedWeeks` | `src/lib/data/records.ts` | **The** record access. No update/delete on purpose (append-only). Who signed for a week; which weeks are given (locked) |
| `listOverrides` · `setOverride` · `clearOverride` | `src/lib/data/plan.ts` | Admin week swaps; DB enforces the lock |
| `usePlan` | `src/lib/usePlan.ts` | The plan with the admin's swaps, cached on the phone for offline. Every screen that shows a week's talk uses it |
| `MakeupTag` | `src/components/ui.tsx` | "Makeup for the week of … · reason" wherever a record is listed |
| offline outbox · `useOutbox` | `src/lib/outbox.ts` · `src/lib/useOutbox.ts` | **The** offline-first save path: phone first, upload when online, idempotent by `client_id` |
| talk draft | `src/lib/draft.ts` | The talk in progress, saved on the phone after every change |
| `speakLines` · `bestVoice` | `src/lib/speech.ts` | Device read-aloud with line highlighting (offline fallback for recorded audio) |
| `SignaturePad` | `src/components/SignaturePad.tsx` | Finger signature, exported small (≤480 px) to fit the offline outbox |
| crew UI text | `src/content/ui.ts` | Crew-facing lines per language (draft until reviewed) |
| talk flow | `src/app/talk/page.tsx` | (makeup: pick missed week + reason) → read → who's here → sign → saved. This week's talk is locked |
| records | `src/app/records/page.tsx` · `src/app/record/page.tsx` | Records list (waiting + saved) and one record (`/record/#id`) |
| company data functions | `src/lib/data/company.ts` | **The** data access for companies, roles, teams, people. Every call is scoped by `company_id` as well as RLS. People are deactivated (`deactivatePerson`), never deleted |
| row types · `canAdmin` | `src/lib/data/types.ts` | Supabase row shapes; who can change setup (owner/admin) |
| `RequireCompany` · `NotConfigured` | `src/components/Guard.tsx` | Gate for every signed-in screen: loading, not configured, signed out → sign-in, no company → setup, admin-only |
| UI kit (`Button`, `ConfirmButton`, `Field`, `Shell`, `Notice`, …) | `src/components/ui.tsx` | Shared, phone-first pieces on the prototype's tokens. `ConfirmButton` = two-tap destructive action |
| `CompanyForm` | `src/components/CompanyForm.tsx` | Company info form used by setup and Admin; rounds Week 1 to Monday, validates ZIP |
| sign-in | `src/app/sign-in/page.tsx` | Email 6-digit code (no passwords, no links), same in browser and phone apps |
| company setup | `src/app/setup/page.tsx` | First company for a new user |
| admin setup | `src/app/admin/page.tsx` | Tabs: People, Teams, Jobsites (site or office), Plan (swap until given), Roles, Company. Ported from prototype admin screen |
| home | `src/app/page.tsx` | This week's talk from the company's own plan; jobsite picker; company switcher |

## Not ported yet (PROTOTYPE)

| Component | Prototype | Role |
|---|---|---|
| `buildPdf` · `pdfName` | `prototype/index.html:967` · `:1049` | **The** PDF record: company header, week line, details, attendance summary, talk content, sign-in sheet with flagged rows, presenter block, no-compliance-claim footer |
| `reportData` · `reports` · `exportCsv` | `prototype/index.html:684` · `:713` · `:764` | **The** report query (talks held, weekly coverage, employee totals, flags) and CSV export |

## Phone preview

| Component | File | Role |
|---|---|---|
| preview build | `preview/vite.config.ts` | Packs the real screens into one page; the swap list (router, sign-in, data, GPS) lives here |
| demo data | `preview/demo/company.ts` · `records.ts` · `plan.ts` · `store.ts` | Demo twin of `src/lib/data/company.ts`, stored in the browser. Must keep the same exports (enforced by typecheck) |
| demo sign-in | `preview/demo/supabase.ts` | Code `123456` |
| router shims | `preview/shims/` | Stand-ins for `next/link` and `next/navigation` |
