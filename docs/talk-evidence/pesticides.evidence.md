# Evidence: pesticides

Fetched 2026-10-07:
- eCFR 40 CFR 170.401, 170.407, 170.409 (section pages under https://www.ecfr.gov/current/title-40/chapter-I/subchapter-E/part-170/subpart-D/...).
- 40 CFR 170.411 and 170.507: eCFR returned HTTP 429 (rate limited) on repeated tries, so the text was read from the Cornell LII CFR mirror (https://www.law.cornell.edu/cfr/text/40/170.411, .../170.507). Sources list the eCFR part URL per the brief. Reviewer: re-check these two sections on eCFR.
- The eCFR whole-part page (part-170) returned what appears to be the pre-2015 rule text (170.110, 170.130, 170.150, 170.210...) and was truncated; NOT used.
- OSHA 1910.1200(b)(5)(i): https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200
- EPA WPS overview: the live pages https://www.epa.gov/pesticide-worker-safety and .../agricultural-worker-protection-standard-wps were refused by the fetch tool (provenance error). Used the EPA archived snapshot (Jan 19, 2025; page says it is no longer updated): https://19january2025snapshot.epa.gov/pesticide-worker-safety/agricultural-worker-protection-standard-wps

## Hook
- "The main rule that protects you from pesticides on the farm doesn't come from OSHA. It comes from EPA, and it's called the Worker Protection Standard."
  - guidance: EPA WPS page: the Agricultural Worker Protection Standard is an EPA rule that "aims to reduce pesticide poisonings and injuries among agricultural workers and pesticide handlers." Rule is 40 CFR part 170 (EPA, Title 40). "Main rule" is framing.

## An EPA rule
- "The Worker Protection Standard is an EPA rule. Its goal is to cut pesticide poisonings and injuries among farmworkers and pesticide handlers."
  - guidance: EPA WPS page (exact): "aims to reduce pesticide poisonings and injuries among agricultural workers and pesticide handlers."
- "It covers workers on farms, forests, nurseries, and greenhouses, and the handlers who mix, load, or apply pesticides."
  - guidance: EPA WPS page (exact): "The WPS protects two types of employees on farms, forests, nurseries and greenhouses." Handlers are those who "mix, load, or apply agricultural pesticides;" (also clean/repair application equipment or assist with applications).
- "OSHA's chemical labeling rule doesn't cover pesticide labels. EPA controls those labels, and the label sets things like how long to stay out and what gear handlers wear."
  - 1910.1200(b)(5)(i) (exact): "This section does not require labeling of the following chemicals: (i) Any pesticide as such term is defined in the Federal Insecticide, Fungicide, and Rodenticide Act (7 U.S.C. 136 et seq.), when subject to the labeling requirements of that Act and labeling regulations issued under that Act by the Environmental Protection Agency;"
  - 40 CFR 170.407(a) (exact): "the restricted-entry interval specified on the pesticide product labeling". 170.507(b) (exact): "the personal protective equipment required by the pesticide product labeling".
  - CORRECTION to the brief: 1910.1200(b)(5) is a LABELING exemption only ("does not require labeling of"). It does not exclude FIFRA pesticides from HazCom as a whole. The talk says only that OSHA's labeling rule doesn't cover pesticide labels.

## Training
- "If pesticides were used, or an entry restriction was in effect, on the farm in the last 30 days, you need pesticide safety training before you work in a treated area."
  - 170.401(a) (exact): "Before any worker performs any task in a treated area on an agricultural establishment where within the last 30 days a pesticide product has been used or a restricted-entry interval for such pesticide has been in effect, the agricultural employer must ensure that each worker has been trained in accordance with this section within the last 12 months, except as provided in paragraph (b) of this section."
  - Reviewer note: (b) exempts some people (e.g. certified applicators, those with handler training under 170.501, certain crop advisors). Not mentioned in the talk.
- "That training has to be within the last 12 months, so it comes around every year."
  - 170.401(a) (exact): "within the last 12 months". EPA WPS page (exact): "Provide annual pesticide safety training."
- "It covers warning signs, how pesticides get into your body, signs of poisoning, first aid and washing off, and your right to report problems without getting punished."
  - 170.401(c)(3) (paraphrase of the topic list as returned): warning signs and restricted-entry intervals; how exposure happens and routes into the body; signs of poisoning; first aid, decontamination and emergency medical care; reporting violations and protection against retaliation.
  - Reviewer note: (c)(3) is the expanded 23-topic list; the fetch summarized it rather than quoting each item.

## Stay out when you're told
- "After an application, there's a restricted-entry interval, or REI. The label sets how long it is. Don't go into the treated area until it's over, except for special early-entry work the rule allows."
  - 170.407(a) (exact fragment): workers may not enter until "the restricted-entry interval specified on the pesticide product labeling has expired"; exception for early-entry activities under "§ 170.603" (paraphrase). The rule also requires signs to be removed or covered before entry.
- "Your company has to warn you with posted signs, a spoken warning, or both, depending on the label and how long the REI is. A spoken warning tells you where, when, and to stay out."
  - 170.409(a) (paraphrase with exact fragments): both required when labeling requires "both the posting of treated areas and oral notification to workers"; outdoor REI over 48 hours: "must notify workers of the application by posting warning signs"; outdoor REI 48 hours or less (and enclosed space REI 4 hours or less): "either by posting warning signs" or "by providing workers with an oral warning"; enclosed space REI over 4 hours: signs.
  - 170.409(c) (exact): "must provide oral warnings to workers in a manner that the workers can understand." Content: location and description of the treated area, dates and times entry is restricted, and instructions not to enter (paraphrase).
- "The sign is white with DANGER and PELIGRO at the top, KEEP OUT and NO ENTRE at the bottom, and a red circle with a raised hand. It goes up no more than 24 hours before the application and stays up through the REI."
  - 170.409(b)(2)(i) (exact): "The warning sign must have a white background." "DANGER" and "PELIGRO," plus "PESTICIDES" and "PESTICIDAS" at the top; "KEEP OUT" and "NO ENTRE" at the bottom; red circle with an upraised hand and a stern face (paraphrase).
  - 170.409(b)(1) (exact): "Be posted prior to but no earlier than 24 hours before the scheduled application of the pesticide." / "Remain posted throughout the application and any restricted-entry interval."
- "During an application, nobody is allowed in the exclusion zone around the equipment. Handlers have to pause if anyone is in it."
  - guidance: EPA WPS page (exact): AEZ is "an area surrounding outdoor pesticide application equipment where people are prohibited" during application. Paraphrase: handlers must pause an application when workers or other people are inside the AEZ; employers may not direct or allow workers to enter an AEZ on the establishment. Regulatory text is 40 CFR 170.405 / 170.505; those sections were not fetched (eCFR rate limit).
  - Reviewer note: "outdoor" applies; the talk says "around the equipment" without the 25/100-foot radius.

## Washing up and gear
- "If you touch anything that was treated, your company has to give you water, soap, and single-use towels, usually no more than a quarter mile from where you work."
  - 170.411(a) (paraphrase, LII mirror): supplies for "routine washing and emergency decontamination" to any worker who contacts anything treated (soil, water, plants). 170.411(b): water, soap, single-use towels. 170.411(d): supplies together, outside treated/restricted areas, "reasonably accessible to the workers," and generally not more than 1/4 mile from where workers are working, with an exception for remote sites ("usually" covers the exception).
- "That's at least one gallon of water per worker at the start of each work period. Hand sanitizer and wet wipes don't count as soap."
  - 170.411(b) (paraphrase, LII mirror): at least one gallon of water per worker at the start of each work period; soap, and hand sanitizers and wet towelettes are not acceptable substitutes.
- "Handlers wear the gear the label lists. Your company has to provide it, clean and working, and make sure it's used right."
  - 170.507(a) (exact, LII mirror): handler "must use the clothing and personal protective equipment specified on the pesticide product labeling." (b): employer "must provide to the handler the personal protective equipment required by the pesticide product labeling" and "must ensure that the personal protective equipment is clean and in proper operating condition." (c)(1): "must ensure that personal protective equipment is used correctly for its intended purpose."
  - guidance: EPA WPS page (exact): "Provide required PPE in clean and good operating condition."
- "If someone may have been poisoned or hurt by a pesticide, your company has to make transportation to medical care available."
  - guidance: EPA WPS page (exact fragment): "Provide emergency assistance by making transportation available to a medical care facility" in case of a pesticide injury or poisoning (paraphrase of the rest). Regulatory text is 40 CFR 170.309(f); not fetched.

## Ask
- "If you saw a DANGER / PELIGRO sign on a field edge today, what would you do, and who would you tell?" — crew question tied to 170.409 signs.

## Dropped / not sourced
- Eyeflush requirements (170.411(e)/(f) region): not confirmed in the fetch; left out.
- Handler minimum age (18) and early-entry age limits: not fetched as rule text; left out.
- "Training in a manner workers can understand": confirmed only for oral warnings (170.409(c)); not stated for training in what was fetched, so not claimed.
