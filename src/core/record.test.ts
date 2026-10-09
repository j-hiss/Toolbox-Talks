import { describe, expect, it } from "vitest";
import { buildAttendees, enoughInk, recordPayload, toUpload, unsignedPresent, type RosterEntry } from "./record";
import { countStatuses } from "./attendance";

const roster: RosterEntry[] = [
  { key: "p1", personId: "p1", name: "Lead", role: "Team lead", teamName: "Crew 1" },
  { key: "p2", personId: "p2", name: "Signed worker", role: "Crew member", teamName: "Crew 1" },
  { key: "p3", personId: "p3", name: "Didn't sign", role: "Crew member", teamName: "Crew 1" },
  { key: "p4", personId: "p4", name: "Not here", role: "Crew member", teamName: "Crew 1" },
  { key: "walkin:0", personId: null, name: "Visiting sub", role: "Not on roster", teamName: "", company: " Example Electric " },
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
    expect(rows[4]).toMatchObject({ person_id: null, name: "Visiting sub", status: "signed", company_name: "Example Electric" });
    expect(rows[0].company_name).toBe("");
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

describe("signatures and the crew photo become private files", () => {
  const rows = buildAttendees(roster, present, sigs);
  const base = recordPayload({
    companyId: "co-1", clientId: "cl-1", talkId: "fall", language: "en", content: { title: "Fall", hook: "", sections: [], ask: "" },
    week: null, jobsite: null, team: null, heldAt: "2026-10-05T12:10:00Z", gps: null,
    presenter: { personId: "p1", name: "Lead", role: "Team lead", signature: sig("2026-10-05T12:05:00Z") },
    photo: { image: "data:image/jpeg;base64,BB", takenAt: "2026-10-05T12:09:00Z" },
  });
  const up = toUpload(base, rows);

  it("uploads every signature and the photo into this talk's own folder", () => {
    expect(up.files.map((f) => f.path)).toEqual([
      "co-1/cl-1/presenter.png", "co-1/cl-1/photo.jpg", "co-1/cl-1/sig-0.png", "co-1/cl-1/sig-1.png", "co-1/cl-1/sig-4.png",
    ]);
    expect(up.files.find((f) => f.path.endsWith("photo.jpg"))?.contentType).toBe("image/jpeg");
  });

  it("sends no images in the record, only paths", () => {
    const json = JSON.stringify({ record: up.record, attendees: up.attendees });
    expect(json).not.toContain("data:image");
    expect(up.record).toMatchObject({ presenter_signature_path: "co-1/cl-1/presenter.png", photo_path: "co-1/cl-1/photo.jpg", photo_taken_at: "2026-10-05T12:09:00Z" });
    expect(up.attendees.map((a) => a.signature_path)).toEqual(["co-1/cl-1/sig-0.png", "co-1/cl-1/sig-1.png", null, null, "co-1/cl-1/sig-4.png"]);
  });

  it("gives the same paths every time, so a retried upload never makes a second copy", () => {
    expect(toUpload(base, rows).files.map((f) => f.path)).toEqual(up.files.map((f) => f.path));
  });

  it("a paper sheet photo uploads to the same folder and changes no one's status", () => {
    const withSheet = toUpload({ ...base, sheet: "data:image/jpeg;base64,BB", sheet_taken_at: "2026-10-05T12:10:00Z" }, rows);
    expect(withSheet.files.map((f) => f.path)).toContain("co-1/cl-1/sheet.jpg");
    expect(withSheet.record).toMatchObject({ sheet_path: "co-1/cl-1/sheet.jpg", sheet_taken_at: "2026-10-05T12:10:00Z" });
    expect(withSheet.attendees.map((a) => a.status)).toEqual(up.attendees.map((a) => a.status));
  });

  it("no photo and no presenter signature means no files and null paths", () => {
    const bare = toUpload({ ...base, photo: null, photo_taken_at: null, presenter_signature: null }, []);
    expect(bare.files).toEqual([]);
    expect(bare.record).toMatchObject({ photo_path: null, photo_taken_at: null, presenter_signature_path: null });
  });
});

describe("the signing statement", () => {
  const roster: RosterEntry[] = [
    { key: "a", personId: "a", name: "Ana", role: "", teamName: "" },
    { key: "b", personId: "b", name: "Ben", role: "", teamName: "" },
  ];
  const sig = (confirmedAt?: string) => ({ image: "data:image/png;base64,AA", signedAt: "2030-01-01T12:01:00Z", confirmedAt });

  it("keeps when each signer tapped it, and nothing for people who didn't sign", () => {
    const rows = buildAttendees(roster, { a: true, b: false }, { a: sig("2030-01-01T12:00:30Z"), b: sig("2030-01-01T12:00:40Z") });
    expect(rows[0]).toMatchObject({ status: "signed", confirmed_at: "2030-01-01T12:00:30Z" });
    expect(rows[1]).toMatchObject({ status: "absent", confirmed_at: null });
  });

  it("a signature from before the statement existed saves with no tap time", () => {
    expect(buildAttendees(roster.slice(0, 1), { a: true }, { a: sig() })[0].confirmed_at).toBeNull();
  });

  it("the exact statement travels with the record and survives the upload split", () => {
    const statement = { text: "Al firmar, confirmo que asistí a esta charla.", en: "By signing, I confirm I attended this talk.", language: "es", version: 1 };
    const record = recordPayload({
      companyId: "co", clientId: "cl", talkId: "heat", language: "es", content: { title: "t", hook: "", sections: [], ask: "" }, week: null,
      jobsite: null, team: null, presenter: { personId: null, name: "P", role: "", signature: null }, heldAt: "2030-01-01T12:00:00Z", gps: null,
      signingStatement: statement,
    });
    const up = toUpload(record, buildAttendees(roster.slice(0, 1), { a: true }, { a: sig("2030-01-01T12:00:30Z") }));
    expect(up.record.signing_statement).toEqual(statement);
    expect(up.attendees[0].confirmed_at).toBe("2030-01-01T12:00:30Z");
  });
});

describe("signature ink", () => {
  it("doesn't take a dot or a tap as a signature", () => {
    expect(enoughInk(0)).toBe(false);
    expect(enoughInk(12)).toBe(false);
    expect(enoughInk(140)).toBe(true);
  });
});
