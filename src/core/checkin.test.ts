import { describe, expect, it } from "vitest";
import { checkinLink, checkinRoster, locationFlagCount, locationNote, mergeCheckins, nearOrFar, reopenTaken, secretFromHash } from "./checkin";
import { buildAttendees } from "./record";

const secret = "a".repeat(64);
describe("crew self check-in", () => {
  it("puts the secret after # and reads it back; anything else is refused", () => {
    expect(checkinLink("https://app.example/", secret)).toBe(`https://app.example/checkin/#${secret}`);
    expect(secretFromHash(`#${secret}`)).toBe(secret);
    expect(secretFromHash("#abc")).toBeNull();
    expect(secretFromHash(`#${"g".repeat(64)}`)).toBeNull();
  });
  it("offers only roster people marked here who haven't signed; walk-ins sign on the presenter's phone", () => {
    const roster = [{ key: "p1", name: "A", personId: "p1" }, { key: "p2", name: "B", personId: "p2" }, { key: "p3", name: "C", personId: "p3" }, { key: "walkin:0", name: "W", personId: null }];
    const sig = { image: "data:image/png;base64,x", signedAt: "2026-10-11T12:00:00Z" };
    expect(checkinRoster(roster, { p2: false }, { p3: sig })).toEqual([{ key: "p1", name: "A" }]);
  });
  it("takes phone signatures into the draft without replacing one already there, only for people on the roster", () => {
    const mine = { image: "data:image/png;base64,mine", signedAt: "2026-10-11T12:00:00Z" };
    const w = (k: string) => ({ roster_key: k, name: k.toUpperCase(), image: `data:image/png;base64,${k}`, signed_at: "2026-10-11T12:05:00Z", confirmed_at: "2026-10-11T12:04:50Z", distance_m: 40, location: "near" as const });
    const r = mergeCheckins(["p1", "p2", "p3"], { p1: mine }, { p3: false }, [w("p1"), w("p2"), w("p3"), w("gone")]);
    expect(r.signatures.p1).toBe(mine);
    expect(r.signatures.p2).toEqual({ image: "data:image/png;base64,p2", signedAt: "2026-10-11T12:05:00Z", confirmedAt: "2026-10-11T12:04:50Z", via: "phone", location: "near", distanceM: 40 });
    expect(r.signatures.p3).toBeUndefined(); // marked "Isn't here": a phone signature doesn't override that
    expect(r.signatures.gone).toBeUndefined();
    expect(r.added).toEqual(["P2"]);
    expect(r.taken.sort()).toEqual(["gone", "p1", "p2", "p3"]);
  });
  it("a new code lets people sign by phone again after their earlier signature was removed", () => {
    const w = { roster_key: "p2", name: "P2", image: "data:image/png;base64,p2b", signed_at: "2026-10-11T12:09:00Z", confirmed_at: "2026-10-11T12:08:50Z", distance_m: null, location: "not_shared" as const };
    const taken = reopenTaken(["p1", "p2"], ["p2", "p3"]);
    expect(taken).toEqual(["p1"]);
    expect(mergeCheckins(["p2"], {}, {}, [w], taken).added).toEqual(["P2"]);
  });
  it("never brings back a signature the talk already took, even if it arrives again", () => {
    const w = { roster_key: "p2", name: "P2", image: "data:image/png;base64,p2", signed_at: "2026-10-11T12:05:00Z", confirmed_at: "2026-10-11T12:04:50Z", distance_m: 40, location: "near" as const };
    const r = mergeCheckins(["p2"], {}, {}, [w], ["p2"]); // taken earlier, then the presenter removed it
    expect(r.signatures.p2).toBeUndefined();
    expect(r.added).toEqual([]);
  });
  it("flags a phone signature that's away from the talk, with no location, or with GPS too rough to tell", () => {
    const talk = { latitude: 26.6, longitude: -81.9, accuracyMeters: 20 };
    expect(nearOrFar(talk, { latitude: 26.6005, longitude: -81.9, accuracyMeters: 15 }).flag).toBe("near");
    const far = nearOrFar(talk, { latitude: 26.62, longitude: -81.9, accuracyMeters: 15 });
    expect(far.flag).toBe("far"); expect(far.distance).toBeGreaterThan(2000);
    expect(nearOrFar(talk, { latitude: 26.6045, longitude: -81.9, accuracyMeters: 400 }).flag).toBe("near"); // ~500 m, but GPS is rough: benefit of the doubt
    expect(nearOrFar(talk, { latitude: 26.6, longitude: -81.9, accuracyMeters: 600 }).flag).toBe("unknown"); // too rough to tell, never stretched to "near"
    expect(nearOrFar({ ...talk, accuracyMeters: 900 }, { latitude: 26.6, longitude: -81.9, accuracyMeters: 10 }).flag).toBe("unknown");
    expect(nearOrFar(talk, null, true)).toEqual({ flag: "not_shared", distance: null });
    expect(nearOrFar(talk, null, false)).toEqual({ flag: "unknown", distance: null }); // GPS failed: not the person's choice
    expect(nearOrFar(null, { latitude: 26.6, longitude: -81.9 }).flag).toBe("unknown");
    expect(locationNote("far", 2213)).toEqual({ text: "Signed on own phone 1.4 mi from the talk", flagged: true });
    expect(locationNote("near", 40)?.flagged).toBe(false);
    expect(locationNote(null, null)).toBeNull();
  });
  it("the saved row says it was signed on their own phone, with the flag; a presenter-phone signature carries none", () => {
    const roster = [{ key: "a", personId: "a", name: "A", role: "", teamName: "" }, { key: "b", personId: "b", name: "B", role: "", teamName: "" }];
    const sig = { image: "data:image/png;base64,x", signedAt: "2026-10-11T12:00:00Z" };
    const rows = buildAttendees(roster, { a: true, b: true }, { a: { ...sig, via: "phone", location: "far", distanceM: 2213 }, b: sig });
    expect(rows[0]).toMatchObject({ status: "signed", signed_on: "own_phone", location: "far", distance_m: 2213 });
    expect(rows[1]).toMatchObject({ status: "signed", signed_on: "presenter_phone", location: null, distance_m: null });
  });
  it("counts location flags on a record: far, not shared and unknown; never near or presenter-phone signatures", () => {
    expect(locationFlagCount([{ status: "signed", location: "far" }, { status: "signed", location: "near" }, { status: "signed", location: null },
      { status: "signed", location: "not_shared" }, { status: "absent", location: "far" }, { status: "signed", location: "unknown" }])).toBe(3);
  });
});
