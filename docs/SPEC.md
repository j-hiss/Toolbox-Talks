# Toolbox Talks — product spec

The decisions made while building the prototype (`prototype/index.html`). The prototype is the reference behavior;
this file is the why. Update both when a decision changes.

## The job
Crews are supposed to get a weekly safety talk and sign in. Today that's a printed sheet on a clipboard, a talk nobody
wants to read, and a stack of paper nobody can find when OSHA or the insurer asks. This app makes the talk quick to
give, easy for any crew to understand, and leaves a signed record the owner can pull up in seconds.

The value customers pay for is the **signed, searchable record**. The talk content is a commodity that gets them to
"complete on day one".

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
- **Industries:** Construction · Manufacturing · Agriculture & Fertilizer · Warehouse & Logistics. Each industry has its
  own talks plus an **"Every job"** set shown to everyone (heat, cold, fatigue and sleep, slips/trips/falls, PPE,
  emergencies, hurricane and storm prep).
- **Target size:** 25–30 talks per industry so a topic comes up once or twice a year, not every few months. Use the
  Roman Roofing 52-week calendar as a topic checklist for construction (topics only; nothing Roman-specific ships).
- Talks are versioned content. A record stores the exact version that was read.

## The 52-week plan
- One talk per week, per company, with a **Week 1 start date** set in Admin. Weeks start Monday.
- **Timed to local weather by ZIP code.** Long heat season in hot states, no cold-weather talks in South/Southwest
  Florida, Hawaii or Puerto Rico, hurricane prep before and during storm season only in hurricane states.
- The admin can swap any week's talk. The home screen opens on **this week's scheduled talk**; the presenter can pick a
  different one, and the record notes it was a **substitute**.

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
- **Company info:** name, license numbers (one per line), address, phone, email/website, default jobsite, Week 1 date.
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

## Running a talk
1. **Pick the talk** (this week's scheduled one is on top).
2. **Read it** in the chosen language, or press play.
3. **Who's here:** choose the presenter (dropdown of everyone who can present), the team, and the jobsite. The team's
   roster loads, team lead first. Uncheck anyone who isn't there. Add walk-ins not on the roster.
4. **Sign:** presenter signs first, then each person present. If anyone hasn't signed, the app names them before
   saving; saving anyway flags them as **Not signed**.

Every roster person ends as **Signed**, **Not signed**, or **Absent**.

## The PDF record
- Company header: name, address, phone/email, license numbers.
- "Week N of 52 · week of <dates> · Scheduled talk / Substitute talk" (and the scheduled talk's name if substituted).
- Date and time, jobsite, team, team lead, presented by (name and role), language, industry.
- Attendance summary with flagged count.
- The full talk content that was read.
- Sign-in sheet headed with week, talk, date and team: name and role, status, signature image, time signed. Flagged
  rows shaded.
- "Talk delivered by" block with the presenter's signature.
- Footer on every page: record ID, page number, "Documents a safety meeting. Does not by itself certify OSHA
  compliance."
- File name: `Week 06 - Toolbox Talk - <talk> - <date>.pdf`.
- In the real app, the PDF is saved to the company's account automatically; the presenter doesn't have to send it.

## Admin reports
- Filters: last 4 weeks · last 12 weeks · this year · all time; one team or all.
- Headline numbers: talks held, weeks missed (team-weeks with no talk), sign-in rate, open flags.
- **Weekly coverage grid:** week × team, each cell the talk given, "Missed", or "Not yet" for the current week. Tap a
  talk to open its record.
- **Employee table:** signed / not signed / absent counts and last signed date; "only people with flags" switch.
- **Recent flags** list.
- **CSV export**, one row per person per talk.

## Not yet decided
- Pricing (per company per month vs per crew).
- Whether RomanOS reads records from this app through an API (later, only if useful; no shared code).
- Moving the repo from Joe's personal GitHub account to a company organization.
