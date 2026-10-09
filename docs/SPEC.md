# Toolbox Talks — product spec

The decisions made while building the prototype (`prototype/index.html`). The prototype is the reference behavior;
this file is the why. Update both when a decision changes.

## The job
Crews are supposed to get a weekly safety talk and sign in. Today that's a printed sheet on a clipboard, a talk nobody
wants to read, and a stack of paper nobody can find when OSHA or the insurer asks. This app makes the talk quick to
give, easy for any crew to understand, and leaves a signed record the owner can pull up in seconds.

The value customers pay for is the **signed, searchable record**. The talk content is a commodity that gets them to
"complete on day one".

## Platforms
- **Website, iPhone app and Android app from one codebase.** The web app is built as a static site and wrapped with
  Capacitor for the two app stores. Built and tested together from the start.
- **Installable from the browser** ("Add to Home Screen") before the store apps exist.
- **Works without signal.** Talks, audio and signatures save on the phone and upload when the connection returns.
- **Phones first.** Big tap targets, readable outdoors, works one-handed on a tailgate.
- **Everything runs locally for free while we build.** Local Supabase on a Mac; no Supabase or Vercel account until
  launch. Note for launch: Vercel's free plan is for non-commercial use; since the app is a static site, any static
  host works.
- **Store accounts when publishing:** Apple developer account ($99/year), Google Play developer account (one-time fee).

## Who uses it
- **Company admin** (owner, safety manager): sets up the company, people and teams, reads reports, pulls records.
- **Presenter** (superintendent, supervisor, foreman, team lead): picks the talk, reads or plays it, collects signatures.
- **Crew member**: listens and signs on the presenter's phone. No account, no app install.

## Company-neutral, multi-company
Any company in any of the supported industries can sign up. Each company's data is fully separate. Roman Roofing is
customer #1, not a special case.

## Talk library
- Rewritten from free federal OSHA material: shorter, plainer, less dry. Each talk is a hook, two or three short
  sections, and one question to ask the crew. About 4–6 minutes read aloud.
- **Check licensing on every source.** Federal OSHA material is generally public domain. Many "free" talk libraries
  online are copyrighted and can't be repackaged.
- **Industries (18):** Construction, plus the trades that also get every construction talk (Roofing, Electrical,
  Plumbing & HVAC, Solar, Demolition & site work) · Manufacturing · Warehouse · Trucking · Agriculture · Landscaping &
  tree care · Oil & gas · Utilities & telecom · Healthcare · Retail · Restaurants & food service · Hotels, janitorial &
  facilities · Auto repair & fleet. Each industry has its own talks, shares the talks that fit it (a talk lists every
  industry it serves), and gets the **"Every job"** set shown to everyone (heat, cold, fatigue and sleep,
  slips/trips/falls, PPE, emergencies, storm prep, and the rest).
- **Where a topic has no OSHA rule** (vehicle lifts, patient handling, late-night retail, crowds), the talk says so and
  rests on OSHA or NIOSH guidance. Other agencies' rules are named plainly (EPA pesticides and refrigerants, DOT cargo
  securement).
- **Target size:** 25–30 talks per industry so a topic comes up once or twice a year, not every few months. Use the
  Roman Roofing 52-week calendar as a topic checklist for construction (topics only; nothing Roman-specific ships).
- Talks are versioned content. A record stores the exact version that was read.

## The 52-week plan
- One talk per week (or per 2- or 4-week talk period, see Scheduling below), per company, with a **Week 1 start
  date** set in Admin. Weeks start Monday.
- **Timed to local weather by ZIP code.** Long heat season in hot states, no cold-weather talks in South/Southwest
  Florida, Hawaii or Puerto Rico, hurricane prep before and during storm season only in hurricane states.
- **Each week's talk is locked.** Every crew gives the same talk that week, as many times a day or week as needed
  (several crews, several shifts). There is no "give a different talk" button.
- Admin → **Talks** picks which talks the plan draws from: the industry's talks and the Every-job set by default;
  an admin can drop talks or add ones from other industries. A new pick list starts next Monday, so weeks already
  planned keep their talks (the database refuses to change a list that has started).
- Admin → **Plan** can swap a week's talk **until someone gives it** or the week is over; after that the week is
  locked. The database enforces the lock (`plan_overrides` trigger), not just the app.
- **Makeups.** Someone who missed a week (off, sick, new hire, no work) gets that week's talk later through
  **Home → Make up a missed week**. The admin sets how far back (Company → "Missed talks can be made up for", default
  4 weeks).
  - A makeup is **never back-dated**: it keeps its real date, time, week and GPS.
  - It also stores **which week it makes up** and a **required reason** (quick pick + note; "Other" needs a note).
  - It counts toward the week it makes up, and is always shown as a makeup, so reports can grade on-time vs. late.
  - A makeup doesn't lock the week it was held in.
- **Who still needs it.** On the roster step, "Everyone who hasn't had this week's talk" (or "…still needs Week N" for
  a makeup) lists active people with no signature for that week, on time or by makeup. Absent and not-signed people
  still need it.


## Safety log and "Since last talk" (2026-10-08)
- Admin → **Safety log** records inspections, walk-arounds, citations, incidents and near misses: date, jobsite (or
  company-wide), a title, kind-specific fields, admin-only details, and a PDF or photos (private, admins only).
- Each has a short **crew summary**. It's a draft until an admin approves it, and once approved it never changes
  (a new wording is a new entry). The app blocks approving a summary that names someone on the roster or says
  "compliant" / "passed". Citations are read as *alleged* with their case status until final.
- Findings go on the crew **issues** list, linked to their event. Nothing is deleted; an entry can be withdrawn from
  future talks with a reason.
- When a company turns it on, each talk (not makeups) gets a **"Since last talk"** section: the approved summaries
  for that jobsite (plus company-wide ones) since its last talk, or the last 30/60/90 days. The presenter reads each
  and checks "Reviewed with the crew"; reading can't finish until all are checked. With nothing logged it says so.
  Offline, it says the log couldn't be loaded. The record and PDF keep exactly what was read and when each was
  checked. Washington's construction meeting rule asks for this review (WAC 296-155-110).
- **Not built (waiting on Joe):** AI-drafted summaries. The table already has `summary_source` ('typed' / 'ai'); an
  AI draft would still need the same approval.

## Scheduling and cadence (decided with Joe, 2026-10-07)
- **Talk picks:** built (Admin → Talks, above).
- **Cadence:** built for the whole company (Admin → Plan → How often): every week (default), every 2 weeks, or every
  4 weeks ("monthly": 13 talks a year, never more than a month apart). Each entry in the plan is then a talk period
  keyed by its first Monday; makeups, reports, Home and the database lock all work per period. A change starts when
  the current period ends and is kept once it starts, so past periods never re-shape. The app warns when a cadence is
  less often than a checked state rule (Washington construction weekly, California construction every 10 working
  days, Oregon construction monthly). **Override per crew or jobsite: not built yet** (needs a plan per crew).
- **Daily tailgate talks:** separate records that count on their own; the weekly (or slower) talk stays the main
  record and its grading doesn't change. Not built yet.
- **Who changes the plan:** office admins only. Crew leads give the talk that's scheduled.
- **Required repeats:** talks a company must repeat (for example yearly) come back on schedule. Not built yet.
## Languages and read-aloud
- Language toggle on every talk. English and Spanish first; Portuguese, Haitian Creole, Vietnamese and Chinese next.
- **Read-aloud** so the presenter doesn't need to speak the crew's language. Each line highlights as it's read.
- Translations ship as `draft` until a native speaker who knows jobsite safety marks them `reviewed`.

## Voice
- **Plan:** pre-generate one audio file per talk per language and store it. The app plays the file; nothing is
  generated on the phone. A one-time cost per talk version, not per play.
- **Engines, free for now:** Kokoro for English and Spanish (Apache 2.0; compare its 3 Spanish voices against Piper's
  Mexican Spanish before choosing). Piper for Vietnamese, and as backup for Portuguese and Chinese (Kokoro also has
  Brazilian Portuguese and Mandarin). **No free voice exists for Haitian Creole**: paid service or human recording.
- Upgrade the main English and Spanish voices to a paid service (e.g. ElevenLabs) once there's revenue. Only the audio
  files change, not the app.
- The phone's built-in voice stays as the offline fallback.
- **Every voice is license-checked first.** See `docs/voice-licenses.md`.

## Company admin
- **Company info:** name, license numbers (one per line), address, phone, email/website, Week 1 date.
  All of it prints on every PDF.
- **Roles that can present:** Owner, Safety Manager, Superintendent, Supervisor, Foreman, Team Lead, editable.
  "Crew member" is fixed and signs only.
- **Teams:** name + team lead.
- **People:** name, role, team. Later: employee ID, phone, preferred language.
- **Excel / CSV import for people:**
  - Downloadable template: Name, Role, Team, Employee ID, Phone, Preferred language.
  - Preview before saving that flags problems (missing name, duplicate, unknown team or role).
  - Unknown teams/roles created after the admin confirms.
  - Employee ID matches existing people, so re-uploading updates instead of duplicating.
  - Accepts `.xlsx` and `.csv`.

## Look and company colors (built)
- **Default look, "Signal":** the safety colors on signs and tags (ANSI Z535 in the US, ISO 3864 worldwide), so it
  reads as safety in any trade. Safety blue for the brand (header, week card, links, selected tab), safety orange for
  main buttons, green only for done/signed, yellow only for caution (open makeups, heat), red only for missed/not
  signed. Schibsted Grotesk (bundled, works offline), sentence case, soft rounded cards and buttons.
- **Admin → Brand:** an admin can change any of the eight colors (brand, buttons, done, caution, missed, background,
  cards, text) with a color picker or an exact hex code, or start from a preset (Signal, Harbor, Cobalt, Graphite).
  The whole app changes live while trying colors; nothing is saved until "Save colors"; leaving the tab puts the
  saved colors back. "Back to default" returns to Signal.
- **Checks, not blocks:** plain-language warnings when a choice makes text hard to read (WCAG contrast) or makes
  two meanings look alike (done vs missed, buttons vs missed). They warn; the admin can still save.
- Saved per company (`companies.theme`, only the changed colors), seen by everyone in that company, remembered on
  the phone so the app opens in the right colors offline. The PDF header band uses the brand color; the PDF's
  status colors and content don't change with it.
- Dark mode keeps the company's colors and uses its own background, cards and text.

## Jobsites and the office
- Talks can happen on a jobsite **or at the office or shop**. Each place is marked Jobsite or Office or shop. Where a
  talk happened is recorded, never flagged: no place is "wrong".
- Admin → **Jobsites**: name, kind, address, and a GPS point captured by tapping **Use my location** while standing on site
  (or **Pin to my location** later). Jobsites are deactivated, never deleted, so past records keep them.
- Home → **Jobsite**: pick from the list, or **Find nearest** uses GPS to pick the closest jobsite. Within about
  400 m (1,300 ft) it selects it; farther away it names the closest and how far, and asks instead of assuming.
- Sites without a GPS point are never guessed at.
- Later: turn a typed address into a map point automatically (needs a geocoding service; not chosen yet), and log
  the presenter's GPS on each saved talk as extra proof of where it happened.

## App frame (built)
- **Bottom tab bar:** Home · Talk · Records, plus Reports · Admin for owners and admins. Hidden while giving a talk.
- **Header pill** when offline or when talks are waiting to upload.
- **Home** shows this week by crew ("Crew A ✓ 4/4 · Crew B 3/5"), how many person-weeks need a makeup, and for a new
  company a getting-started checklist (people → crews → place → first talk).
- **Feedback:** a short message after every change, with **Undo** for removing a person or place; skeleton
  placeholders while loading; a small vibration on signing where the phone supports it.
- **Admin → People:** search, grouped by crew, tap a person to edit in a slide-up panel. Admin sections are wrapping
  chips so none run off the screen.
- **Records** grouped by week, with a crew filter and "only flagged".
- **Reading:** play and "Done reading" stay pinned at the bottom; A− / A+ text size, remembered on the phone.

## Jobsite tools (built)
- **Spreadsheet import (Admin → People → Import):** .xlsx or .csv; headers matched loosely (Name / Full name,
  Role / Position, Team / Crew, Employee ID / Emp ID, Phone, Language). A preview shows add / update / skip per row
  with reasons; new crews and roles are listed and created on import. Re-importing updates people matched by
  Employee ID (or by name when there's no ID) and brings back removed people. Template download included.
- **Today's site notes:** optional line or two on the Read screen, read to the crew (and read aloud), saved on the
  record and the PDF.
- **Heat:** today's forecast for the chosen jobsite (GPS point) or the phone's location, from the National Weather
  Service hourly forecast (free, no key, US only). Heat index by the NWS formula; levels per the NWS chart. From 91°F
  ("extreme caution") Home shows a warning and every talk that day gets a short heat reminder added (not the heat
  talk itself). The record stores the max heat index, level, whether the reminder was read, and the exact reminder
  text; the PDF prints it. Checked once per site per few hours and kept on the phone for the day.
- **Live jobsite weather (Home):** heat index, rain chance, wind and thunderstorms for the rest of the work day
  (tomorrow's after 7 PM), plus the National Weather Service's active alerts for that spot (warnings first, red).
  Refreshes every 15 minutes while the app is open, when it comes back on screen and when signal returns, with a
  manual refresh; shows the last check and its time when offline. Plain notes for the crew, worded for where the
  crew works (Admin → Company → "Where the crew works"; until picked, the industry decides: Construction = inside and
  outside, Agriculture = outside, Warehouse and Manufacturing = inside). Companies with crews in both set it per
  jobsite (Admin → Jobsites); a jobsite left unset follows the company. Every note says only what OSHA material says
  and links its source under it: thunder from the OSHA/NOAA lightning fact sheet (go indoors, enclosed building or
  hard-topped vehicle, wait 30 minutes after the last thunder); high wind from 1926.451(f)(12) and 1926.1417(a);
  windy from 1926.250(a)(1) or 1910.176(b); rain from 1926.451(f)(8) and 1926.404(b)(1), or 1910.22(a)(2) and
  1910.178(n)(8) inside; the heat line links OSHA's heat page. Wording is content (src/content/weather-notes.ts,
  versioned). Same weather gives the same notes in every setting: only the wording changes, nothing is dropped.
  Information only: the app never says a site is safe or unsafe to work; the crew lead decides.
  Looks like a weather app: an animated sky matching the forecast and time of day (sun, drifting clouds, rain,
  lightning flashes, fog, stars), the temperature and the work day's high/low, then hour by hour (sky icon, temp,
  rain-chance bar, wind arrow and speed). All drawn in the app (no extra downloads); animation stops for people who
  turn on reduced motion. The sky is layered: soft shaded clouds that keep crossing (faster in wind), rain at two
  depths that leans with the wind, branching lightning that lights the sky on an irregular rhythm, gust lines and
  blowing debris on windy days, heat shimmer on dangerous-heat days. The sky follows the jobsite's own sunrise and
  sunset (worked out on the phone, no lookup): a low orange sun and warm glow at dawn and dusk, stars and moon at night.
- **Day in one sentence:** under the sky, a plain-English line built from the hourly forecast, e.g. "Thunderstorms
  likely from 2 PM, clearing by 6 PM. Heat index up to 109° around 1 PM. Wind up to 25 mph around 2 PM." or "Dry
  through the work day." Times are the jobsite's local time.
- **Hour by hour (tap "Show hourly"; opens and closes like the radar, remembered on that phone):** sky icon, rain chance, a temperature curve with each hour's temperature, "feels" when the heat
  index runs 3°+ higher, a rain-chance bar and a wind arrow. Sunrise and sunset sit where they fall. Tap an hour for
  its details (feels like and heat level, humidity, rain chance, wind).
- **Full forecast (tap the sky or "Full forecast"):** a full-screen view with a taller sky, warnings with the weather
  service's own instructions, the day sentence, the hour strip, a larger radar, the work-day numbers, sunrise, sunset
  and daylight, and the crew notes. Back or Escape closes it.
- **Radar map (tap "Show radar"):** a street map centered on the jobsite with rain radar playing on top, pausing on
  the latest scan. Choose how far back: 1 hour (a frame every 5 minutes, the default), 3 hours (every 15) or 6 hours
  (every 30); each loop is 13 frames so a longer loop costs no more data, and the choice is remembered on the phone, pause and tap-a-time, zoom in and out, a
  light-to-heavy rain scale and the jobsite pin. Opens on a tap because it loads map pictures; once opened it stays
  open on that phone. Street map: OpenStreetMap (free with attribution, fine for testing; switch to a paid map
  provider before selling, one line in `src/lib/radar.ts`). Radar: NWS NEXRAD mosaic tiles from the Iowa
  Environmental Mesonet (named layers for the last 50 minutes, its 5-minute archive by UTC time for older scans). With no signal it says the map needs signal. Active warnings and watches are drawn on the
  map as their outlines from the weather service (red and pulsing for a warning that triggers the red border, amber
  dashed otherwise) and named in the legend; the radar button shows a "Warning area" chip when one is drawn. Frame
  labels show the scan's clock time when the radar source reports it, otherwise "N min earlier".
- **Attention border, only on unusual days:** red and gently pulsing for a weather service warning, high wind
  (35+ mph) or extreme heat danger (heat index 125°+); amber and steady for thunderstorms, windy (25+ mph) or heat
  danger (103°+). A pill in the sky says why (a warning shows in its own red banner instead). An ordinary hot or
  rainy day gets no border, so the border keeps meaning something.
- **Signing statement:** before the pad takes ink, each crew member taps "By signing, I confirm I attended this
  talk." (in the language read, with English under it). The record saves the exact statement and its version
  (talk_records.signing_statement) and each signer's tap time (talk_attendees.confirmed_at); the PDF prints the
  statement above the sign-in sheet and "statement tapped" under each signer's time. Unticking it clears that
  signature. This shows each person's intent to sign on the record itself (see docs/claims-and-evidence.md).
- **Crew-raised issues:** on the review screen before saving, the presenter logs what the crew raised. Each gets an
  owner (presenter by default) and a fix-by date (a week out). They upload with the talk (same offline outbox,
  one transaction). Records → Issues lists open (overdue first) and fixed; tap to reassign, change the date, or mark
  fixed with a note (Undo). What was raised never changes; nothing is deleted. Shown on the record, its PDF ("status
  when printed"), Home and Reports (raised, open/overdue, average days to fix).
- **Reminders (phone app only):** a per-phone switch on Home. The phone schedules its own notifications, no server:
  Monday 6:30 AM this week's talk; Thursday noon if this phone's usual crew hasn't had it; next morning when makeups
  run out within 7 days. Rescheduled every time Home opens. Texts/email would need a paid service: not built.

## Running a talk (built)
- **Home → Start this talk** opens this week's talk (locked for the week). **Make up a missed week** picks a past week
  inside the admin's limit and a reason, then runs that week's talk. The picker shows who still owes each week and
  pre-selects the week when only one is owed; the roster is set to those people. A talk in progress is saved on the phone after every tap; Home shows **Resume**.
- **Read:** language buttons (English, Spanish; others "soon"), **Read it out loud** with each line highlighted,
  a note when the translation isn't reviewed yet.
- **Who's here:** presenter (anyone with a role other than crew member), team (or all teams, or everyone who still
  needs this week's talk), where (jobsite or office), roster
  (team lead first, everyone checked; uncheck who's absent), walk-ins. A GPS point is taken quietly if allowed.
- **Sign, one person at a time:** presenter first, then each person here gets a full screen with their name and a
  big pad. **Next** (enabled once signed) goes to the next person who hasn't signed; **Isn't here** marks them
  absent (with Undo); **Skip** leaves them for later. A **review** screen lists everyone, tap anyone to sign; saving
  with anyone unsigned names them and flags them.
- **Remembered setup:** the last presenter, crew and place used on this phone are filled in for the next talk.
- **Saved:** goes into the phone's outbox first, then uploads. With no signal it says "saved on this phone" and
  uploads automatically when the phone is back online (Home and Records also have **Upload now**).
- **Records:** list (waiting + saved) with signed counts and flags; tap for the full record: details, sign-in
  sheet with signatures, presenter signature, and the talk text that was read. Records can't be edited.

## Running a talk (original plan)
1. **Pick the talk** (this week's scheduled one is on top).
2. **Read it** in the chosen language, or press play.
3. **Who's here:** choose the presenter (dropdown of everyone who can present), the team, and the jobsite. The team's
   roster loads, team lead first. Uncheck anyone who isn't there. Add walk-ins not on the roster.
4. **Sign:** presenter signs first, then each person present. If anyone hasn't signed, the app names them before
   saving; saving anyway flags them as **Not signed**.

Every roster person ends as **Signed**, **Not signed**, or **Absent**.

## The PDF record
- Company header: name, address, phone/email, license numbers.
- "Week N of 52 · week of <dates> · Scheduled talk", or for a makeup: "Makeup for the week of <dates> · <reason>" with
  the real date it was given.
- Date and time, where (jobsite or office), team, team lead, presented by (name and role), language, industry, GPS.
- Attendance summary with flagged count.
- The full talk content that was read.
- Sign-in sheet headed with week, talk, date and team: name and role, status, signature image, date and time signed.
  Flagged rows shaded.
- "Talk delivered by" block with the presenter's signature.
- Walk-ins show "Not on roster · <their company>" when the company was given.
- The crew photo, when one was taken, with the date and time it was taken.
- Footer on every page: record ID, page number, "Documents a safety meeting. Does not by itself certify OSHA
  compliance."
- File name: `Week 06 - Toolbox Talk - <talk> - <date>.pdf`.
- **Built:** Records → a record → **Download PDF** (share sheet on phones, download on computers). Every signature
  line, including the presenter's, carries the full date and time signed with the time zone. GPS at time of talk
  is listed when it was captured.
- The PDF is regenerated from the saved record each time, so it matches what was signed. Company header details come
  from the company's current info (not yet snapshotted per record).
- Later: save a copy to the company's account automatically so the presenter doesn't have to send it.

## Signatures, crew photo and walk-ins (built)
- **Signatures live in private storage, not in the record.** Each talk has its own folder
  (`<company>/<talk>/presenter.png`, `sig-N.png`, `photo.jpg`) in the private `talk-files` bucket. Only members of
  that company can add or read files there; nothing can be replaced or deleted. The record points at its files, and
  the database refuses a record that points outside its own folder or at a file that was never uploaded. Screens and
  the PDF read them through one-minute signed links. Records saved before this keep their inline signatures.
- **Offline still works:** signatures and the photo stay on the phone with the talk until there's signal; then the
  files upload first and the record second. Retrying is safe (fixed file names, one record per talk).
- **Crew photo (optional):** on the review screen, "Take a crew photo". Shrunk on the phone (longest side 1280 px,
  JPEG, hidden photo metadata dropped), with retake and remove. Shows on the record and the PDF with its time.
- **Paper sign-in sheet (optional, migration 0017):** on the review screen, "Add a photo of a paper sheet", for when
  the phone can't go around (dead battery, someone who won't sign on a phone). Kept larger (2000 px) so handwriting
  stays readable, saved as `sheet.jpg` in the talk's folder, shown on the record and the PDF. **It never changes a
  status:** anyone who didn't sign on the phone is still Not signed, and the record and PDF say so next to the photo.
- **Walk-ins:** name plus an optional company (a sub, a supplier). Companies used before are suggested. Shown on the
  roster, record and PDF. Walk-ins don't count toward the sign-in rate (they aren't on staff).
- **Late arrivals:** "+ Someone arrived late" on the review screen adds a walk-in and goes straight to their signing
  turn, without going back to Who's here.

## Jobsite QR stickers (built)
- **Admin → Jobsites → QR sticker** makes a one-page PDF to print and post at the site: a QR code, the jobsite name and
  address, and the company name. The code holds only a link: `<app web address>/?site=<jobsite id>`.
- **Scanning** it with the presenter's phone camera opens the app with that jobsite picked for today's talk. It's
  picked only if the jobsite belongs to the company the person is signed in to; otherwise the app says so. A scan
  made while signed out is held through sign-in (this browser tab only). Crews never scan or sign in.
- The app's web address comes from `NEXT_PUBLIC_APP_URL` (set once the website is live); the phone apps run from an
  app-only address a camera can't open, so stickers are made from the website. Opening the app itself from a scan
  (universal links) comes with the native apps.

## Admin reports (built)
**Home → Reports** (owners and admins).
- **Sign-in rate** (was "compliance score"): everyone on staff signs each week's talk. Score = people-weeks signed (on time or made up) ÷
  people-weeks expected, over weeks that are over. Shown next to it: the on-time rate, so makeups never hide lateness.
- **Every person, every week, ends in one state:**
  - **On time:** signed that week's talk.
  - **Made up:** signed later in a makeup. It **closes** the week (counts toward the score) and **stays marked**
    with the date given and the reason.
  - **Open:** not signed yet, still inside the makeup limit. Shows the make-up-by date.
  - **Missed:** past the makeup limit. Stays against the score for good.
  - **Due this week:** this week isn't over, so it's shown but not scored yet.
- Absent and not-signed both mean "hasn't had it". A presenter who signed as presenter has had it.
- **Who is expected:** people on staff that week, from when they were added to when they were deactivated
  (`people.deactivated_at`, stamped by the database). Deactivated people still count for the weeks they worked.
- Zero talks in a week means everyone on staff is open or missed, never "fine".
- Filters: 4 / 12 / 26 weeks / this plan year; all teams, one team, or no team (team as of today).
- **Needs a makeup:** one card per week that people still owe, soonest deadline first, with their names and days left,
  and **Give this makeup now**: it opens the makeup already pointed at that week and those people, so the presenter
  only picks a reason, reads, and collects signatures. The week drill-down has the same button.
- **Change:** last 4 finished weeks vs the 4 before, in points (fewer when the range is short).
- **Trend chart** (shown from the first finished week): compliance and on-time rate per finished week; the shaded gap between the lines is makeups.
  Hover, tap or arrow keys show both values for a week.
- **Needs a makeup:** everyone who still owes a past week, soonest deadline first, with days left (7 or fewer
  highlighted).
- **By team grid:** team × week squares with each score, shaded 95%+ / 80–94% / under 80% (display bands, not a
  standard). This week shows signed-so-far with a dashed outline. Tap a square for the counts.
- **Why weeks were made up:** people-weeks closed by makeup, grouped by reason, with average days late.
- **By week:** score bar per week; tap for who's open (make up by date), missed, made up (date + reason), on time,
  and the talks given that week (makeups tagged).
- **By person:** on time, made up, open, missed and score; "only people with open or missed weeks" switch.
- **Flags on sign-in sheets:** recent not-signed / absent rows, each linking to its record.
- **CSV export:** one row per person per week: week, week #, talk, person, team, status, signed on, makeup reason,
  record ID.
- Reports carry the same no-compliance-claim note as the PDF.

## Not yet decided
- Pricing (per company per month vs per crew).
- Whether RomanOS reads records from this app through an API (later, only if useful; no shared code).
- Moving the repo from Joe's personal GitHub account to a company organization.

## Daily pre-task plans (built, migration 0018)
- **What:** a short plan the crew makes together before work, separate from the weekly toolbox talk. GCs commonly
  require a daily pre-task plan alongside a weekly talk; OSHA's construction safety-program guidance recommends daily
  planning meetings (OSHA 3886). Off until an admin turns it on (Admin → Company → Daily pre-task plans).
- **Flow:** Home → "Start today's pre-task plan" → plan the day (tasks; hazards and controls, with suggested starting
  points to edit; PPE; permits; equipment; meeting point and emergency plan, remembered per jobsite; other work
  nearby) → who's here → everyone signs a daily statement (versioned, in the language picked, English under it) →
  saved. Hot days add the heat reminder, saved with the plan.
- **Equipment reminders** (scaffold, trench, crane, aerial lift, forklift, harness) show what the rule asks someone to
  check, with the cite (1926.451(f)(3), 1926.651(k)(1), 1926.1412(d)(1), 1926.453(b)(2)(i), 1910.178(q)(7),
  1926.502(d)(21)). The record keeps the foreman's answer ("checked by ___" or "not used today"). The app never says
  an inspection happened or that anyone complies.
- **Records:** saved through the same pipeline as weekly talks (roster, private signature files, offline outbox, PDF,
  append-only), as `record_kind = 'daily'` with the structured plan in `pretask`. A daily plan has no week, can't be
  a makeup, never locks or fills the weekly talk, and never counts toward the sign-in rate. Records list tags it
  "Daily plan"; the PDF says "Daily plan · separate from the weekly toolbox talk".
- **Reports:** "Daily pre-task plans" shows days with a plan per crew: a count, not a rate, because the app doesn't
  know which days were worked yet (a "worked today" signal is a later item).
