import { describe, expect, it } from "vitest";
import { buildAttendees, recordPayload, unsignedPresent, type RosterEntry } from "./record";
import { countStatuses } from "./attendance";

const roster: RosterEntry[] = [
  { key: "p1", personId: "p1", name: "Lead", role: "Team lead", teamName: "Crew 1" },
  { key: "p2", personId: "p2", name: "Signed worker", role: "Crew member", teamName: "Crew 1" },
  { key: "p3", personId: "p3", name: "Didn't sign", role: "Crew member", teamName: "Crew 1" },
  { key: "p4", personId: "p4", name: "Not here", role: "Crew member", teamName: "Crew 1" },
  { key: "walkin:0", personId: null, name: "Visiting sub", role: "Not on roster", teamName: "" },
];
const present = { p1: true, p2: true, p3: true, p4: false, "walkin:0": true };
const sig = (t: string) => ({ image: "data:image/png;base64,AA", signedAt: t });
const sigs = { p1: sig("2026-10-05T12:00:00Z"), p2: sig("2026-10-05T12:01:00Z"), p4: sig("2026-10-05T12:02:00Z"), "walkin:0": sig("2026-10-05T12:03:00Z") };

describe("building a saved talk", () => {
  const rows = buildAttendees(roster, present, sigs);

  it("gives everyone on the roster exactly one honest status", () => {
    expect(rows.map((r) => r.status)).toEqual(["signed", "signed", "not_signed", "absent", "signed"]);
    expect(countStatuses(rows)).toMatchObject({ signed: 3, not_signed: 1, absent: 1, flagged: 2, total: 5 });
  });

  it("drops a signature from someone marked absent instead of counting it", () => {
    const p4 = rows.find((r) => r.name === "Not here")!;
    expect(p4.status).toBe("absent");
    expect(p4.signature).toBeNull();
  });

  it("keeps the signature and time only for people who signed", () => {
    for (const r of rows) expect(r.signature !== null).toBe(r.status === "signed");
    expect(rows[0].signed_at).toBe("2026-10-05T12:00:00Z");
  });

  it("keeps walk-ins with no person id", () => {
    expect(rows[4]).toMatchObject({ person_id: null, name: "Visiting sub", status: "signed" });
  });

  it("lists who is here but hasn't signed", () => {
    expect(unsignedPresent(roster, present, sigs)).toEqual(["Didn't sign"]);
  });

  it("builds the save payload with snapshots", () => {
    const p = recordPayload({
      companyId: "c1", clientId: "x1", talkId: "fall", language: "es",
      content: { title: "T", hook: "H", sections: [], ask: "A" },
      week: { number: 6, start: "2026-11-02", scheduledTalkId: "ppe" },
      jobsite: { id: "j1", name: "Smith reroof" },
      team: { id: "t1", name: "Crew 1", leadName: "Lead" },
      presenter: { personId: null, name: "Sam", role: "Superintendent", signature: null },
      heldAt: "2026-11-03T12:00:00Z",
      gps: null,
    });
    expect(p).toMatchObject({ week_number: 6, scheduled_talk_id: "ppe", jobsite_name: "Smith reroof", presenter_signature: null, latitude: null });
  });
});
