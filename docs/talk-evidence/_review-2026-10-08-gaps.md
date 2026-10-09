# Independent check: 46 gap-filling talks (2026-10-08)

These talks fill the gaps found in the competitor and coverage review (landscaping, oil and gas, trucking,
agriculture, healthcare, facilities). Each was drafted from fetched OSHA/NIOSH/EPA/DOT/DOL text (evidence file per
talk), then re-checked by a separate reviewer who opened the cited pages again. The talk text in
`src/content/talks.ts` is the checked version; each evidence file shows the first draft, with a checker note at the
end where the JSON changed. Spanish is `draft` in every talk.

## Decisions applied across the batch
- **No standard, said out loud.** Where OSHA has no rule, the talk says so and every line reads as guidance:
  sun and UV, bites and plants, ergonomics (repetitive-work, loading-ergonomics: "Congress canceled OSHA's ergonomics
  rule"; General Duty Clause), job safety analysis, rig moves, pipe handling, lease roads, workplace violence in
  healthcare, home healthcare, surgical smoke, mold, waste anesthetic gases, farm emergencies, animal illness.
- **Agriculture scope.** 29 CFR 1928.21(b): most of Part 1910 doesn't apply to farm work. organic-dust gives
  respirator fit testing as advice, not a rule; farm-emergency rests on OSHA fact sheet FS-3870; youth-farm names the
  DOL Wage and Hour Division (FLSA, Fact Sheet #40), not OSHA.
- **Other agencies named plainly:** DOT (hazmat-placards, trailers-ramps 393.100(b)), EPA (landscape-chemicals label
  rules), CDC (ppe-donning order, pool-chemicals), DOL WHD (youth-farm), NRC and Agreement States (radiation).
- **State and NIOSH-funded sources** are named as such: Washington State FACE and tip sheet (trailer-doors), Minnesota
  FACE (grain-elevators), Nebraska FACE and the Southwest Center for Agricultural Health, "a NIOSH-funded farm safety
  center" (vet-needles).
- **Statistics:** only OSHA or NIOSH figures with the source listed (NIOSH 8-12% latex sensitization; NIOSH kneeling
  and stooping energy figures). "Three of every five" was dropped from pipe-handling because the page wouldn't load.

## Notable fixes by checkers
- **sun-uv:** SPF 15 -> SPF 30 (NIOSH page updated).
- **ethylene-oxide, rope-descent, exposure-followup:** limits and training worded as the company's duty.
- **ppe-donning:** OSHA's "take PPE off before leaving the work area" kept separate from CDC's respirator exception.
- **roof-edges-gi:** "4 feet under OSHA's general industry rule, not the 6 feet used in construction".
- **labor-camps:** scoped to temporary labor camps (1910.142).
- **grain-dust:** 1910.272 wouldn't load for the checker, so the talk was cut back to what osha.gov/grain-handling
  states (1/8 inch, 35-ft priority areas, housekeeping plan, ignition sources). Deleted lines can return after a check
  against the standard.
- **rig-move, aerial-lifts-gi, tree-climbing:** 1910.333 wouldn't load; insulated-lift, ground-contact and in-transit
  lines were deleted; the 10-ft line is sourced to OSHA guidance (eTool, HB-3731).
- **lease-roads:** NIOSH 2018-126 lines reworded to the PDF ("Coffee can't make up for lost sleep"; 15-30 minute nap).
- **landscape-chemicals:** the Worker Protection Standard scope line (40 CFR 170.303) was deleted; it can return once
  the eCFR page is checked.
- **trailers-ramps:** riding-mower and 393.104 lines deleted (pages wouldn't load); 393.100(b) verified.

## Checked on a CFR mirror only (worth a second look)
- tank-truck-loading: 1910.106(b)(6), (f)(3)(iii), (f)(3)(iv)(a)-(d), matched on a CFR mirror by both writer and
  checker; osha.gov, eCFR and Cornell refused the fetch.
- hazmat-placards: 49 CFR 172.602(a), (c)(1), same situation.

## Held, not in the library
- **flammable-transfer:** 1910.106 couldn't be opened by the checker; every rule line is unverified.
- **customer-yards:** OSHA 3944 couldn't be opened; most lines rest on it.
- Never drafted for lack of fetchable sources: stump-grinders, outdoor-electrical, high-pressure, lpg,
  material-storage-gi, highway-driving, route-delivery, legionella.

## Retagged existing talks (1910-based only)
hazcom +truck; loto +oil,truck; guard +oil; fork +oil; electrical-gi +oil,truck; eyewash +oil,health,truck;
ladders-gi +land,truck; grinders +truck; aisles-exits +truck; confined-space +truck; respirators +truck and **-ag**
(1910.134 doesn't apply to farm work, 1928.21); welding +facil. Construction-only (1926) talks were not retagged
into general-industry trades.

Library after this batch: 177 talks; each industry gets 31-61 including shared and Every-job talks.
