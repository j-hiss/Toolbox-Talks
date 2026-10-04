# Build GO template

How work gets handed to the build agent. Claude (architect/reviewer) writes a GO as a `.md`; Joe pastes it to the
build agent (repo + database + push); the agent reports back; the reviewer re-verifies before anything is called done.
Adapted from the Contrax Railyard GO checklist, where each item is the cost of a real incident.

Keep every GO to **one outcome**. Name what is out of scope ("NOT THIS GO") so the agent doesn't wander.

---

## Every GO includes

1. **Ground truth.** Open with the current state verified directly (the repo at a named commit, a query result, a
   screenshot), not from a relayed report.
2. **Blueprint check.** Consult `BLUEPRINT-reuse-map.md` and cite the reused component (file:line) before wiring
   anything new. New component → add it to the blueprint in the same change.
3. **Tenant isolation check.** Every new table has `company_id` and RLS. Every new query, route and storage path is
   company-scoped. Include a test that a second company **cannot** read the first company's rows, and show it failing
   when the filter is removed.
4. **Record integrity.** Saved records stay append-only. A change to talk content creates a new version; old records
   keep the version that was read. The PDF built from a record matches the record.
5. **Honest status.** Every roster person ends as signed, not signed, or absent. Missed weeks show as missed. No flag
   is dropped, hidden, or defaulted to "signed".
6. **Gated + additive.** Dry-run or preview first → report → apply on Joe's go. Migrations are additive; anything
   destructive is proposed, not run.
7. **Footer block.** Commit attribution (`Co-Authored-By:` + `Claude-Session:` lines) and push discipline: tests as
   their own command, read the exit code, push as a separate command. Never chain `&& git push`. Green pushes, red holds.
8. **Report-back template.** The exact things to report so the reviewer can re-check them: commit SHA, test count
   (N/N), the isolation test's fail-then-pass proof, screenshots of the changed screens on a phone-width viewport.

---

## Skeleton

```md
# GO: <one outcome>

## Ground truth
<what is true right now, and how it was verified>

## Build
<the change, in steps>

## Blueprint
Reuse: <component (file:line)> · New: <component + why nothing existing fits, or "none">

## Must hold
- Tenant isolation test (fails without the filter, passes with it)
- Records append-only; PDF matches record
- Honest status: signed / not signed / absent, missed weeks shown

## NOT THIS GO
<adjacent work explicitly left out>

## Push discipline
Run `npm test` on its own and read the exit code. Push separately. Red holds.
Commit footer:
Co-Authored-By: Claude <noreply@anthropic.com>
Claude-Session: <session link>

## Report back
- Commit SHA:
- Tests: N/N green
- Isolation test: failed without filter (paste) / passed with it (paste)
- Screens: phone-width screenshots of every changed screen
- Blueprint rows added/changed:
- Anything not verified, and why:
```
