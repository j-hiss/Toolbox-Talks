import { describe, expect, it } from "vitest";
import { fitWithin, PHOTO_MAX_SIDE } from "./photo";

describe("crew photo size", () => {
  it("shrinks the longest side to the limit and keeps the shape", () => {
    expect(fitWithin(4032, 3024)).toEqual({ width: PHOTO_MAX_SIDE, height: 960 });
    expect(fitWithin(3024, 4032)).toEqual({ width: 960, height: PHOTO_MAX_SIDE });
  });
  it("never enlarges a small photo", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
});
