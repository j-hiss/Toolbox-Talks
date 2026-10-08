# Independent check: 52 talks for the 14 new industries (2026-10-07)

Each talk was drafted from fetched OSHA/NIOSH/EPA/DOT text (evidence file per talk), then re-checked by a separate
reviewer who opened every cited page again. The talk text in `src/content/talks.ts` is the checked version; the
evidence files show the first draft. This file lists what the reviewers changed and what they could not verify.

## Decisions applied across the batch
- **No third-party statistics.** Cut the sharps "one-third of injuries during disposal" figure and the
  patient-handling "five times the average" figure (OSHA pages don't give a data source). Kept only figures OSHA or
  NIOSH publish as their own: 9 tank-gauging deaths 2010–2014, "three of every five" oil-field deaths struck-by/caught,
  47% of NIOSH frac samples over the limit at the time.
- **rf-exposure** rebuilt without the 1995 page osha.gov marks "not DOL or OSHA controlled material". Rests on
  1910.97 (voluntary, unenforceable), OSHA's RF pages, OSHA 3877 and the 1990 AM-tower hazard bulletin.
- **Guidance reads as guidance.** Where OSHA has no rule (vehicle lifts, patient handling, crowds, late-night retail,
  construction lockout, chainsaws/chippers outside logging), lines say "OSHA's guidance says" or "should".
- **State FACE reports** (vehicle-lifts, jacks-stands, trailer-falls) are written as what investigators found in one
  case, never as rules.
- **1910.266 is logging only.** Lines from it say "in logging work"; tree-care lines come from OSHA tree-care guidance.
- **Other agencies named plainly:** EPA (refrigerants, part 82 subpart F), DOT/FMCSA (load securement, parts 392–393).

## Notable fixes by talk
- **grounding:** 1910.269(n)(1)–(6) could not be loaded from osha.gov, eCFR or Cornell; the talk is worded to
  1926.962 (the matching construction rule) and only (n)(8) is cited from 1910.269. Safety pro to confirm.
- **min-approach:** every distance matches 1926.960 Table V-5 and 1910.269 Table R-6; added phase-to-phase note.
- **pole-climbing:** hammer test is "one check", by someone qualified (Appendix D); 4-ft rule scoped to poles
  carrying power lines.
- **manholes:** telecom/electric rules scoped to that work; plumbing and sewer crews pointed to confined-space rules.
- **lockout-con:** "Construction has no general lockout standard"; steps are OSHA's recommended practice.
- **frac-silica:** respirator line now uses 1910.134 Table 1 (half mask up to 10 times the limit).
- **load-securement:** working-load-limit line corrected to 393.106(d) (over-the-top counts full, direct counts half).
- **tank-gauging:** IDLH respirator line corrected to 1910.134(d)(2)(i)(A)-(B).
- **h2s:** Table Z-2 peak limited to 10 minutes and only with no other measurable exposure; no "go upwind" claim.
- **hotel-housekeeping:** hospital eTool lines labelled as hospital guidance; 1910.1030 scope worded per the 1992
  letters; "and trash" cut.
- **cleaning-chemicals:** label duty put on the employer, with the (f)(8) spray-bottle and (b)(6)(ix) consumer-product
  exceptions.
- **knives:** 1910.147 cord-and-plug exception requires exclusive control; minor-servicing exclusion noted by "generally".
- **tire-rims:** training duty is the company's ((c)(1)–(3)); remote inflation exception (f)(4) respected.
- **brakes-asbestos:** EPA brochure labelled "EPA guidance (not OSHA)"; latency line uses OSHA's "years, even decades".
- **vehicle-lifts:** cut "If something looks wrong, speak up" (no source); lift lines are the FACE case findings.
- **refrigerants:** cylinder line scoped to OSHA's general industry rules (1910.101(a)); shipyard fact sheet lines
  credited as ship-repair guidance.
- **brazing:** cadmium/fluoride label line named as the general-industry welding rule; fume-position line confirmed
  in OSHA FS-3647 (welding guidance).
- **solar-falls:** skylight line moved from a general-industry cite to 1926.501(b)(4)(i).

## Could not verify
- 1910.269(n)(1)–(n)(6) text (grounding, test-before-touch rely on 1926.962 instead).
- osha.gov 1926.55 Appendix A (403); the 10 ppm construction H2S value was checked on eCFR.
- Whether Michigan FACE 12MI054 is NIOSH-funded (it is hosted on NIOSH's FACE site).
- QuickCard 3269 and FS-3920 came back only as summaries; the lines used match the exact quotes in them.
