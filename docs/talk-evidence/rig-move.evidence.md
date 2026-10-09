# rig-move evidence

Pages fetched 2026-10-08 (WebFetch):
- S = OSHA Oil and Gas eTool, Servicing > Transporting Rig and Rigging Up, https://www.osha.gov/etools/oil-and-gas/servicing/transport-rig-rigup
- T = OSHA Oil and Gas eTool, Transportation > Transporting Equipment, https://www.osha.gov/etools/oil-and-gas/transportation/transporting-equipment
- D = OSHA Oil and Gas eTool, Drilling > Rigging Up, https://osha.gov/etools/oil-and-gas/drilling/rigging-up
- E = OSHA 1910.333, https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.333

Correction to assignment: the eTool's "rig-up-rig-down" URL (https://www.osha.gov/etools/oil-and-gas/rig-up-rig-down) failed (fetch permission not granted). The rig-move content is on S (servicing) and T (transportation); D says rig-down "is basically the reverse of rigging up" with similar hazards. There is no dedicated OSHA rig-move standard; the only standard cited is 1910.333(c)(3)(iii) for clearance from overhead lines (general industry electrical work practices). Note: S cites 1910.303 Table S3, not 1910.333; I fetched 1910.333 myself. Existing library: `power-lines` (con) and `oil-struck-by` exist; this talk is rig-move specific.

| English sentence | Source | Supporting quote |
|---|---|---|
| A rig move puts big, heavy equipment on narrow roads, under power lines and close to people on foot. | T, S | exact T: "wide and/or heavy loads being transported over narrow roadways and bridges"; T: "Loads may strike overhead power lines"; T: "Pedestrian traffic in and around the offload area" |
| OSHA lists being struck by a moving rig, and getting caught between the rig and the wellhead, among the hazards. | S | exact: "Being struck by a moving rig." "Getting caught between the rig and the wellhead." |
| Check the route ahead of time. Make sure the rig can get through and the road surface is good enough. | S | exact: "Inspect the route in advance for adequate vehicle access and satisfactory surface conditions." |
| Find the height and width limits along the way, and get the permits needed for roads and bridges, including state permits. | T | exact: "determine height and width restrictions along route"; "Obtain required permits (including state permits) for roadways and bridges." |
| Make sure the lease road and the pad are ready before you drive on them. | T | exact: "Ensure that the access road and pad at the well site have been properly prepared before attempting to drive on them." |
| Look for power lines on the route and on location. Signs or markers can point them out to drivers. | S, T | exact S: "Identify all electrical hazards"; T: "Utilize posted signs or markers to highlight overhead power lines to drivers." |
| When any part of the rig is raised near an energized line, OSHA's rule calls for at least 10 feet of clearance. | E (c)(3)(iii)(A) | exact: "Any vehicle or mechanical equipment capable of having parts of its structure elevated near energized overhead lines" ... "operated so that a clearance of 10 ft. (305 cm) is maintained." (also T guidance: "Keep equipment at least 10 feet away from overhead power lines.") |
| Lines over 50,000 volts need more. | E (c)(3)(iii)(A) | paraphrase: above 50kV the clearance increases 4 inches for every 10kV over that voltage |
| Moving with the mast lowered, that clearance can drop to 4 feet, and again more for higher voltage. | E (c)(3)(iii)(A)(1) | exact: "If the vehicle is in transit with its structure lowered, the clearance may be reduced to 4 ft. (122 cm)." (50kV increase still applies) |
| If the rig is near a live line, people on the ground don't touch it. | E (c)(3)(iii)(B) | exact: "Employees standing on the ground may not contact the vehicle or mechanical equipment or any of its attachments, unless:" |
| The rule allows it only with protective gear rated for that voltage, or when the rig can't get closer to the line than the allowed clearance. | E (c)(3)(iii)(B)(1)-(2) | paraphrase: protective equipment rated for the voltage, or equipment located so no uninsulated part can come closer than (c)(3)(iii) permits |
| Use a ground guide when backing the rig. Keep everyone clear of a moving rig. | S | exact: "Use a ground guide while backing the rig." "Keep all personnel clear of the moving rig." |
| Follow your company's procedure for positioning the rig. | S | exact: "Establish and follow a specific procedure for positioning the rig." |
| Never get between the rig and the wellhead. | S | paraphrase of hazard: "Getting caught between the rig and the wellhead." with "Keep all personnel clear of the moving rig." REVIEWER: "never" is practical framing of these two lines, not a rule. |
| When equipment is loaded, a spotter stands a safe distance away to help line it up. | T | exact: "Use a spotter located a safe distance away to help properly align the equipment." |
| On the road, a flagger can tell drivers about conditions and when they can pass. | T | exact: "Use a flagger to communicate to drivers the current road conditions and opportunities for passage." |
| Rigging down is basically rigging up in reverse, and the hazards are similar. | D | exact: "The rigging down process is basically the reverse of rigging up." "The hazards and solutions are similar to those for rigging up." |
| When the mast is being raised or lowered, no one is on the unit except the operator at the controls. Everyone else stands clear. | S | exact: "Allow no personnel on the unit, other than the operator working at the controls, when raising or lowering the mast." "All others stand clear." |
| Before the mast goes up, uncoil and check all cables, inspect the anchors, and check the derrick for loose tools. | S, D | exact S: "Uncoil and visually inspect all cables before starting to raise the mast." "Inspect all anchors before rigging up the mast."; D: "Check the derrick for unsecured tools before raising it." |
| Stand to the side of lines and cables. | S | exact: "Stand to the side of lines and cables as the mast is being raised." |
| The operator checks wind speed and direction to decide if the mast can go up safely. | S | exact: "Ensure that the unit operator assesses the wind speed and direction to determine if the mast can be raised safely." |
| Ask: On this move, where are the power lines, and who is our ground guide? | n/a | discussion prompt |

Dropped / notes:
- T's "13'6" (in most states)" oversize height and escort vehicles: state-dependent, left out.
- T's NFPA 70E reference (adding 4 in per 10 kV): not used as a source; the same figure is cited from 1910.333.
- API anchor specification (S): industry standard, not used.
- 1910.333 applies to general industry; oil and gas well servicing/drilling are generally under 1910, but the talk says "OSHA's rule" without asserting scope beyond that.

## Fact-check 2026-10-08 (independent checker)
1910.333 could not be opened (osha.gov, eCFR, LII all refused). Removed 4-ft transit and ground-contact lines and the 1910.333 source; 10-ft clearance now cited to eTool Transporting Equipment guidance. Deleted unsourced 'Never get between the rig and the wellhead' (hazard itself stays in hook, confirmed on eTool).
