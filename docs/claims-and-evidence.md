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
- Heat reminder vs OSHA's heat page (osha.gov returned an error).
- Wind levels for the card's border (25 / 35 mph) are ours, not OSHA's.
- Spanish talks and signing statement: draft until a native speaker reviews.
- Attorney and safety-professional review before sales use.
