# Lessons learned

Mistakes worth not making. Each entry: the trap, and what it means for this app. Add this project's own lessons at
the bottom as they happen: what we believed, what was true, and the evidence (a commit, a file, a query).

---

## 1. A check that can't fail is decoration.
A passing check proves nothing if it was never seen to fail: a page that returns 200 while broken, a status report
with no code behind it, a test that asserts nothing.

**Here:** before trusting any guard (company isolation, flag counting, PDF matching the record), **break it once and
watch it fail**, then restore it.

## 2. Verify claims against the code, not against a summary.
A report saying something is fixed is a hypothesis. The commit history and the tests are the fact.

**Here:** every build report names the commit and the test count. The reviewer re-checks against the repo before
calling it done.

## 3. Zero is never assumed to be success.
An empty result is usually something broken, not something empty.

**Here:** a week with no talk record is **missed**, never "fine". A report that shows no employees for a team that
has people is a bug until proven otherwise.

## 4. Test the states real users hit.
Automated checks that only try "logged out" and "logged in" miss the third state: a stale or expired session.

**Here:** test the real phone flow: signing with a finger, a dropped connection mid-talk, an expired login on the
jobsite, a foreman who belongs to two companies.

## 5. A value exported from a `"use client"` module is not safe to call from the server.
In the Next.js App Router, a helper function exported from a client component can crash the server pages that import it.

**Here:** pure helpers (status labels, week math, PDF layout constants) live in plain modules with no `"use client"`.

## 6. Load-test before you scale, not after.
Bottlenecks like a single global lock stay invisible at small size and only show up under real load.

**Here:** PDF generation, audio playback and report queries get tested at realistic size (a 200-person company,
a year of records) before launch, not after the first big customer.

---

## Toolbox Talks lessons
_None yet. Add them as they happen._
