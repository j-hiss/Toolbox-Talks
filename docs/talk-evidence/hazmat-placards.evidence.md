# hazmat-placards evidence

Pages fetched 2026-10-08 (WebFetch):
- H = OSHA Trucking Industry, Transporting Hazardous Materials, https://www.osha.gov/trucking-industry/transporting-hazardous-materials
- O1 = OSHA 1910.1201, https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1201 (tool would only paraphrase; exact phrases confirmed on Cornell LII copy https://www.law.cornell.edu/cfr/text/29/1910.1201)
- O2 = OSHA 1910.120, https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.120 (read with offset 100000 for (q))
- P504 = eCFR 49 CFR 172.504, https://www.ecfr.gov/current/title-49/subtitle-B/chapter-I/subchapter-C/part-172/subpart-F/section-172.504 (fetched)
- P602 = 49 CFR 172.602 text via mirror https://syfert.com/cfr/sections/49-172.602.html (the eCFR part-172 URL given in the assignment failed twice: fetch permission not answered). REVIEWER: confirm 172.602 against eCFR.
- P817 = 49 CFR 177.817 via Cornell LII https://www.law.cornell.edu/cfr/text/49/177.817 (eCFR part-177 URL not fetched; cited in sources as the canonical eCFR location). REVIEWER: confirm.

DOT sources are kind "guidance" per the assignment (test only allows DOT parts 392-393 as "standard"). The talk names DOT plainly. 1910.1200 was not used: the existing `hazcom` talk covers labels and SDS, and H does not mention 1910.1200.

| English sentence | Source | Supporting quote |
|---|---|---|
| On a hazmat load, the placards and papers tell everyone what's inside, including the responders who show up if something goes wrong. | P817(e); P602 | paraphrase: shipping paper "readily available to, and recognizable by, authorities in the event of accident or inspection"; ER info "immediately accessible" for use during incidents |
| Most of these rules come from DOT, the U.S. Department of Transportation. A few come from OSHA. | H | exact: "DOT regulates the shipment of hazardous materials" (49 CFR 172, 173, 177, 397); OSHA: HAZWOPER (1910.120) |
| Under DOT rules, a truck, trailer, tank or container that needs placards gets them on each side and each end. | P504(a) | exact: "each bulk packaging, freight container, unit load device, transport vehicle or rail car" ... "must be placarded on each side and each end" ("that needs placards" covers the table/quantity exceptions) |
| When your company receives a placarded trailer or container, OSHA says the placards stay on until the hazardous material has been removed enough that no hazard is left. | O1 (b) | exact (LII): employer receiving a freight container, rail freight car, motor vehicle or transport vehicle shall retain markings and placards until the hazardous materials are "sufficiently removed to prevent any potential hazards." Employer duty phrased as "your company receives". |
| Packages keep their DOT labels until they've been cleaned of residue and purged of vapors. | O1 (a) | exact (LII): retain markings, labels and placards "until the packaging is sufficiently cleaned of residue and purged of vapors to remove any potential hazards." |
| An empty drum can still be a hazard, so leave its labels alone. | O1 (a) | paraphrase/practical: the retention rule exists because residue and vapors remain in emptied packaging |
| DOT says you don't haul a hazmat load without a shipping paper, unless that material is excepted from the paper rule. | P817(a) | exact: "A person may not accept a hazardous material for transportation or transport a hazardous material by highway" "unless that person has received a shipping paper prepared in accordance with part 172" "or the material is excepted from shipping paper requirements" |
| At the wheel, keep it within reach while you're belted in, and either easy to see for someone entering the cab or in the holder on the inside of the driver's door. | P817(e)(1)(i) | exact: "Within his immediate reach while he is restrained by the lap belt; and" "either readily visible to a person entering the driver's compartment" "or in a holder which is mounted to the inside of the door on the driver's side" |
| When you leave the cab, put it in the driver's door holder or on the driver's seat. | P817(e)(1)(ii) | exact: "In a holder which is mounted to the inside of the door on the driver's side of the vehicle; or" "on the driver's seat in the vehicle." |
| That way authorities can find it after a crash or at an inspection. | P817(e) | exact: "readily available to, and recognizable by, authorities in the event of accident or inspection." |
| DOT also requires emergency response information for the load, kept right where the driver can get to it. | P602(c) | exact: "must be immediately accessible to train crew personnel, drivers of motor vehicles," |
| It covers the health hazards, the fire or explosion risk, first precautions, how to handle a fire, how to handle a spill or leak with no fire, and first aid. | P602(a) | exact: "Immediate hazards to health," "Risks of fire or explosion," "Immediate precautions to be taken in the event of an accident or incident," "Immediate methods for handling fires," "Initial methods for handling spills or leaks in the absence of fire," "Preliminary first aid measures." |
| Know where it is. | n/a | practical framing of P602(c) |
| OSHA's emergency response rule doesn't cover a driver just for driving. | H | exact: "OSHA's HAZWOPER standard does not cover the operator per se." |
| But if you get actively involved in handling the emergency, you're an emergency responder under that rule, | H | paraphrase: if a driver becomes actively involved in an emergency response, "then he/she is considered an emergency responder" covered by 1910.120(q) |
| and responders need training before they respond. | O2 (q)(6) | paraphrase: employees who participate or are expected to participate in emergency response shall be given training; new responders trained before taking part in actual emergency operations |
| At the basic awareness level, the job is to spot the problem, identify the material if you can, notify the proper people, and take no further action. | O2 (q)(6)(i), (q)(6)(i)(C)-(D) | exact: individuals "likely to witness or discover a hazardous substance release" who initiate the response by notifying the proper authorities and take no further action; "The ability to recognize the presence of hazardous substances in an emergency." "The ability to identify the hazardous substances, if possible." |
| Spills of oil and hazardous chemicals are reported to the federal National Response Center at 800-424-8802. | H | exact: National Response Center "Serves as the sole federal point of contact for reporting oil and hazardous chemical spills." Number: (800) 424-8802 |
| Know who at your company makes that call. | n/a | practical framing; no claim about who must report (reporting criteria are EPA 40 CFR 110/116, per H) |
| Ask: On the load you're hauling today, where are the shipping papers and the emergency response information? | n/a | discussion prompt |

Dropped / notes:
- Table 2 placard 1,001-lb exception (172.504(c)): not detailed; "needs placards" keeps it general.
- Hazmat training (172.704) and "move upwind / stay back" style spill advice: not fetched (eCFR part 172 failed; no ERG fetched). Left out.
- 1910.1200: not used (see above).

## Fact-check 2026-10-08 (independent checker)
172.504(a) confirmed on eCFR; 177.817(a),(e) on Cornell LII; 172.602(a),(c) confirmed only on a CFR mirror (syfert.com), eCFR/LII refused. 1910.1201(a)-(b) and 1910.120(q)(6),(q)(6)(i) confirmed on osha.gov. Reworded empty-drum line and NRC line to match sources.
