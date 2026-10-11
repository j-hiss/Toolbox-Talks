# Claims and evidence

What the app may say about OSHA, signatures and insurance, and the sources each claim rests on. The shareable,
fuller version is the doc "Toolbox Talks: What It Does and Doesn't Do"
(https://claude.ai/code/artifact/86de7656-839d-4501-820d-7216d512b502). Sources read 2026-10-07. Not yet reviewed
by an attorney or a certified safety professional.

## Never say
- "OSHA compliant", "OSHA approved", "OSHA certified", "insurance approved", "lowers your premiums",
  "satisfies your training requirements". The PDF footer stays: "Documents a safety meeting. Does not by itself
  certify OSHA compliance." (test: src/content/weather-notes.test.ts blocks compliance wording in crew notes)

## OK to say, and why
| Claim | Source |
| --- | --- |
| Runs and documents weekly safety talks | What the app does |
| Supports training documentation OSHA asks for | 29 CFR 1926.21(b)(2) (instruct each employee in recognizing and avoiding unsafe conditions); 1926.503(b)(1) (written certification: employee name, date, trainer's or employer's signature) |
| Employee signatures are extra, not required by OSHA | OSHA letter 1997-08-14: "there is no standard that requires the employer to obtain the employee's signature"; electronic training records accepted with safeguards |
| E-signature pads acceptable for training certification | OSHA letter 2000-04-10 (asked under 1960): "no objection to the use of an electronic signature pad" when each signature is stored |
| Electronic signatures have legal effect | 15 U.S.C. 7001(a), (d); Fla. Stat. 668.50(2)(h) intent to sign, (7)(a) legal effect, (9)(a) attribution |
| Can support safety-program rate consideration in Florida | Fla. Stat. 627.0915(1) ("specific identifiable consideration in the setting of rates"); 440.1025(1) lists safety training and recordkeeping. No amount in statute |
| Self-insurer credits (not insured premiums) | Fla. Admin. Code 69L-5.221 (safety, up to 2%), 69L-5.220 (drug-free, up to 5%) |

## Federal and state rules (checked 2026-10-07)
- E-SIGN exceptions (15 U.S.C. 7003): wills, family law, most UCC, court papers, certain consumer notices,
  hazmat shipping papers. Training/safety-meeting records are not excluded. Caution: E-SIGN/UETA cover records of
  a "transaction"; an attendance sign-in is untested, so OSHA's letters are the more direct support.
- UETA in 49 states + DC + USVI; New York uses ESRA ("same force and effect").
- OSHA training-record content: 1926.503(b)(1); 1910.178(l)(6) (adds evaluation date, evaluator); 1910.147(c)(7)(iv);
  1910.1030(h)(2) (adds trainer qualifications, attendee job titles; keep 3 years); 1926.1060 none. No standard asks
  for the trainee's signature.
- State plans with private-sector coverage: AK AZ CA HI IN IA KY MD MI MN NV NM NC OR PR SC TN UT VT VA WA WY.
  - WA WAC 296-155-110: meetings at job start + weekly; attendance, subjects, minutes at the site; must review
    walk-around inspections, citations, accident investigations; keep 1 year. GAP: the three reviews and on-site
    minutes are not prompted.
  - OR OAR 437-001-0765: construction monthly + before jobs over a week; hazards, date, attendees; available to all
    employees; keep 3 years. GAP: crew members can't view records.
  - CA 8 CCR 1509: tailgate meetings every 10 working days; 3203(b)(2) training record (name, dates, type,
    provider), keep 1 year.
  - Checked 2026-10-11 (state code text on official sites, Cornell LII or Justia):
    - WA general industry WAC 296-800-13025: safety meetings "Held monthly" where meetings replace a committee (10 or
      fewer employees, or 10 or fewer per shift or location); committees (11+ on a shift) set their own schedule
      (296-800-13020).
    - OR OAR 437-001-0765 (all employers): meetings monthly, quarterly for mostly office work; construction monthly
      and before each job lasting more than a week. Committees monthly, or quarterly for office work.
    - CA 8 CCR 3203: no meeting frequency; a committee, if chosen, "not less than quarterly".
    - NC G.S. 95-252: committee meetings at least every three months, only for 11+ employees with an EMR of 1.5 or
      more. TN rule 0800-02-03: committee meetings at least every 60 days when the Commissioner finds an EMR of 1.20
      or more (PDF currency not confirmed). Committee rules, not crew meetings.
    - MN Stat. 182.676 and NV NRS 618.383 / NAC 618.540: committees required (25+ employees) with no set interval.
    - No meeting or committee frequency found: AK, AZ, HI, KY, MI, NM, PR, SC, UT, WY. Only partly checked (rule
      lists or adoption rules, not every section): IN, IA, MD, VT, VA.
    - The app's cadences (1, 2 or 4 weeks) can fall short only of WA construction (weekly) and CA construction
      (every 10 working days); src/core/staterules.ts warns for those. OR construction's "before each job lasting
      more than a week" can't be captured by a fixed cadence.
- Inspections and training notes added 2026-10-11 (eCFR unless noted):
  - EPA hazardous waste: 262.16(b)(2)(iv) and 262.17(a)(1)(v) weekly central accumulation area inspection, "look for
    leaking containers and for deterioration of containers caused by corrosion or other factors"; closed containers
    (b)(2)(iii)(A) / (a)(1)(iv)(A); compatible (b)(2)(ii) / (a)(1)(iii); marking "Hazardous Waste", hazards, start
    date (b)(6)(i) / (a)(5)(i); 180 days SQG, 90 days LQG; No Smoking signs 262.17(a)(1)(vi)(B). VSQGs exempt
    (262.14(a)).
  - EPA 2022 Construction General Permit (as modified April 2025, epa.gov PDF): 4.2 every 7 days, or every 14 days and
    within 24 hours of 0.25 inches of rain; 4.5 areas; 4.6.1 checks; 4.6.4 repairs; 4.7.1 report within 24 hours with
    the rain reading. EPA's permit covers MA, NH, NM, DC, PR, territories, Indian country and some federal sites;
    other states issue their own permit. Not read: 4.7.2-4.7.4 (report retention), 4.4.3 criteria.
  - 49 CFR 172.704(c)(1)-(2), (d) (Cornell copy): within 90 days, every 3 years, record of 3 years kept while employed
    plus 90 days. 40 CFR 745.90(b)(2), 745.86(a), (b)(6)(i): renovator trains workers, topics per worker, 3 years.
    49 CFR 382.603 (Cornell copy): 60 + 60 minutes, "Recurrent training for supervisory personnel is not required."
  - No federal OSHA rule found requiring periodic fire drills or emergency-light testing (1910.37, .38, .39, .157).
    1910.165(d)(2): non-supervised employee alarm systems tested every two months. CMS: hospitals and nursing homes
    exercise the emergency plan at least twice a year (42 CFR 482.15(d)(2); 483.73(d)(2), Cornell copy).

## How the app backs the signature claims
- Intent to sign: crew tap the signing statement before the pad takes ink (src/content/ui.ts `signingStatement`);
  the record keeps the statement + version (talk_records.signing_statement) and each tap time
  (talk_attendees.confirmed_at); the PDF prints both (src/lib/pdf.ts).
- Attribution: signature image + time, jobsite/GPS, presenter, optional crew photo.
- Retention: private storage files tied to an append-only record.

## Weather notes
Each crew note cites its OSHA source in src/content/weather-notes.ts (lightning fact sheet FS-3863; 1926.451(f)(12),
(f)(8); 1926.1417(n); 1926.250(a)(1); 1926.404(b)(1)(ii); 1910.176(b); 1910.22(a)(2); 1910.178(n)(8)). Dropped:
"lifts stay within the manufacturer's wind limits" (1926.453 says nothing about wind).

## Open
- Heat reminder: checked 2026-10-08 against OSHA water-rest-shade, protecting-new-workers and illness-first-aid, and NIOSH heat-stress recommendations (water amount); wording fixed (heat talk, reminder v3). OSHA's main heat page still blocks automated checks.
- Wind levels for the card's border (25 / 35 mph) are ours, not OSHA's.
- Spanish talks and signing statement: draft until a native speaker reviews.
- Attorney and safety-professional review before sales use.
