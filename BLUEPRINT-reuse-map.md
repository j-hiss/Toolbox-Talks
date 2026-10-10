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
| `talksFor` · `talkFitsClimate` | `src/core/talks.ts:37` · `:31` | Talks for an industry + location, the trade's own and Every-job talks first, then borrowed ones (roofing → construction). Storm talk only where hurricanes happen; cold talk hidden with no winter |
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
| `buildCompliance` · `score` · `onTimeRate` · `onStaff` · `weekKeys` · `makeupDeadline` · `WEEK_STATE_LABEL` · `trend` · `periodChange` · `teamGrid` · `needsMakeup` · `makeupSummary` · `talkStreak` | `src/core/compliance.ts` | **The** compliance math: every person on staff, every week → on time / made up / open / missed / due. Makeups close a week and stay marked; this week isn't scored; presenters who signed count. `talkStreak` = periods in a row with a talk held (from `periodKeys` + `listRecordedWeeks`; makeups don't repair it; misses shown). Origin: prototype `reportData` (`prototype/index.html:684`) |
| `conditionsFor` · `skyKind` · `worseSky` · `windToward` · `summarizeAlerts` · `conditionNotes` · `attention` · `daySummary` · `siteHour` · `alertAreas` · `parseWindMph` · `rainLevel` · `windLevel` | `src/core/conditions.ts` | **The** work-day weather judgment: rain, wind, thunder and NWS alerts (with instructions and outlines) from the hourly forecast; tomorrow after work hours; the one-sentence day summary; site-local hour labels. Information only, never "safe to work" |
| `WorkSetting` · `WORK_SETTINGS` · `DEFAULT_BY_INDUSTRY` · `workSettingFor` | `src/core/worksetting.ts` | **The** answer to where a company's crews work (outside / inside and outside / inside), defaulting from the industry; `workSettingFor(co, site)`: jobsite's own, else company's, else industry's. Stored as `jobsites.work_setting` / `companies.work_setting` (null = fall through) |
| `weatherNote` · `WEATHER_NOTES_VERSION` · `HEAT_REF` | `src/content/weather-notes.ts` | **The** crew-note wording per work setting, each with its OSHA reference; `conditionNotes(c)` in core picks which notes apply |
| `sunTimes` · `skyPhase` | `src/core/sun.ts` | **The** sunrise/sunset calculation (NOAA equation, no lookup) and dawn/day/dusk/night phase for the sky |
| `heatIndexF` · `heatLevel` · `heatForDay` · `alertWorthy` · `HEAT_LABEL` | `src/core/heat.ts` | **The** heat judgment: NWS heat index formula and chart levels; hottest work hour from an NWS hourly forecast |
| `planImport` · `parseCsv` · `templateCsv` · `IMPORT_COLUMNS` | `src/core/importPeople.ts` | **The** people-import plan: header aliases (Role/Position/Title → Job title, Crew → Team), add/update/skip with reasons, new teams/job titles (imported titles sign only), matching by Employee ID |
| `certState` · `latestCerts` · `personTraining` · `trainingSummary` · `EXPIRING_DAYS` | `src/core/certs.ts` | **The** training-card status math: current / expiring / expired / missing against job-title requirements |
| `presentersFrom` · `titleOf` · `NO_TITLE` | `src/core/presenters.ts` | **The** rule for who can give a talk: a job title marked "Gives talks" or a team's lead. "Team member" when no title |
| `planReminders` | `src/core/reminders.ts` | Which phone reminders should be scheduled now (Monday talk, Thursday nudge, makeups running out) |
| `THEME_ROLES` · `DEFAULT_THEME` · `THEME_PRESETS` · `normalizeTheme` · `themeChanges` · `themeVars` · `isDark` · `darkVersion` · `printBrand` · `themeWarnings` · `contrast` · `colorDifference` · `inkOn` | `src/core/theme.ts` | **The** company colors: the eight settable colors, the Paper default (light tan by day, Momentum at night via `darkVersion`; Momentum, Clarity, Field, Ledger, Signal, Harbor, Graphite are presets), readable text on each color, the phone-dark-mode versions of a light theme (`--t-dark-*`, `--t-scheme`), the print-safe brand color for PDFs (`printBrand`), and plain-language readability/confusion warnings. Any new color decision goes here, not in a screen |
| `toUpload` · `talkFolder` · `TALK_FILES_BUCKET` | `src/core/record.ts` | **The** split of a saved talk into private files (signatures, crew photo, paper sheet photo) and the record that points at them; fixed paths so retries never duplicate |
| `jobsiteLink` · `siteFromSearch` · `resolveScannedSite` | `src/core/sitelink.ts` | Jobsite QR stickers: the link a sticker carries (`?site=<id>`) and the company-scoped lookup when it's scanned |
| `jobsiteSticker` | `src/lib/sticker.ts` | The printable QR sticker PDF (vector QR via `qrcode`, jsPDF) |
| `appWebAddress` | `src/lib/webAddress.ts` | **The** app's web address (`NEXT_PUBLIC_APP_URL`, else the website's own) for any link that leaves the app: stickers, share links. Re-exported from `sticker.ts` |
| `holdScan` · `takeScan` | `src/lib/scan.ts` | Keeps a scanned jobsite through sign-in (session storage) and hands it to `JobsitePicker` once |
| `AttendanceStatus` · `countStatuses` · `resolveStatus` · `signedSummary` | `src/core/attendance.ts:4` · `:16` · `:29` · `:39` | **The** attendance model: `signed` · `not_signed` · `absent`. Every report counts with this. `signedSummary` is **the** signed-count line every screen shows ("2 of 3 here signed · 1 absent"; presenter stated separately) |
| `enoughInk` · `MIN_INK_PX` | `src/core/record.ts` | A signature needs real ink (stroke length); a tap or dot isn't taken as signing. Used by `SignaturePad` |
| `buildProfile` · `profileRange` · `PROGRAM_ELEMENTS` · `DOCUMENT_KINDS` | `src/core/profile.ts` | **The** company safety profile: counts and rates from the company's own records over a range (talk periods held/missed from `buildCompliance`, sign-in and on-time rates, month rows, daily-plan days, safety-log counts, issue fix times), program elements with honest status (shown by records / partly / outside the app), self-reported EMR (latest per year). No names, no compliance wording |
| `shareSnapshot` · `shareStatus` · `shareLink` · `secretFromHash` · `shareKind` · `SHARE_DAYS` | `src/core/share.ts` | **The** shared profile copy: copies every profile field by name (no document paths, ids or stray fields), the company header fields only; live/expired/switched-off status; the link with its secret after `#`. Reuse it for the insurance partner portal |
| `groupRoster` · `sortSubmissions` · `SUBMISSION_LABEL` | `src/core/trainers.ts` | Trainer portal: a trainer's roster grouped by company (a company with no one given still shows), waiting cards first (oldest first) then reviewed |
| `isOwnTalk` · `newTalkKey` · `latestOwnTalks` · `ownTalkToTalk` · `ownTalkProblem` · `tidyTalkText` · `copyFromLibrary` | `src/core/ownTalks.ts` | **The** company-written talk rules: ids start `own-`; the latest version counts (retired drop out, kept for lookups); becomes a normal `Talk` with `industries: []` so it never joins the rotation by itself; plain-words "what's missing" check (Spanish must be whole) |
| `cleanCode` · `formatCode` · `verifyLink` · `verifySummary` · `VerifiedRecord` | `src/core/verify.ts` | **The** record check code: 16 characters with no look-alikes, printed in fours, linked after `#` so it never reaches a server log; the plain counts line |
| `OUTCOMES` · `KINDS` · `PRIVACY_REASONS` · `latestCases` · `latestSummary` · `caseProblem` · `logTotals` · `logRates` · `caseLabel` · `nameOnLog` · `postingWindow` · `countDays` | `src/core/oshaLog.ts` | **The** OSHA 300/300A rules (columns A–M checked against 29 CFR 1904.29/1904.32 and 1904.7): one box per case with matching days, 180-day cap, privacy cases print "Privacy case", totals (zeros with no cases), rates per 200,000 hours, posting Feb 1–Apr 30 |
| `PARTNER_KINDS` · `partnerKindName` · `inboxByCompany` | `src/core/partners.ts` | Insurance partner portal (pilot): partner kinds, the company-side and partner-side shapes, a partner's inbox grouped by company, latest first |

## Content

| Component | File | Role |
|---|---|---|
| `TALKS` | `src/content/talks.ts` | The talk library, English + Spanish (draft). See the TALKS row under Content for counts |
| `CERT_TYPES` · `certTypeName` | `src/content/certTypes.ts` | Training card types; rule notes only where checked (reuses `REPEAT_NOTES`) |
| `BRAND` | `src/content/brand.ts` | **The** product name and tagline (placeholder "Tuvant"); logos in `src/content/logo.ts`. Rename here only |
| `STARTER_TITLES` · `missingStarterTitles` | `src/content/jobTitles.ts` | Starter job titles per industry (which give talks); added when a company is created and offered again in Admin → Job titles |

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
| `private.is_member` · `private.is_admin` | same file `:32` · `:37` | The access checks every RLS policy uses. Reuse them for every new company table. Since 0022 `is_member` means staff (any member except an employee account) |
| `private.can_present` · `private.is_owner` · `private.is_employee` · `public.accept_invites` · `company_invites` · `private.keep_an_owner` | `supabase/migrations/20261009000022_app_roles.sql` | App roles: who records talks (owner/admin/presenter), owner-only changes to owners and admins, employees' own-history policies, invites claimed on sign-in, a company never loses its last owner |
| person_certs · title_cert_requirements · person-certs bucket · `private.can_report` | `supabase/migrations/20261009000023_training_certs.sql` | Training cards (withdraw-only trigger), title requirements, card photos; owner/admin/office read, own cards for linked people |
| `roles.presents` | `supabase/migrations/20261009000021_job_titles.sql` | Job titles: whether a title gives talks |
| talk-files bucket · `private.file_company` · `private.check_talk_file` · path columns | `supabase/migrations/20261005000009_private_talk_files.sql` | Private storage for signatures and crew photos (company folder, add/read only, no replace/delete); `save_talk_record` accepts files by path and checks each is in this talk's folder and uploaded; `talk_attendees.company_name` for walk-ins |
| `companies.theme` · `private.valid_theme` | `supabase/migrations/20261005000008_company_theme.sql` | A company's changed colors (only known parts, only `#RRGGBB`); admins update their own company under the existing policy |
| `public.create_company` | `supabase/migrations/20261004000002_default_roles.sql` | The only way to create a company; makes the caller its owner and adds the default presenting roles |
| `supabase()` | `src/lib/supabase.ts:7` | The one browser Supabase client. Public URL + anon key only |
| company_emr · company_documents · company-docs bucket | `supabase/migrations/20261009000020_company_profile.sql` | Self-reported EMR and program documents: admins of the company read/insert only; no update or delete (a correction is a new row); path must sit in the company's folder |
| security hardening · `private.pin_membership` · `private.stamp_actor` · talk_issue_events · `private.log_issue_status` | `supabase/migrations/20261010000024_security_hardening.sql` | Records and attendance only through `save_talk_record` (checks presenter access itself); invites only for email-code accounts; memberships made only by `create_company`/`accept_invites`, never rewritten; no deleting people; who-did-it columns stamped from the signed-in user; every issue open/fixed change kept. Use `stamp_actor` on any new who-did-it column |
| profile_shares · profile_share_views · `create_profile_share` · `revoke_profile_share` · `shared_profile` | `supabase/migrations/20261010000025_profile_shares.sql` | Share links: the database makes the secret and stores only its sha256; admins read the list (no fingerprint or copy columns), make and switch off through functions; anyone with a live link opens it (wrong, expired and switched off all answer null); opens logged, except the company's own admins |
| company_trainers · company_trainer_people · cert_submissions · `invite_trainer` · `remove_trainer` · `trainer_roster` · `submit_cert` · `decide_cert_submission` · `private.my_trainer_id` · `private.trainer_sees` | `supabase/migrations/20261010000026_trainer_portal.sql` | Trainer portal: trainers aren't members; invites claimed in `accept_invites` (email-code only); a trainer reads names/titles of the people given only; cards wait as submissions until an admin approves (which adds the `person_certs` row) or declines with a reason; removal ends access, submissions stay |
| company_partners · partner_reports · partner_report_views · `invite_partner` · `remove_partner` · `send_partner_report` · `withdraw_partner_report` · `partner_inbox` · `partner_report` · `private.my_partner_id` | `supabase/migrations/20261010000027_partner_portal.sql` | Insurance partner portal (pilot): partners aren't members; invites claimed in `accept_invites`; companies send frozen counts-only summaries (append-only, withdrawable); partners read only through `partner_report`, which logs each open; removal ends access |
| `private.valid_profile_copy` · `private.partner_pilot` · `private.partner_pilot_on` · `private.trainer_uploads_today` · `person_certs.submission_id` · `private.guard_cert_submission` | `supabase/migrations/20261010000028_partner_review_fixes.sql` | Review fixes: every shared copy (share link, partner summary) checked for known keys only, no document titles or EMR notes, dates matching; partner invites/sends only for companies switched on in `private.partner_pilot` (database owner only); at most 200 waiting cards per trainer and 100 photo uploads a day; an approved card links to its submission, settable only by the approval |
| company_talks · `private.next_talk_version` | `supabase/migrations/20261010000029_company_talks.sql` | Your own talks: versions only (next version, never edited or deleted, retired stays retired), staff read, owners/admins write, `created_by` stamped; reviewed Spanish needs a named reviewer |
| talk_records.verify_code · `private.new_verify_code` · `verify_record` | `supabase/migrations/20261010000030_record_verification.sql` | Check a record from its PDF: a code on every record (existing ones filled); `verify_record` is open to anyone with a code and returns company, talk, dates and counts only, never names, signatures, places or ids |
| injury_cases · injury_summaries · `private.next_injury_version` · `private.next_summary_version` | `supabase/migrations/20261010000031_injury_log.sql` | OSHA log: owners/admins only, versions only (removed = struck through with a reason), case numbers per company and year set by the database, the box checked must match the days, database clock for times |
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
| `companyHeader` · `HeaderCompany` · `buildProfilePdf` · `profilePdfFileName` | `src/lib/pdf.ts` | `companyHeader` (takes just the header fields, `HeaderCompany`, so a shared copy prints the same) is **the** company block at the top of every PDF (record and summary). `buildOsha300Pdf` · `buildOsha300APdf` · `buildPrivacyListPdf` · `oshaFileName` are **the** OSHA log (landscape, page totals), summary (totals, establishment, certification lines, access and falsifying statements) and confidential privacy list; `companyHeader` takes a page width for landscape. The record PDF ends with a "check this record" box (QR + code, `drawQr`) and prints the code in every footer. `buildProfilePdf` is **the** renewal packet / monthly summary PDF from a `SafetyProfile`: key figures, weeks with no talk recorded (red), month table, safety log, self-reported EMR and document titles, program elements (Florida s. 440.1025 label when the company ZIP is in FL), footer |
| `listEmr` · `addEmr` · `listDocuments` · `uploadDocument` · `documentUrl` | `src/lib/data/profile.ts` (twin `preview/demo/profile.ts`) | Self-reported profile pieces: EMR per rating year and program documents in the private `company-docs` bucket; admins only, append-only, one-minute signed links |
| Safety profile screen | `src/app/profile/page.tsx` | Reports → Safety profile & renewal packet: range picker, figures, missed weeks, months, program elements, EMR entry, document upload, PDF downloads |
| `ProfileSummary` | `src/components/ProfileSummary.tsx` | **The** profile body (figures, missed weeks, months, languages, program elements; with `shared`, EMR and document titles). Used by the company's screen and the shared page, so both show the same |
| `ShareSection` | `src/components/ShareSection.tsx` | "Share with your agent" on the profile screen: who it's for, 7/30/90 days, make link (shown once), copy/send, see what they'll see, list with opens, switch off |
| `Steps` | `src/components/Steps.tsx` | **The** named three-step header for giving a talk (Read / Who's here / Sign) and the daily plan (Plan / Who's here / Sign) |
| `Avatar` | `src/components/ui.tsx` | Initials badge for a person: roster, signing, record sign-in sheet, People and Training lists |
| `CardForm` | `src/components/CardForm.tsx` | **The** "add a training card" form (type or typed name, issued/expiry from the card, rule note, crane suggestion, note, photo). Admin → Training adds; the trainer portal sends for approval |
| `TrainersSection` | `src/components/Trainers.tsx` | Admin → Training → Trainers: cards waiting for approval (approve / decline with reason), invite a trainer, tick the people each may see, remove, recently reviewed |
| `OutsideInvite` | `src/components/OutsideInvite.tsx` | **The** invite-by-email form for people outside the company (trainers, insurance partners), with a slot for extra fields |
| `PartnersSection` | `src/components/PartnersSection.tsx` | Safety profile → Insurance partners (pilot, `partnerPortalPilot()`): invite, send this summary (`shareSnapshot`), opens per summary, withdraw, remove |
| `useTalks` · `useTalkLookup` · `loadOwnTalks` · `refreshOwnTalks` · `useOwnTalkRows` | `src/lib/library.ts` | **The** talk list every screen and the plan use (built-in `TALKS` + the company's own talks, cached on the phone for no signal). `useTalkLookup` also finds retired company talks for weeks planned before retiring. Never import `TALKS` into a screen for lookups |
| `listOwnTalks` · `saveOwnTalk` · `retireOwnTalk` | `src/lib/data/ownTalks.ts` (twin `preview/demo/ownTalks.ts`) | Company talk data: every save and retire is a new version row |
| `verifyRecord` | `src/lib/data/verify.ts` (twin `preview/demo/verify.ts`) | Look up a check code (works signed out) |
| `listInjuryCases` · `saveInjuryCase` · `removeInjuryCase` · `listInjurySummaries` · `saveInjurySummary` | `src/lib/data/injuries.ts` (twin `preview/demo/injuries.ts`) | OSHA log data, only the fields a person fills in |
| `InjuryLog` | `src/components/InjuryLog.tsx` | Admin → Injury log: year, totals and rates, cases (update = new version, not recordable = off the log with a reason), add-a-case sheet in the form's own column letters, 300A details, the three PDFs |
| `drawQr` | `src/lib/qr.ts` | **The** QR code drawn into a PDF as vector squares. Jobsite sticker and the record PDF's "check this record" box |
| Check a record page | `src/app/verify/page.tsx` | `/verify/#CODE` from the PDF's QR, or type the code: what was saved (counts, no names), a mistyped code finds nothing |
| `OwnTalks` | `src/components/OwnTalks.tsx` | Admin → Talks → Your own talks: list (give it now / edit / retire), write a talk or start from a library talk, optional Spanish with English shown as the thing to translate, checked-by name; any wording change sets Spanish back to draft |
| `listPartners` · `invitePartner` · `removePartner` · `sendPartnerReport` · `listSentReports` · `withdrawPartnerReport` · `amPartner` · `partnerInbox` · `openPartnerReport` | `src/lib/data/partners.ts` (twin `preview/demo/partners.ts`) | Partner portal data, company side and partner side |
| Partner portal page | `src/app/partner/page.tsx` | What a partner sees: companies that sent summaries, open one (`ProfileSummary shared` + `buildProfilePdf`). A non-member partner lands here |
| `partnerPortalPilot` | `src/lib/features.ts` | Built-but-held-back switches. Partner portal hidden unless `NEXT_PUBLIC_PARTNER_PORTAL=pilot` (preview: on) |
| `listTrainers` · `inviteTrainer` · `removeTrainer` · `setTrainerPerson` · `listSubmissions` · `decideSubmission` · `amTrainer` · `myTrainerRoster` · `mySubmissions` · `submitCert` | `src/lib/data/trainers.ts` (twin `preview/demo/trainers.ts`) | Trainer portal data, company side and trainer side; photos to `<company>/trainer/<trainer>/` in person-certs; `submitCert` is retry-safe by client id |
| `saveCard` · `flushCards` · `waitingCards` · `discardCard` | `src/lib/cardOutbox.ts` | Offline-first sending for trainers, like the talk outbox: saved on the phone first with one client id (a retry never sends twice), photos shrunk, PDFs up to 3 MB, per account on a shared phone |
| Trainer portal page | `src/app/trainer/page.tsx` | What a trainer sees: companies that invited them, the people given (name, title), send a card (`CardForm`), cards sent with status and decline reasons. A non-member trainer lands here (`RequireCompany` sends them) |
| `createShare` · `listShares` · `revokeShare` · `openShare` | `src/lib/data/shares.ts` (twin `preview/demo/shares.ts`) | Share links through the database functions; list joins open counts |
| Shared summary page | `src/app/share/page.tsx` | What a link opens, no account: company header, prepared for, period, copy date and expiry, PDF from `buildProfilePdf`, `ProfileSummary shared` |
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
| `startOfflineApp` · `scripts/build-sw.mjs` → `out/sw.js` | `src/lib/offlineApp.ts` · `scripts/build-sw.mjs` | **The** offline copy of the app's own files for the website/installed web app (pages network-first, build files cache-first, other sites never cached). Off in the store apps, `npm run dev` and the preview. Data saving offline is still the outbox below |
| web app manifest · icons | `src/app/manifest.ts` · `scripts/make-icons.ts` (`npm run icons`) → `public/icons/`, `public/brand/` | Install from the browser; icons and logo SVG files drawn from `src/content/logo.ts`, the same drawing as `Mark`. Name and colors come from `BRAND` and `DEFAULT_THEME` |
| `logo` · `BRAND_COLORS` · `markSvgInner` · `productSvg` · `companySvg` · `Wordmark` · `SignatureRule` | `src/content/logo.ts` (+ `logo.json` outlines) · `src/components/Logo.tsx` | **The** logos (placeholder name Tuvant): product wordmark D, company wordmark B, the t app mark, and the brand's fixed colors. Used by `Mark`, the side menu, sign-in and the icon script. `SignatureRule` = the bar-and-dot under `Title` |
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
| `Button` · `inputClass` · `segmentedClass` · `segmentClass` · `Notice` · `Title` · `GroupHeading` | `src/components/ui.tsx` | **The** visual primitives (pill buttons, segmented control, notices, titles). New screens use these, not their own styles |
| `RequireCompany` · `NotConfigured` | `src/components/Guard.tsx` | Gate for every signed-in screen: loading, not configured, signed out → sign-in, no company → setup, and `need` = admin / present / report / staff by app role |
| `canAdmin` · `canPresent` · `canReport` · `isStaff` · `Access` | `src/lib/data/types.ts` | **The** app-role checks the screens use (the database enforces the same rules) |
| `listMembers` · `setMemberAccess` · `removeMember` · `listInvites` · `inviteMember` · `cancelInvite` · `acceptInvites` · `myTalks` | `src/lib/data/members.ts` (twin `preview/demo/members.ts`) | App access and invites; `acceptInvites` runs on every sign-in (session.tsx); `myTalks` is an employee's own history |
| `listCerts` · `addCert` · `withdrawCert` · `cardUrl` · `listRequirements` · `setRequirement` | `src/lib/data/certs.ts` (twin `preview/demo/certs.ts`) | Training cards and title requirements; append-only, photos in the private person-certs bucket |
| `Training` · `CERT_CHIP` · `TrainingAlert` | `src/components/Training.tsx` · `src/components/TrainingAlert.tsx` | Admin → Training (people, sheet per person, what each title needs) and the Home alert |
| `AppAccess` · `APP_ROLES` | `src/components/AppAccess.tsx` | Admin → App access: members, app roles, invites |
| `EmployeeHome` | `src/components/EmployeeHome.tsx` | Home for an employee account: their own talk history |
| Job titles tab (`RolesTab`) | `src/app/admin/page.tsx` | Admin → Job titles: Gives talks switch, starter titles for the industry, add/remove |
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
| UI kit (`Button`, `ConfirmButton`, `Field`, `Shell`, `Notice`, `Sheet`, `Loading`, …) | `src/components/ui.tsx` | Shared, phone-first pieces on the theme tokens (`globals.css`; `bg-brand`, `bg-action`, `bg-ok-bg`, `bg-caution-bg`, `bg-warn`…). `Button` variants primary (action color) · soft (brand tint) · ghost · danger; sizes sm · md · lg (the one big action on a screen, Archivo). `Mark` = app mark (t over the rule on deep forest, `src/content/logo.ts`), fixed brand colors. `Shell` = header (mark + company name) + offline/upload pill + bottom tab bar on phones/tablets, side menu (`SideNav`) at 1024px+, both from one tab list (`useTabs`) (`tabs={false}` for focused flows; `wide` for screens that use a computer's full width, like Reports). `Sheet` = slide-up edit panel. `Loading` = skeleton rows. `ConfirmButton` = two-tap destructive action (prefer an Undo toast where the action can be reversed). `Notice tone="caution"` = warnings people must not miss (draft translation, data not loaded). `ErrorNotice` = plain-words error + Try again + details. `FileButton` = styled file picker. `Shell lockHeader` = no way out through the header while crew sign. Disabled buttons render as a dashed outline with readable text |
| `toast` · `Toaster` · `buzz` | `src/components/toast.tsx` | **The** feedback message (optionally with Undo), shown under the header and cleared on navigation; `buzz` = short vibration where supported |
| `useHomeStatus` · `MomentumHero` · `WeekStatusCard` · `GettingStarted` | `src/components/HomeCards.tsx` | Home's hero (ring of this period's sign-ins + talk streak with dots), the by-team card (+ who owes a makeup) and the new-company checklist. Built on the report query layer + `buildCompliance` + `talkStreak` |
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
