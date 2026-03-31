import { describe, expect, it } from "vitest";

import { equalPower, patternLengthKey, snap, stepKey } from "helpers";
import { A_VARIATION, FIRST_PART } from "store-constants";

describe("helpers", () => {
  it("genera keys estables de steps", () => {
    expect(stepKey(3, 9, FIRST_PART, A_VARIATION, 12)).toBe(
      "PATTERN_3-INSTRUMENT_9-FIRST_PART-A_VARIATION-STEP_12"
    );
  });

  it("genera keys estables de longitud de patron", () => {
    expect(patternLengthKey(7, FIRST_PART)).toBe("PATTERN_7-FIRST_PART-LENGTH");
  });

  it("calcula snap como en el proyecto original", () => {
    expect(snap(4.4, 2, 0)).toBe(4);
    expect(snap(4.6, 2, 0)).toBe(4);
    expect(snap(5.6, 2, 0)).toBe(6);
  });

  it("convierte volumen por curva equal-power", () => {
    expect(equalPower(0)).toBe(0);
    expect(equalPower(100)).toBe(1);
  });
});
