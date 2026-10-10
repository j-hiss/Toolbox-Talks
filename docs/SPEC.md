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
- **Installable from the browser (built 2026-10-09):** "Add to Home Screen" on iPhone, iPad and Android, "Install" in
  Chrome or Edge on a computer. Opens full screen with the app icon (`src/app/manifest.ts`, placeholder icons from
  `scripts/make-icons.mjs`). The website keeps a copy of the current build on the device (`out/sw.js`, written by
  `scripts/build-sw.mjs` after `next build`), so it opens and moves between screens with no signal; Supabase, map
  and weather requests always go to the network. Off inside the store apps and in `npm run dev`.
- **Phone, tablet and office computer (built 2026-10-09):** the same screens, laid out for the size. Phones and
  tablets held upright: one column with the bottom tab bar (wider on a tablet). 1024px and up (iPad sideways, a
  laptop or office computer): a side menu with the company name and the same tabs, wider pages, Home in two columns
  (the week on the left; jobsite, weather and what's coming on the right), makeup cards side by side in Reports.
  Giving a talk stays one column at tablet width at most, so it reads and signs the same everywhere.
- **Works without signal.** Talks, audio and signatures save on the phone and upload when the connection returns.
- **Phones first.** Big tap targets, readable outdoors, works one-handed on a tailgate.
- **Everything runs locally for free while we build.** Local Supabase on a Mac; no Supabase or Vercel account until
  launch. Note for launch: Vercel's free plan is for non-commercial use; since the app is a static site, any static
  host works.
- **Store accounts when publishing:** Apple developer account ($99/year), Google Play developer account (one-time fee).

## Who uses it
Two separate things describe a person (decided with Joe, 2026-10-09):
- **Job title** (Admin → Job titles): their real job, from a starter list for the company's industry (Roofer, Laborer,
  Foreman, Office...) that the company can add to. Each title is marked **Gives talks** or not; titles that give
  talks, plus each team's lead, appear in "Presented by". Someone with no title is a **Team member** and signs only.
- **App role** (Admin → App access), only for people who sign in:
  - **Owner**: everything, including who is an owner or admin. A company always keeps at least one owner.
  - **Admin**: setup, people, plan, reports, safety log, safety profile. Can't make or change owners and admins.
  - **Presenter**: gives talks and daily plans; sees records and the plan.
  - **Office**: sees reports and records and works the issues list; doesn't give talks or change setup.
  - **Employee**: sees only their own talk history (linked to their name on the roster). Nothing else of the company.
- **Team member** (anyone on the roster): listens and signs on the presenter's phone. No account needed.
- **Joining:** an admin invites an email with an app role (employees also pick their roster name). The person signs
  in with that email (emailed code, so the address is proven) and is added automatically. The app sends no email.
- **Words:** one person is a "team member"; a group is a "team" (the old "crew"). Talk text keeps its own wording.

## Company-neutral, multi-company
Any company in any of the supported industries can sign up. Each company's data is fully separate. Roman Roofing is
customer #1, not a special case.

## Talk library
- Rewritten from free federal OSHA material: shorter, plainer, less dry. Each talk is a hook, two or three short
  sections, and one question to ask the crew. About 4–6 minutes read aloud.
- **Trades that borrow a library get their own talks first (2026-10-09).** Roofing, Electrical, Plumbing & HVAC, Solar and
  Demolition also get every construction talk, but their 52-week plan now leads with the talks tagged for the trade
  and the Every-job set, then the rest of construction. Roofing's tag set: fall protection, ladders, low-slope and
  steep roofs, roof brackets, skylights, harness, rescue, scaffolds, falling objects, debris chutes, GFCIs, power
  lines, nail guns, torch-down, silica, eye protection, hand tools, asbestos, housekeeping, kettles, hoists, sun.
  A Florida roofer's first year has no trenching or confined-space weeks. New talk: **Roof Brackets and Roof Jacks**
  (1926.452(h), 1926.451(b)(1) and (f)(3), residential fall protection guidance; Spanish draft).
- **Library rule (Joe, 2026-10-10): no talk for the sake of a bigger library.** Each new talk covers something new and
  ties back to a regulated item the app tracks (a training card, a yearly-rule reminder, a safety log entry). Overlap
  between talks a crew sees is cut, not kept. Pass of 2026-10-10 (roofing and construction):
  - New, each tied to a tracked card: **Rotten and Weak Roof Decking** (1926.501(a)(2); fall protection card),
    **Telehandlers and Rough-Terrain Forklifts** (1926.602(c)-(d), 1910.178(l); forklift card), **Boom Trucks and
    Crane Deliveries to the Roof** (1926.1400(c)(17), 1926.1419, 1926.1428; crane card), **Pre-1978 Homes: Lead-Safe
    Work** (EPA 40 CFR 745 subparts E-F; EPA lead-safe renovator card; applies only when painted surfaces are
    disturbed). Weeks 12-15 of a roofing plan. Spanish drafts.
  - **Fall Protection** is now **Fall Protection and Guardrails** (the 6-foot rule plus 1926.502(b) guardrail specs);
    its harness and hole-cover parts were already in the Harness and Skylights talks.
  - **Debris Chutes** lost its "clean as you go" section (it was Housekeeping). **Temporary Power** is tagged for
    electricians only; other crews get GFCIs and cords from "Electrical: GFCIs, Cords and Tools".
  - With four more roofing talks, hearing protection and OSHA lead move to a roofing company's second year.
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
- **Built (migration 0035, 2026-10-10):** recordings are made per line, named by a fingerprint of the exact words, the
  language and the voice, so rewording a talk only needs its changed lines recorded and nothing stale can play. The
  talk screen plays a recording when there is one and the phone's voice for anything else (site notes, today's heat
  index, "Since last talk", draft translations), with the same line highlighting. Opening a talk with signal saves its
  recordings on the phone for later. Recordings are made on a computer (`scripts/voice/README.md`: list, record with
  Kokoro, upload); the tools refuse any voice not marked "Yes" in `docs/voice-licenses.md`. English uses af_heart;
  Spanish ef_dora, recorded only for reviewed translations. The library audio lives in a public, read-only bucket
  (no company data in it). Company-written talks use the phone's voice.
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
- **Default look, "Momentum" (2026-10-09, Joe ranked the directions B, then C, then A):** dark-first. Near-black
  page #0E1116, cards #171C23, text #F2F4F7, one bright green #3DDC97 for brand, buttons and done, warm gold #FFC24B for
  caution and the streak, soft red #FF6B6B for missed. Titles and big numbers in Archivo (bundled, heavy weights);
  everything else in the phone's own font (Inter off Apple devices). The one main action on a screen is a large pill
  ("Start this talk"). Reads well outdoors and in any workplace.
- **Home hero:** a ring that closes as people on staff sign this period's talk (same count as the team chips), and the
  streak: talk periods in a row with a talk given in that period (`talkStreak`, up to a year back, never before the
  program start). A row of dots shows the last 8 periods: gold = held, red = missed, dashed = this period not held yet.
  A makeup given later doesn't repair the streak, and missed periods in the last year are counted in red. Honest
  status: nothing is hidden to keep a streak.
- **Saved screen:** a check draws itself; when every person on the roster signed and the presenter signed, it turns
  green, says "Everyone signed" and the phone buzzes. Anything flagged (not signed or absent) gets the plain grey check
  and the flagged count, as before. Animations are off for people who ask for reduced motion.
- **Earlier looks kept as presets:** Clarity (A: the apple.com-inspired light look, #F5F5F7 page, #0071E3 blue, white
  cards), Field (C's colors: charcoal and safety orange), Ledger, Signal (the ANSI Z535 / ISO 3864 safety-sign
  colors), Harbor, Graphite. No Apple names, logos, images or fonts are copied.
- **Light by day, dark at night (Joe, 2026-10-09):** the default is now **Paper**: deep forest #1F4D3A on warm tan
  (page #E9E7DF, cards #F6F5F0, text #1E2422), like the logo board. A phone in dark mode gets **Momentum**, the
  default's designed night version (green-black page, bright green #3DDC97, gold streaks), including its status
  colors. The phone's status bar follows (tan by day, green-black at night). Momentum stays a preset for companies
  that want dark all the time.
- **Brand pass (2026-10-09, after the look book):** Momentum's page and cards take a green-black tint that matches the
  brand charcoal (#111613 / #1A211D). The signature line (bar and dot) sits under every page title and on the signing
  pad (the dot fills in green once signed; it is drawn over the pad, never into the saved signature). New light
  preset **Paper**: deep forest on warm off-white, the brand's own light look. PDFs print the company's brand color
  darkened until it reads on white (`printBrand`), and each signed line ends in a small brand-colored dot; the printed
  status beside it stays the record.
- **Admin → Brand:** an admin can change any of the eight colors (brand, buttons, done, caution, missed, background,
  cards, text) with a color picker or an exact hex code, or start from a preset (Paper, Momentum, Clarity, Field, Ledger, Signal, Harbor, Graphite).
  The whole app changes live while trying colors; nothing is saved until "Save colors"; leaving the tab puts the
  saved colors back. "Back to default" returns to Paper.
- **Checks, not blocks:** plain-language warnings when a choice makes text hard to read (WCAG contrast) or makes
  two meanings look alike (done vs missed, buttons vs missed). They warn; the admin can still save.
- Saved per company (`companies.theme`, only the changed colors), seen by everyone in that company, remembered on
  the phone so the app opens in the right colors offline. The PDF header band uses the brand color; the PDF's
  status colors and content don't change with it.
- Phone dark mode: a dark theme (like Momentum) stays as it is. A light theme gets a dark page, cards and text, with its
  brand lifted toward white until it reads as link text (4.5:1) and its buttons until they stand out (3:1), worked out
  in `src/core/theme.ts` (`darkVersion`).
- Saved colors are only the ones changed from the default, so a company that changed one color under Clarity now sees
  it on Momentum. Admin → Brand shows any readability warning that causes; picking a preset sets all eight.

- **Polish pass (2026-10-10, "I like what we have, just want it better").** One bold element per screen: Home's talk of
  the week leads, with a band in the brand color (a deep tint of it at night), the week number large, the year's
  progress, the title and the signature line. Everything else quieter: cards get a crisp hairline edge and a soft
  lift; notices carry an icon for their kind (info, done, needs attention, error); the current tab sits on a soft pill;
  the streak is Done green (amber stays "needs attention"); "Coming up" shows week badges; profile rate tiles get a
  meter. Company colors drive all of it.
  Second pass: giving a talk shows its three steps by name (Read, Who's here, Sign; done steps ticked); the talk text
  reads like a card from a binder (larger hook, green section headings with a rule, round markers, the crew question
  set apart at the end; code and minutes under the title); "Read it out loud" has a speaker icon. Records rows lead with
  the day held as a date tile and show an attendance bar: signed, not signed and absent each in their own color.
  Third pass: people show an initials badge on the roster and the signing screen ("Pass the phone to" with a large
  badge, so a crew member finds their own name fast); what they're signing for sits in its own panel. Reports leads with
  the sign-in rate as the headline card (large number, change as a green or red pill, rounder status bar), then the
  makeups (time left as a pill, amber when 7 days or fewer); the profile link has an icon; the folded sections are
  cards with a chevron and the charts inside them sit flat.
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
  On a big screen the same tabs are a side menu instead.
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

## Repeat talks and yearly-rule reminders (built, migration 0019)
- **Admin → Plan → Repeat talks:** pick a talk and "every 3 months", "every 6 months" or "every year". The plan puts
  it in the first open week of each block (counted from when the repeat starts); the rotation carries on after it;
  an admin's swap of that week moves the repeat to the next open week. Changes start next week and are kept once
  their week starts (`company_repeats`, same lock as talk lists and cadences). "Stop" adds an "off" row from next
  week.
- **Rule reminders** (`src/content/repeats.ts`, versioned content): talks that touch a rule with a fixed schedule show
  a caution note on the Read screen and in the picker: who it applies to, what the rule asks and how often, the cite,
  and either "This talk can help cover it" (extinguisher education only) or "This talk is a refresher, not that
  training, test or inspection." Covered: forklift evaluation (3 years), respirator retraining and fit test,
  hearing conservation, extinguisher education, bloodborne pathogens, asbestos, lead, permit-space rescue practice,
  lockout periodic inspection, and EPA Worker Protection Standard training (named as EPA).
- **Later:** per-person due dates (each operator's evaluation, each fit test, certificates) and trigger prompts
  (after an incident or a new truck or respirator) are a separate feature.

## Safety profile and renewal packet (built, migration 0020; partner portal phase 1)
- **Company first, privacy first.** The profile is the company's own summary of its safety effort. Nothing is shared
  until the company sends the PDF or makes a private link (below). Partner access (phase 2) needs counsel's privacy
  review and the company's approval per partner.
- **Share with your agent (built, migration 0025):** owners and admins make a private link for the dates on screen,
  say who it's for, and pick 7, 30 or 90 days. The link shows a copy frozen when it was made (counts and rates only,
  the same view and PDF as the company's screen), needs no account to open, and stops working when it expires or is
  switched off. The link is shown once (only its fingerprint is stored); the secret sits after "#" so it never reaches
  a web server's logs. Each open is logged and shown in the list (the company's own admins checking it aren't
  counted). Nothing is deleted. Links need the website address (`NEXT_PUBLIC_APP_URL`) once the site is live.
- **Insurance partner portal (built as a PILOT, migration 0027; needs counsel's privacy review before real use).**
  Hidden in the real app unless `NEXT_PUBLIC_PARTNER_PORTAL=pilot`; on in the preview. On the Safety profile, an owner
  or admin invites an agent, broker or carrier by email and sends them the summary on screen (the same frozen,
  counts-only copy and PDF as a share link). The partner signs in with an email code and sees only the companies that
  sent them something and those summaries: no names, signatures, phone numbers or injury details, no live data. Every
  open is logged and shown to the company. The company can withdraw a summary (gone for the partner, kept on file) or
  remove the partner (all access ends). **Two switches:** the screens need `NEXT_PUBLIC_PARTNER_PORTAL=pilot` at build
  time, and the database refuses invites and sends unless the company is in `private.partner_pilot` (set only by the
  database owner, after counsel's review). **Never free text:** shared copies carry document kinds and dates, not
  titles, and no EMR notes; the database rejects anything else (review 2026-10-10). Summaries are sent, not live, because the profile math runs in the app and a
  second copy in the database would drift; the company sends a fresh one when it wants (for example monthly).
- **Reports → Safety profile & renewal packet** (admins): last 12 months, last month, or picked dates. Shows weekly
  talks held of weeks ended, crew sign-in rate and on-time rate, talks and topics, makeups, daily-plan days,
  inspections, crew-raised issues fixed and typical days to fix, a month table, languages.
- **Honest and worded for the company.** Weeks with no talk recorded are listed on the screen and in red in the PDF;
  they're never dropped. Wording credits what was done and states gaps plainly ("not part of the app"), without instructions or blame in the PDF.
- **Program elements:** the seven elements of a workplace safety program (labelled Florida s. 440.1025 when the
  company ZIP is in Florida), each marked "Shown by app records", "Partly shown by app records" or "Outside the
  app", with the evidence count. The insurer decides any premium credit; the app never says a requirement is met.
- **Self-reported:** EMR per rating year typed from the worksheet (append-only; latest per year shown; always labelled
  self-reported, never computed) and program documents (written program, EMR worksheet, OSHA 300A, other) in private
  storage; the PDF lists titles only.
- **Two PDFs from the same builder:** the renewal packet (12 months) and the monthly program summary. Counts and rates
  only: no worker names, signatures, phone numbers or injury details. No-compliance footer on every page.
- **Pricing idea (Joe, 2026-10-09, not decided):** carriers drive adoption; the app may be paid, discounted for a
  company that shares its profile with its carrier, or carrier-sponsored.

## Training cards and certifications (built, migration 0023)
- **Admin → Training:** every person with their cards (OSHA 10/30, fall protection, scaffold, aerial lift, forklift,
  crane, respirator fit test, hearing, first aid/CPR, bloodborne pathogens, confined space, HAZWOPER, asbestos, lead,
  EPA lead-safe renovator, EPA WPS pesticide, CDL medical card, flagger, or a typed name). Each card: issued date,
  expiry typed from the card (none = stays current), note, optional photo of the card (private, admins only).
- **What each job title needs:** tick the cards a title needs; anyone with that title shows **Missing** until one is
  on file. Status per card: current, expiring (within 30 days), expired, missing. Home tells admins the counts.
- **Append-only:** a renewal is a new card; a mistake is withdrawn with a reason and stays on file. The latest card per
  type counts.
- **The app never works out an expiry from a rule.** Rule notes show only where the rule text was checked (the
  repeat-talk rules, crane 29 CFR 1926.1427, scaffold 1926.454). HAZWOPER, CDL medical, fall protection, OSHA 10/30,
  first aid, confined space and RRP have no note until their rule is checked.
- **Who sees cards:** owners, admins and office see the company's; employees see only their own on their home screen;
  presenters see none. Photos of cards: admins only.
- **Trainer portal (built, migration 0026):** Admin → Training → Trainers. An owner or admin invites an outside trainer
  or training company by email and ticks which people the trainer may see. The trainer signs in on the website with an
  email code and sees only each inviting company's name and those people's names and job titles (no records, talks,
  reports, phone numbers or anyone else). They send a card (same form as the admin's); it waits as "Waiting for the
  company" until an owner or admin approves it (then it's a training card noted "Sent by trainer …") or declines it
  with a reason the trainer sees. Reviewed once; nothing deleted. Removing a trainer ends access at once; cards they
  sent stay on file. A card is saved on the trainer's phone first and sends when there's signal, never twice. A trainer
  can have at most 200 cards waiting and upload 100 photos a day. All waiting cards always show to the company. An
  approved card is tagged "Sent in by a trainer" (linked to the submission, not written into the note).
- **Safety profile:** the training element adds "Training cards entered by the company, as of today: N current,
  N expired, N missing" (labelled as company-entered; expired and missing said plainly).

## Your own talks (built, migration 0029)
- **Why:** the library can't know a client's site rules, a machine only one company runs, or last week's near miss.
  Competitors that win on library size still can't cover these; a company writing its own closes that gap without a
  bigger library for its own sake.
- **Where:** Admin → Talks → Your own talks (owners and admins). Write a talk (title, opening line, sections with
  points, a question for the crew, minutes, optional rule or reference) or start from a library talk and make it fit.
- **Versions, never edits:** each save is a new version; records keep the exact words that were read, as with every
  talk. Retiring is a version marked retired: it stops being offered, records keep their text, and a week already
  planned with it still shows it.
- **Using it:** "Give it now" starts it like any talk; it can be ticked into the rotation (Talks in your plan) or
  swapped into a week (Plan, "Your own talks" group). It never joins the rotation by itself, so adding one never
  shifts planned weeks.
- **Spanish:** optional. It starts blank with the English shown in each box as the thing to translate, must be whole
  to save, and shows with the "not yet checked" warning until someone who reads Spanish checks it and is named on
  that version. Changing any words sets it back to draft.
- **No signal:** the company's talks are kept on the phone, so a planned company talk still opens offline. A phone
  that never loaded them says so instead of breaking.

## Check a record from its PDF (built, migration 0030)
- **Why:** a paper sign-in sheet can be filled in after the fact; nobody can tell. Every record PDF now carries a check
  code and QR code. An inspector, insurer or general contractor scans it and sees what was saved, straight from the
  database, so the paper can be trusted without an account.
- **What it shows:** company, talk (and its English title), when it was held and saved, the plan week or makeup week,
  and how many were on the roster, signed, didn't sign and were absent, plus whether the presenter signed. No names,
  signatures, places, photos or ids: the paper has those; the check shows the paper matches.
- **The code:** 16 characters with no look-alikes (no 0/O, 1/I/L), about 79 random bits, printed in groups of four in
  the PDF's "check this record" box and every page footer. The QR opens `/verify/#CODE`; the code after `#` never
  reaches a web server. Typed codes accept any case, dashes or spaces. Every existing record got a code too.
- **Honest:** flags show as saved. A mistyped code says no record has it and to check each character.

## OSHA 300 log and 300A summary (built, migration 0031)
- **Why:** competitors bundle injury recordkeeping; a company running talks here had to keep the OSHA log somewhere
  else. Now the log, the yearly summary and the confidential privacy list come from the same app.
- **Who:** owners and admins only. Injury details are health information: no presenter, office, employee, trainer or
  partner sees them, and nothing goes into shared summaries (counts may join the safety profile later, after
  counsel's privacy review).
- **The log (Form 300 columns, checked against 29 CFR 1904.29, 1904.7 and 1904.32 on 2026-10-10):** case number,
  name, job title, date, where, what happened; one box for the most serious outcome (death, days away, job transfer
  or restriction, other recordable); days away and restricted (calendar days from the day after, capped at 180, days away and restricted together); type
  (injury, skin, respiratory, poisoning, hearing loss, other illness). The database checks the days match the box.
- **Privacy cases** (the six kinds in 1904.29(b)(7)) print "Privacy case"; names go on a separate confidential list.
  Only an illness can be withheld at the person's request.
- **Versions, never edits:** an update is a new version; "not recordable" takes a case off the log with a reason and
  keeps its history. Case numbers count up per year and never change. Times come from the database clock.
- **300A:** totals (zeros with no cases), establishment, industry and NAICS, annual average employees, hours worked,
  certifier name, title and phone; the executive signs and dates the paper. Carries the employee access and falsifying
  statements and the posting dates (Feb 1 to Apr 30). January to April, Admin reminds to post last year's.
- **Rates:** recordable and days-away/restricted per 100 full-time workers (200,000 hours) once hours are entered.
- **Review (2026-10-10, migration 0032):** an independent review found no critical or high issues; fixed: database clock
  on talk versions, talk content shape checked, combined 180-day cap, no future injury dates, confidential label on
  every privacy-list page.
- **Form 301 (built, migration 0033):** each case carries its incident report, fields 2–18 in the form's order, with
  what's still missing shown on the case and the PDF. Names typed into boxes 14–17 are caught (those boxes go to OSHA).
- **Filing online (built):** from the NAICS code and everyone employed at any time in the year, the app says what the
  rule appears to ask for any industry: keep the log or not (10 or fewer; partially exempt industries), file the 300A
  online (20–249 in an Appendix A industry, or 250+), and the 300 and 301 too (100+ in an Appendix B industry), due
  March 2. It builds OSHA's upload files in OSHA's exact column names; the case file never carries the name, address,
  doctor or facility. Every industry in the app offers common NAICS codes as a starting point. OSHA's lists use 2012
  NAICS codes; a newer code is matched by prefix and flagged to confirm on OSHA's site.
- **Honest limits:** the app keeps the log and builds the forms; deciding recordability is the company's. It reminds
  about 8-hour and 24-hour serious-injury reports (1904.39) but doesn't send them, and it doesn't submit to OSHA (the
  company uploads the file). Not yet: several establishments per company.

## Topic icons and spreadsheet export (built)
- **Topic icons:** every talk shows a small icon for its topic (weather, falls, electrical, fire, chemicals and air,
  vehicles, machines and tools, body and PPE, health, people and emergencies, digging and tight spaces), worked out
  from the talk itself. On the talk picker, Home's "Coming up" list and as a chip above the talk's title.
- **Spreadsheet:** Reports → "Download spreadsheet (CSV)": one row per person per week. Accents come through in Excel,
  and nothing typed into a name can run as a spreadsheet formula.

## Inspections (built, migration 0034)
- **Why:** inspections were the biggest feature competitors had that we didn't. Here they're tied to the rules that ask
  for them, for every industry, and they feed the same issues list as talks.
- **Checklists (content, not code):** an "Every job" set (fire extinguishers, walkways and exits, first aid, ladders,
  cords and tools, chemical labels and safety data sheets) plus each industry's own: scaffolds, trenches, harnesses,
  aerial lifts and rigging for construction; roof setup, brackets, kettles and hoists for roofing; temporary power and
  lockout for electrical; forklifts, cranes, guards and grinders for plants and warehouses; the driver vehicle
  inspection and cargo securement for trucking; tractors, PTO guards and grain bins for farms; bucket trucks and
  climbing gear for utilities; sharps containers for healthcare; and so on. Each names how often its rule asks for it
  and every item cites its paragraph. Every industry gets at least two of its own (a test enforces it).
- **Running one:** pick a checklist (what's due comes first), say what's being inspected, mark each item pass, fail or
  not applicable ("mark the rest as pass" for speed), a failed item needs a note and can take a photo and go on the
  issues list, the inspector signs. Saved on the phone first, uploaded when there's signal, never edited after.
- **Due:** from how often the rule asks (each shift, daily, monthly) and the last one saved. Only checklists the company
  has started using count as due, so a roofer without a trench isn't told a trench check is due.
- **After:** a failed inspection offers the related talk. The PDF lists every item, notes, photos, the signature and a
  check code that /verify accepts (counts only, no names, places, photos or the free-text subject).
- **Honest:** every item ends pass, fail or not applicable; failures are never hidden. An inspection documents that
  someone looked; it doesn't certify a site.

## Tailor with AI (built, migration 0036; off until set up)
- **Why:** competitors draft talks with AI. Here AI only helps a company make a library talk fit its own work, and the
  result is a draft a person checks, never a talk the app shows on its own.
- **How:** Admin → Talks → "Tailor a library talk with AI": pick a talk, say a little about the work (equipment,
  sites, tasks). A small server function (the app's only server code, approved by Joe) checks the caller is an owner
  or admin of that company, keeps a usage log (20 drafts a day per company), and asks the AI for a version that keeps
  every rule and number of the source and adds none. The app re-checks the answer: a draft that adds a number, drops a
  rule reference or mentions compliance is refused. The draft opens in the company-talk editor with a notice to read
  every line; saving makes it a company talk marked AI-drafted. Works the same for every industry (the prompt uses the
  company's industry and where it works).
- **Setup (Joe):** `supabase secrets set ANTHROPIC_API_KEY=…` in a terminal (never in chat or the repo),
  `supabase functions deploy tailor-talk`, then `NEXT_PUBLIC_AI_TAILORING=on`. Until then the button doesn't show.
- **Not yet:** AI translation (translations still need a person who reads the language), AI crew summaries for the
  safety log.

## Security review (2026-10-10, migration 0024)
- Independent review before partner access: 1 critical, 2 high, 3 medium, 4 low. Fixed: talk records and attendance can
  only be saved through the checked save (no forged "signed" rows or backdated records); invites can only be claimed by
  an email-code account; email confirmation on; admins can't add arbitrary accounts or rewrite memberships; people
  can't be deleted; who-did-it columns come from the signed-in user; issue history kept when an issue is reopened; a
  shared phone only uploads the saved talks of the person signed in.
- **Waiting for Joe:** make `client_id` unique per company (not across all companies) on records, issues and safety
  events (a constraint swap). **Deferred:** a reviewed safety event can still be edited by admins.
- **Hosted project:** turn on "Confirm email" in Supabase Auth settings before real use.

## Product name (placeholder, 2026-10-09)
- **Working name: Tuvant** (Joe, 2026-10-09; Latin *tueri*, to watch over). Earlier working names: **Keel** (dropped:
  a pending "KEEL" trademark for document and workflow software, Osgood Advisory, class 42) and **Salvant** (dropped:
  too close to Salus, a construction safety app for the same crews; SALVUS and SAVANT nearby). A first web check found
  no "Tuvant" company, product or trademark. Domains open on 2026-10-09: tuvant.io, gettuvant.com, tuvantsafety.com
  (tuvant.com is taken). Watch-out for the clearance attorney: it sounds like TÜV, the safety-testing and
  certification group. Final name waits on that clearance.
- **Logos (Joe picked D and B on the "Salvant logo ideas" board, kept for Tuvant):**
  - **Product mark, D:** bold lowercase "tuvant" (Archivo 800, the app's title font) with a rule under it, a bar and
    a dot: the signature line. The app, app icon (a lowercase t with a curved foot over the rule, on deep forest; a
    straight-footed t read as a cross), website, App Store.
  - **Company mark, B:** spaced serif TUVANT (Fraunces) between thin rules, with SAFETY PROGRAMS under it. Partner
    and insurer material, letterhead, the website footer.
  - Both are drawn as outlines (`src/content/logo.ts`, `logo.json`), so they need no font; files for print and
    designers in `public/brand/` (`npm run icons` regenerates them and the app icons).
- **Brand colors:** deep forest #1F4D3A, warm off-white #F6F5F0, charcoal #1E2422; the app keeps its bright green
  #3DDC97 for buttons and "done", gold #FFC24B for streaks. Look book ("Salvant look book" board, 32 brands in seven
  industries): dark green is unclaimed in safety, construction, industrial, insurance and workforce; avoid orange,
  mint as a lead color, purple and red.
- **Tagline:** "Every talk. Every signature. Every time."
- Set in one place: `src/content/brand.ts` (plus `appName` in `capacitor.config.ts`). The real artwork comes from a
  designer working from these directions.
