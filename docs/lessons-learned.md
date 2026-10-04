# Lessons learned

Mistakes already paid for, so nobody pays twice. Entries 1–6 were learned on the Contrax Railyard build
(`j-hiss/Contrax-Operations-Dashboard`, `docs/lessons-learned.md`) and apply here as-is. Add this project's own
lessons below them: what we believed, what was true, and the evidence (a commit, a file, a query).

---

## 1. A green signal that isn't measuring what you think is worse than no signal.
A passing check proved nothing when it couldn't fail: a `curl` audit returning 200 on a broken page, a "solved"
status report with no code behind it, a rot-check nobody had seen go red, zero rows read as "empty".

**Here:** before trusting any guard (tenant isolation, flag counting, PDF parity), **break it once and watch it fail**,
then restore it. A test that can't fail is decoration.

## 2. Verify claims against git, not against the confidence of a summary.
A report claimed a fix "across 7 agencies" that never existed in the repo. A report is a hypothesis; the commit
history is the fact.

**Here:** every build report names the commit and the test count. The reviewer re-checks against the repo before
calling it done.

## 3. Zero is never assumed to be success.
An empty result was a broken search, not an empty source.

**Here:** a week with no talk record is **missed**, never "fine". A report that returns no employees for a team that
has people is a bug until proven otherwise.

## 4. curl is not a browser. Test the states real users hit.
An audit passed while users hit a redirect loop from a stale session cookie, a state the audit never sent.

**Here:** test the real phone flow: signing with a finger, a dropped connection mid-talk, an expired login on the
jobsite, a foreman who belongs to two companies. Logged-out, logged-in, and "cookie present but stale" are three
different states.

## 5. A value exported from a `"use client"` module is not safe to call from the server.
A small styling helper exported from a client component took down every server page that imported it.

**Here:** pure helpers (status labels, week math, PDF layout constants) live in plain modules with no `"use client"`.

## 6. Load-test before you scale, not after.
A single global lock capped the whole fleet and only showed up under a 10,000-job test.

**Here:** PDF generation, audio playback and report queries get tested at realistic size (a 200-person company,
a year of records) before launch, not after the first big customer.

---

## Toolbox Talks lessons
_None yet. Add them as they happen._
