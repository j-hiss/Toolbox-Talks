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
- **Each week's talk is locked.** Every crew gives the same talk that week, as many times a day or week as needed
  (several crews, several shifts). There is no "give a different talk" button.
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

## Running a talk (built)
- **Home → Start this talk** opens this week's talk (locked for the week). **Make up a missed week** picks a past week
  inside the admin's limit and a reason, then runs that week's talk. A talk in progress is saved on the phone after every tap; Home shows **Resume**.
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
- Footer on every page: record ID, page number, "Documents a safety meeting. Does not by itself certify OSHA
  compliance."
- File name: `Week 06 - Toolbox Talk - <talk> - <date>.pdf`.
- **Built:** Records → a record → **Download PDF** (share sheet on phones, download on computers). Every signature
  line, including the presenter's, carries the full date and time signed with the time zone. GPS at time of talk
  is listed when it was captured.
- The PDF is regenerated from the saved record each time, so it matches what was signed. Company header details come
  from the company's current info (not yet snapshotted per record).
- Later: save a copy to the company's account automatically so the presenter doesn't have to send it.

## Admin reports (built)
**Home → Reports** (owners and admins).
- **Compliance score:** everyone on staff signs each week's talk. Score = people-weeks signed (on time or made up) ÷
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
- **Change:** last 4 finished weeks vs the 4 before, in points (fewer when the range is short).
- **Trend chart:** compliance and on-time rate per finished week; the shaded gap between the lines is makeups.
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
- **Where signatures live.** Today they're PNG images inside the record rows, protected by the same row-level
  security as everything else (no public access, company-only). `CLAUDE.md` asks for private Storage with
  short-lived signed URLs; moving them there is pending Joe's decision.
- Pricing (per company per month vs per crew).
- Whether RomanOS reads records from this app through an API (later, only if useful; no shared code).
- Moving the repo from Joe's personal GitHub account to a company organization.
