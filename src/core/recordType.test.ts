import { describe, expect, it } from "vitest";
import { matchesRecordFilter, recordBadges, recordTypeOf } from "./recordType";
import { makeupWeatherNote } from "./weatherRecord";

const r = (over: Partial<Parameters<typeof recordBadges>[0]> = {}) => ({ kind: "weekly" as const, makeup_for_week: null, talk_id: "fall", scheduled_talk_id: "fall", ...over });

describe("what kind of talk a record is", () => {
  it("one type for every record, plus own talk and swapped when true", () => {
    expect(recordBadges(r()).map((b) => b.label)).toEqual(["Weekly talk"]);
    expect(recordBadges(r({ makeup_for_week: "2026-10-05" })).map((b) => b.label)).toEqual(["Makeup"]);
    expect(recordBadges(r({ kind: "daily" })).map((b) => b.label)).toEqual(["Daily plan"]);
    expect(recordBadges(r({ talk_id: "own-abc123def456", scheduled_talk_id: "fall" })).map((b) => b.label)).toEqual(["Weekly talk", "Own talk", "Swapped"]);
    expect(recordBadges(r({ talk_id: "ladders", scheduled_talk_id: "fall", makeup_for_week: "2026-10-05" })).map((b) => b.label)).toEqual(["Makeup"]);
    expect(recordTypeOf({ record_kind: "daily", makeup_for_week: null, talk_id: "pretask" })).toBe("daily");
  });
  it("filters the Records list by type", () => {
    const list = [r(), r({ makeup_for_week: "2026-10-05" }), r({ kind: "daily" }), r({ talk_id: "own-abc123def456" })];
    expect(list.filter((x) => matchesRecordFilter(x, "makeup")).length).toBe(1);
    expect(list.filter((x) => matchesRecordFilter(x, "weekly")).length).toBe(2);
    expect(list.filter((x) => matchesRecordFilter(x, "own")).length).toBe(1);
    expect(list.filter((x) => matchesRecordFilter(x, "all")).length).toBe(4);
  });
  it("says a makeup's weather is from the day it was given", () => {
    expect(makeupWeatherNote({ checked_at: "2026-10-12T14:00:00Z" })).toMatch(/^Makeup: the weather the day it was given \(Mon, Oct 12\) where it was given, not the week it makes up\.$/);
  });
});
