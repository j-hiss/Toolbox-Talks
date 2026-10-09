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
| `buildPlan` | `src/core/plan.ts:104` | **The** plan builder: the 52-week cycle as talk periods (1, 2 or 4 weeks by cadence), seasonal heat/cold/storm by climate, round-robin for the rest from the talk list in effect, admin overrides |
| `Cadence` · `CADENCES` · `CadenceSetting` · `cadenceFor` · `nextCadenceWeek` · `periodEnd` · `weekNumbers` | `src/core/plan.ts` | How often a new talk comes (Admin → Plan), the cadence in effect on a Monday, when a change starts (current period's end), period end, "Week 5" / "Weeks 5–8" |
| `periodKeys` | `src/core/makeup.ts` | The plan's talk periods in a date range, newest first, for `buildCompliance` (Home, makeup picker, Reports) |
| `EVENT_KINDS` · `CASE_STATUSES` · `Bulletin` · `sinceLastSettings` · `windowStart` · `selectBulletins` · `bulletinHeading` · `crewSummaryProblems` · `sinceLastSnapshot` | `src/core/safetylog.ts` | **The** safety-log rules: event kinds, citation case status (read as alleged until final), which approved crew summaries a talk reads (window, jobsite scope, kinds), the heading read, crew-summary checks (no roster names, no "compliant/passed"), what the record keeps |
| `loadSinceLast` | `src/lib/sinceLast.ts` | Loads a talk's "Since last talk" section into the draft (offline → marked unavailable, never hidden) |
| `cadenceWarning` | `src/core/staterules.ts` | State meeting-frequency rules (WA weekly, CA every 10 working days, OR monthly; construction) a cadence would fall short of |
| `TalkList` · `listFor` · `talksInPlan` · `nextListWeek` · `talkListProblem` · `isSeasonal` | `src/core/plan.ts` | The company's picked talks (Admin → Talks): which list is in effect for a week, the talks a week draws from (falls back to the industry's), new lists start next Monday, at least one non-seasonal talk |
| `cycleStart` · `thisWeek` (the period containing today) | `src/core/plan.ts:26` · `:85` | Week 1 = company program start; rolls into a new cycle every 52 weeks; this week's number and talk |
| `mondayOf` · `isoDay` · `parseDay` · `weekLabel` · `weeksBetween` | `src/core/weeks.ts` | **The** week convention: weeks start Monday, keyed by that Monday's local date. Do not invent a second one |
| `distanceMeters` · `nearestJobsite` · `AT_SITE_METERS` · `formatDistance` · `mapsLink` | `src/core/geo.ts` | **The** location math: distance, nearest jobsite with GPS (never guesses a site without one), feet/miles, maps link |
| `buildAttendees` · `recordPayload` · `unsignedPresent` | `src/core/record.ts` | **The** saved-talk builder: every roster person gets one honest status; signatures from absent people are dropped |
| `creditWeek` · `makeupWeeks` · `planWeekAt` · `canMakeUp` · `stillNeeds` · `signedFor` · `canChangeWeek` · `MAKEUP_REASONS` · `makeupReasonText` | `src/core/makeup.ts` | **The** weekly-lock and makeup rules: which week a talk counts toward (makeups keep their real date), past weeks inside the limit with their scheduled talk, who still needs a week, when an admin can still swap a week |
| `buildCompliance` · `score` · `onTimeRate` · `onStaff` · `weekKeys` · `makeupDeadline` · `WEEK_STATE_LABEL` · `trend` · `periodChange` · `teamGrid` · `needsMakeup` · `makeupSummary` | `src/core/compliance.ts` | **The** compliance math: every person on staff, every week → on time / made up / open / missed / due. Makeups close a week and stay marked; this week isn't scored; presenters who signed count. Origin: prototype `reportData` (`prototype/index.html:684`) |
| `conditionsFor` · `skyKind` · `worseSky` · `windToward` · `summarizeAlerts` · `conditionNotes` · `attention` · `daySummary` · `siteHour` · `alertAreas` · `parseWindMph` · `rainLevel` · `windLevel` | `src/core/conditions.ts` | **The** work-day weather judgment: rain, wind, thunder and NWS alerts (with instructions and outlines) from the hourly forecast; tomorrow after work hours; the one-sentence day summary; site-local hour labels. Information only, never "safe to work" |
| `WorkSetting` · `WORK_SETTINGS` · `DEFAULT_BY_INDUSTRY` · `workSettingFor` | `src/core/worksetting.ts` | **The** answer to where a company's crews work (outside / inside and outside / inside), defaulting from the industry; `workSettingFor(co, site)`: jobsite's own, else company's, else industry's. Stored as `jobsites.work_setting` / `companies.work_setting` (null = fall through) |
| `weatherNote` · `WEATHER_NOTES_VERSION` · `HEAT_REF` | `src/content/weather-notes.ts` | **The** crew-note wording per work setting, each with its OSHA reference; `conditionNotes(c)` in core picks which notes apply |
| `sunTimes` · `skyPhase` | `src/core/sun.ts` | **The** sunrise/sunset calculation (NOAA equation, no lookup) and dawn/day/dusk/night phase for the sky |
| `heatIndexF` · `heatLevel` · `heatForDay` · `alertWorthy` · `HEAT_LABEL` | `src/core/heat.ts` | **The** heat judgment: NWS heat index formula and chart levels; hottest work hour from an NWS hourly forecast |
| `planImport` · `parseCsv` · `templateCsv` · `IMPORT_COLUMNS` | `src/core/importPeople.ts` | **The** people-import plan: header aliases, add/update/skip with reasons, new crews/roles, matching by Employee ID |
| `planReminders` | `src/core/reminders.ts` | Which phone reminders should be scheduled now (Monday talk, Thursday nudge, makeups running out) |
| `THEME_ROLES` · `DEFAULT_THEME` · `THEME_PRESETS` · `normalizeTheme` · `themeChanges` · `themeVars` · `themeWarnings` · `contrast` · `colorDifference` · `inkOn` | `src/core/theme.ts` | **The** company colors: the eight settable colors, the Signal default (ANSI/ISO safety colors), readable text on each color, and plain-language readability/confusion warnings. Any new color decision goes here, not in a screen |
| `toUpload` · `talkFolder` · `TALK_FILES_BUCKET` | `src/core/record.ts` | **The** split of a saved talk into private files (signatures, crew photo, paper sheet photo) and the record that points at them; fixed paths so retries never duplicate |
| `jobsiteLink` · `siteFromSearch` · `resolveScannedSite` | `src/core/sitelink.ts` | Jobsite QR stickers: the link a sticker carries (`?site=<id>`) and the company-scoped lookup when it's scanned |
| `jobsiteSticker` · `appWebAddress` | `src/lib/sticker.ts` | The printable QR sticker PDF (vector QR via `qrcode`, jsPDF) and the app's web address (`NEXT_PUBLIC_APP_URL`) |
| `holdScan` · `takeScan` | `src/lib/scan.ts` | Keeps a scanned jobsite through sign-in (session storage) and hands it to `JobsitePicker` once |
| `AttendanceStatus` · `countStatuses` · `resolveStatus` · `signedSummary` | `src/core/attendance.ts:4` · `:16` · `:29` · `:39` | **The** attendance model: `signed` · `not_signed` · `absent`. Every report counts with this. `signedSummary` is **the** signed-count line every screen shows ("2 of 3 here signed · 1 absent"; presenter stated separately) |
| `enoughInk` · `MIN_INK_PX` | `src/core/record.ts` | A signature needs real ink (stroke length); a tap or dot isn't taken as signing. Used by `SignaturePad` |

## Content

| Component | File | Role |
|---|---|---|
| `TALKS` | `src/content/talks.ts` | The talk library, English + Spanish (draft). See the TALKS row under Content for counts |

## Data and access (Supabase)

| Component | File | Role |
|---|---|---|
| companies · company_members · roles · teams · people | `supabase/migrations/20261004000001_companies_people_teams.sql` | Company info, who can sign in (owner/admin/presenter), presenting roles, teams with a lead, people. Composite keys keep a person's team and role inside their own company |
| talk_records · talk_attendees · `save_talk_record` | `supabase/migrations/20261005000004_talk_records.sql` | Append-only records with snapshots; select+insert grants only; one-transaction, idempotent save |
| jobsites | `supabase/migrations/20261005000003_jobsites.sql` | Name, address, optional GPS point; no delete grant (deactivate only). `kind` site/office added in …05 |
| `people.deactivated_at` · `private.stamp_deactivated` | `supabase/migrations/20261005000006_people_deactivated_at.sql` | When someone left, stamped by the database; the app can't move it |
| talk_issues · `save_talk` · site_notes · heat | `supabase/migrations/20261005000007_site_notes_heat_issues.sql` | Issues (members read/raise/work, no delete; trigger keeps what was raised); `save_talk(record, attendees, issues)` = record + issues in one idempotent transaction; record columns for site notes and heat |
| safety_events · guard trigger · `crew_bulletins()` · `talk_issues.event_id` · event-files bucket · `companies.since_last_*` | `supabase/migrations/20261008000016_safety_log.sql` | Safety log: admins only, no delete, approved crew summary frozen, withdraw with reason; crews read approved crew-safe columns through `crew_bulletins`; findings are issues; private files admins only |
| company_cadences · lock trigger · `private.period_weeks` · period-aware plan lock · `talk_records.period_weeks` | `supabase/migrations/20261007000015_cadence.sql` | Cadence changes per start Monday (members read, admins write; a started one can't change); plan swaps allowed until the whole period ends; records keep their period length; `save_talk_record` stores it |
| company_talk_lists · lock trigger | `supabase/migrations/20261007000014_talk_lists.sql` | Picked talk lists, one per start Monday (members read, admins write); trigger refuses adding, changing or removing a list that has started, so past weeks keep their talks |
| plan_overrides · lock trigger · makeup columns | `supabase/migrations/20261005000005_weekly_lock_makeups.sql` | Admin week swaps (members read, admins write); trigger refuses a swap once the week is given or over; `talk_records.makeup_for_week` + required `makeup_reason`; `companies.makeup_weeks` |
| `private.is_member` · `private.is_admin` | same file `:32` · `:37` | The access checks every RLS policy uses. Reuse them for every new company table |
| talk-files bucket · `private.file_company` · `private.check_talk_file` · path columns | `supabase/migrations/20261005000009_private_talk_files.sql` | Private storage for signatures and crew photos (company folder, add/read only, no replace/delete); `save_talk_record` accepts files by path and checks each is in this talk's folder and uploaded; `talk_attendees.company_name` for walk-ins |
| `companies.theme` · `private.valid_theme` | `supabase/migrations/20261005000008_company_theme.sql` | A company's changed colors (only known parts, only `#RRGGBB`); admins update their own company under the existing policy |
| `public.create_company` | `supabase/migrations/20261004000002_default_roles.sql` | The only way to create a company; makes the caller its owner and adds the default presenting roles |
| `supabase()` | `src/lib/supabase.ts:7` | The one browser Supabase client. Public URL + anon key only |
| company isolation test | `scripts/db-isolation-test.mjs` | Applies all migrations to a throwaway DB and proves one company can't read or write another's rows; self-checks by switching RLS off. **Extend it for every new company table** |

## App (screens and data access)

| Component | File | Role |
|---|---|---|
| `SessionProvider` · `useSession` | `src/lib/session.tsx` | **The** session: signed-in user, their companies, the current company, sign out |
| `getLocation` · `LocationError` | `src/lib/location.ts` | **The** GPS read, with plain-language errors (permission off, no https, timeout) |
| `JobsitePicker` | `src/components/JobsitePicker.tsx` | Today's jobsite: pick from list, "Find nearest", or a scanned QR sticker; remembered per company on the device |
| `saveTalkRecord` (record + attendees + issues) · `listRecords` · `getRecord` · `signedForWeek` · `listRecordedWeeks` | `src/lib/data/records.ts` | **The** record access. Saving uploads signatures and the crew photo to private storage first, then the record; `getRecord` loads them back through one-minute signed links (older records: inline images). No update/delete on purpose (append-only). Who signed for a week; which weeks are given (locked) |
| `listOverrides` · `setOverride` · `clearOverride` | `src/lib/data/plan.ts` | Admin week swaps; DB enforces the lock |
| `listEvents` · `logEvent` · `updateEvent` · `approveSummary` · `withdrawEvent` · `crewBulletins` · `lastTalkAt` · `uploadEventFile` · `listEventFiles` · `eventFileUrl` | `src/lib/data/safety.ts` | Safety-log access (demo twin `preview/demo/safety.ts` with the same rules). `addFinding` in `src/lib/data/issues.ts` puts a finding on the issues list |
| `listCadences` · `saveCadence` · `removeCadence` | `src/lib/data/plan.ts` | Cadence changes (demo twin with the same lock); `usePlan` loads and caches them for offline |
| `listTalkLists` · `saveTalkList` · `removeTalkList` | `src/lib/data/plan.ts` | Picked talk lists (demo twin in `preview/demo/plan.ts` with the same lock); `usePlan` loads and caches them for offline |
| `usePlan` | `src/lib/usePlan.ts` | The plan with the admin's swaps, cached on the phone for offline. Every screen that shows a week's talk uses it |
| `buildRecordPdf` · `pdfFileName` · `stampParts` · `PDF_FOOTER` | `src/lib/pdf.ts` | **The** PDF record, built only from the saved record: company header, week line (or makeup week + real week + reason), details with GPS, attendance summary, talk text that was read, sign-in sheet with full date and time on every signature line and flagged rows shaded, presenter block, no-compliance footer. Origin: prototype `buildPdf` (`prototype/index.html:967`) |
| `saveFile` | `src/lib/download.ts` | **The** file hand-off: share sheet on phones, download on computers. Preview twin: `preview/demo/download.ts` |
| `reportPeople` · `reportRecords` | `src/lib/data/reports.ts` | **The** report query layer: all people incl. deactivated (with dates), records held in or making up weeks in range. No signatures loaded |
| `TrendChart` · `TeamGrid` · `HBars` · `BANDS` · `bandOf` | `src/components/charts.tsx` | **The** report charts, hand-built on app tokens (`--series-1/2`, `--grid`, `--band-*` in `globals.css`; series follow the brand and button colors, bands follow done/caution/missed). Reuse these for any new chart |
| reports screen | `src/app/reports/page.tsx` | Score card, by week (tap for who), by person, flags, CSV export. Admins only |
| `checkConditions` · `cachedConditions` · `checkHeat` · `cachedHeat` | `src/lib/weather.ts` | Live work-day conditions (forecast + active alerts, 15-minute reuse) for Home, and | Today's heat from api.weather.gov, cached on the phone for the day. Preview twin returns an example forecast |
| `listIssues` · `listIssuesForRecord` · `updateIssue` | `src/lib/data/issues.ts` | Crew-raised issues (new ones save with their talk via `saveTalkRecord` → `save_talk`) |
| `IssuesList` · `isOverdue` | `src/components/Issues.tsx` | Records → Issues: open/fixed, overdue first, edit panel, mark fixed with Undo |
| `SafetyLog` | `src/components/SafetyLog.tsx` | Admin → Safety log: "Since last talk" settings, log an event (kind fields, admin-only details, crew summary with live checks, file), approve, case status, files, findings → issues, close, withdraw |
| `CadencePicker` | `src/components/CadencePicker.tsx` | Admin → Plan → How often: every week / 2 weeks / 4 weeks, starts when the current period ends, state-rule warning, undo |
| `TalkPicker` | `src/components/TalkPicker.tsx` | Admin → Talks: browse all talks (search, by industry), pick the plan's talks, save from next Monday, undo a list that hasn't started |
| `ImportPeople` | `src/components/ImportPeople.tsx` | Admin → People → Import sheet: pick file, preview plan, import |
| `tileXY` · `tilesFor` · `milesAcross` | `src/core/maptiles.ts` | **The** web-map tile math (which tiles cover a view around a point, and where each goes). Reuse for any future map |
| `RadarMap` · `BASEMAP` · `RADAR` · `RADAR_SPANS` · `radarFrames` · `radarStamp` · `guessLatest` · `agoLabel` · `radarLatest` · `findValid` | `src/components/RadarMap.tsx` · `src/lib/radar.ts` | Radar loop over a street map centered on the jobsite, 1h/3h/6h loops (13 frames each; archive tiles by UTC time past 50 minutes), warning outlines (`areas`) drawn on top and scan clock times; tile sources in one place (swap the street map provider there) |
| `WeatherCard` · `WeatherFull` · `weatherView` · `Toggle` | `src/components/Weather.tsx` | Home's live jobsite weather card and its full-screen forecast; one view model (`weatherView`) feeds both; `Toggle` is the one open/close row (hourly, radar). Auto-refresh; reduced motion respected. Animations in `globals.css` (`wx-*`) |
| `Sky` · `skyBackground` · `SkyIcon` · `SkyIconDefs` · `SunEventIcon` | `src/components/weather/Sky.tsx` | **The** weather drawing: animated sky by forecast and dawn/day/dusk/night, shaded sky icons (shared gradients defined once), sunrise/sunset icons |
| `HourStrip` | `src/components/weather/HourStrip.tsx` | **The** hour-by-hour strip: icons, temperature curve, feels-like, rain bars, wind, sunrise/sunset markers, tap for details |
| `applyReminders` · `setReminders` · `remindersSupported` | `src/lib/reminders.ts` | Phone-scheduled notifications (Capacitor Local Notifications); no-op on the website |
| `TALKS` | `src/content/talks.ts` | **The** talk library (187 talks; every one of the 18 industries gets 32-61 incl. shared and Every-job talks). Every talk lists its `sources`; evidence trail in `docs/talk-evidence/`; coverage tracked in the shared doc "Talk Library: OSHA Coverage Map" |
| `heatReminder` | `src/content/heat.ts` | The heat reminder text (EN reviewed, ES draft), versioned |
| `signingStatement` · `SIGNING_STATEMENT_VERSION` | `src/content/ui.ts` | **The** statement crew tap before signing, saved with each record (`SigningStatement` in `src/core/record.ts`; `confirmed_at` per attendee; printed by `buildRecordPdf`) |
| `MakeupTag` | `src/components/ui.tsx` | "Makeup for the week of … · reason" wherever a record is listed |
| offline outbox · `useOutbox` | `src/lib/outbox.ts` · `src/lib/useOutbox.ts` | **The** offline-first save path: phone first, upload when online, idempotent by `client_id` |
| talk draft · `newMakeupDraft` | `src/lib/draft.ts` | The talk in progress, saved on the phone after every change. `newMakeupDraft` starts a makeup already pointed at a week and the people who owe it |
| `useOpenMakeups` | `src/lib/useOpenMakeups.ts` | Who still owes each makeup-able week (report layer + `buildCompliance`), for the makeup picker |
| `speakLines` · `bestVoice` | `src/lib/speech.ts` | Device read-aloud with line highlighting (offline fallback for recorded audio) |
| `SignaturePad` | `src/components/SignaturePad.tsx` | Finger signature, exported small (≤480 px) to fit the offline outbox. `tall` for the one-person-at-a-time sign screen |
| crew UI text | `src/content/ui.ts` | Crew-facing lines per language (draft until reviewed) |
| talk flow | `src/app/talk/page.tsx` | (makeup: pick missed week + reason) → read (pinned play/done bar, text size) → who's here → sign one person at a time (Next / Isn't here / Skip) → review → saved. This week's talk is locked |
| records | `src/app/records/page.tsx` · `src/app/record/page.tsx` | Records list (waiting + saved) and one record (`/record/#id`) |
| company data functions | `src/lib/data/company.ts` | **The** data access for companies, roles, teams, people. Every call is scoped by `company_id` as well as RLS. People are deactivated (`deactivatePerson`), never deleted |
| row types · `canAdmin` | `src/lib/data/types.ts` | Supabase row shapes; who can change setup (owner/admin) |
| `RequireCompany` · `NotConfigured` | `src/components/Guard.tsx` | Gate for every signed-in screen: loading, not configured, signed out → sign-in, no company → setup, admin-only |
| `applyTheme` · `rememberedTheme` · `CompanyColors` | `src/lib/theme.ts` · `src/components/Providers.tsx` | **The** way colors reach the page: sets the `--t-*` variables `globals.css` derives everything from; remembers the last company's colors on the phone |
| `CrewPhoto` · `shrinkPhoto` · `fitWithin` | `src/components/CrewPhoto.tsx` · `src/lib/photo.ts` | Optional photos on the review screen: `kind="photo"` (crew photo) or `kind="sheet"` (paper sign-in sheet, larger, evidence only); shrinks on the phone before it's kept |
| `PRETASK_TALK_ID` · `pretaskProblems` · `pretaskContent` · `tidyPlan` · `EQUIPMENT_PROMPTS` · `HAZARD_SUGGESTIONS` · `DAILY_STATEMENT` · `dailyTally` | `src/core/pretask.ts` | **The** daily pre-task plan rules and content; saved as a talk record of kind `daily` (same pipeline), never scored |
| `PretaskPlanStep` · `newDailyDraft` · `useHeatCheck` | `src/components/PretaskPlanStep.tsx` · `src/lib/draft.ts` · `src/lib/useHeatCheck.ts` | Step 1 of a daily plan; starting one; the one heat check used by talks and daily plans |
| `listDailyPlans` | `src/lib/data/reports.ts` | Days with a daily plan (held time, crew) for Reports; never part of the weekly math |
| `RepeatSetting` · `repeatsFor` · `REPEAT_CHOICES` (in `buildPlan`) | `src/core/plan.ts` | Repeat talks: each placed at least once per 3/6/12-month block; same plan builder, no second one |
| `REPEAT_NOTES` · `repeatNoteText` | `src/content/repeats.ts` | What a rule asks on a fixed schedule, per talk; shown on Read and in the picker; never claims a talk satisfies it |
| `RepeatPicker` · `listRepeats` · `saveRepeat` · `removeRepeat` | `src/components/RepeatPicker.tsx` · `src/lib/data/plan.ts` | Admin → Plan → Repeat talks |
| `LateArrival` | `src/app/talk/page.tsx` | "+ Someone arrived late" on the review screen: adds a walk-in and jumps to their signing turn |
| `Fold` | `src/app/reports/page.tsx` | A report section that folds away (closed by default) so Reports stays short on a phone |
| `readWalkinCompanies` · `rememberWalkinCompany` | `src/lib/lastSetup.ts` | Walk-in companies used on this phone, suggested next time |
| `BrandEditor` | `src/components/BrandEditor.tsx` | Admin → Brand: presets, a picker + hex per color, live sample, warnings, save / undo / back to default |
| UI kit (`Button`, `ConfirmButton`, `Field`, `Shell`, `Notice`, `Sheet`, `Loading`, …) | `src/components/ui.tsx` | Shared, phone-first pieces on the theme tokens (`globals.css`; `bg-brand`, `bg-action`, `bg-ok-bg`, `bg-caution-bg`, `bg-warn`…). `Button` variants primary (action color) · soft (brand tint) · ghost · danger. `Mark` = app mark in the brand color. `Shell` = header (mark + company name) + offline/upload pill + bottom tab bar (`tabs={false}` for focused flows). `Sheet` = slide-up edit panel. `Loading` = skeleton rows. `ConfirmButton` = two-tap destructive action (prefer an Undo toast where the action can be reversed). `Notice tone="caution"` = warnings people must not miss (draft translation, data not loaded). `ErrorNotice` = plain-words error + Try again + details. `FileButton` = styled file picker. `Shell lockHeader` = no way out through the header while crew sign. Disabled buttons render as a dashed outline with readable text |
| `toast` · `Toaster` · `buzz` | `src/components/toast.tsx` | **The** feedback message (optionally with Undo), shown under the header and cleared on navigation; `buzz` = short vibration where supported |
| `useHomeStatus` · `WeekStatusCard` · `GettingStarted` | `src/components/HomeCards.tsx` | Home's this-week-by-crew card (+ who owes a makeup) and the new-company checklist. Built on the report query layer + `buildCompliance` |
| `readLastSetup` · `writeLastSetup` | `src/lib/lastSetup.ts` | Last presenter, crew and place on this phone; `newDraft` starts from it |
| `CompanyForm` | `src/components/CompanyForm.tsx` | Company info form used by setup and Admin; rounds Week 1 to Monday, validates ZIP |
| sign-in | `src/app/sign-in/page.tsx` | Email 6-digit code (no passwords, no links), same in browser and phone apps |
| company setup | `src/app/setup/page.tsx` | First company for a new user |
| admin setup | `src/app/admin/page.tsx` | Tabs: People, Teams, Jobsites (site or office), Plan (swap until given), Roles, Company. Ported from prototype admin screen |
| home | `src/app/page.tsx` | This week's talk from the company's own plan; jobsite picker; company switcher |

## Not ported yet (PROTOTYPE)

| Component | Prototype | Role |
|---|---|---|
| _(nothing left: reports and the PDF are ported)_ | | |

## Local test data

| Component | File | Role |
|---|---|---|
| `buildSeed` · `staffDates` · `rng` | `scripts/seed/build.ts` | Plans the local test company and ~12 weeks of history with the app's own rules (`planWeekAt`, `MAKEUP_REASONS`, `heatLevel`). Pure and repeatable; tested against `buildCompliance` |
| `exampleSignature` · `examplePhoto` · `encodePng` | `scripts/seed/png.ts` | Made-up signature scribbles and drawn "crew photos" as PNGs, no extra packages |
| `npm run seed` | `scripts/seed-local.ts` | Saves that plan into the LOCAL database the way the app does (`recordPayload` → `buildAttendees` → `toUpload` → Storage → `save_talk`) as a test owner; local-only guard; replaces the previous test company |

## Phone preview

| Component | File | Role |
|---|---|---|
| preview build | `preview/vite.config.ts` | Packs the real screens into one page; the swap list (router, sign-in, data, GPS) lives here |
| demo data | `preview/demo/company.ts` · `records.ts` · `plan.ts` · `reports.ts` · `store.ts` | Demo twin of `src/lib/data/company.ts`, stored in the browser. Must keep the same exports (enforced by typecheck) |
| demo sign-in | `preview/demo/supabase.ts` | Code `123456` |
| example history | `preview/demo/example.ts` | Preview-only "Add example history": people named "Example …", eight past weeks, misses and makeups |
| router shims | `preview/shims/` | Stand-ins for `next/link` and `next/navigation` |
