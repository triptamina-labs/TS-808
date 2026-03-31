import { describe, expect, it } from "vitest";

import { validateLoadedState } from "./index";

describe("validateLoadedState", () => {
  it("acepta payload con solo claves persistidas", () => {
    expect(
      validateLoadedState({
        instrumentState: {},
        patternLengths: {},
        steps: {},
        masterVolume: 50,
        tempo: 120,
        fineTempo: 0
      })
    ).toBe(true);
  });

  it("rechaza payload con claves no permitidas", () => {
    expect(
      validateLoadedState({
        instrumentState: {},
        unknownKey: true
      })
    ).toBe(false);
  });

  it("rechaza payload no objeto", () => {
    expect(validateLoadedState(null)).toBe(false);
    expect(validateLoadedState("invalid")).toBe(false);
    expect(validateLoadedState(42)).toBe(false);
    expect(validateLoadedState([])).toBe(false);
  });
});
