import { describe, expect, it } from "vitest";

import { patternLengthKey } from "helpers";
import initialState from "initialState";
import patternSelector from "selectors/pattern";
import pendingPatternLengthSelector from "selectors/pendingPatternLength";
import stepButtonSelectorFactory from "selectors/stepButton";
import variationSelector from "selectors/variation";
import {
  FIRST_PART,
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR
} from "store-constants";

describe("selectors de estado", () => {
  it("patternSelector usa selectedPattern en write modes", () => {
    const state = {
      ...initialState,
      selectedMode: MODE_FIRST_PART,
      selectedPattern: 6,
      currentPattern: 2
    };
    expect(patternSelector(state)).toBe(6);
  });

  it("pendingPatternLengthSelector usa parte segun modo", () => {
    const state = {
      ...initialState,
      selectedMode: MODE_FIRST_PART,
      currentPattern: 1,
      patternLengths: {
        ...initialState.patternLengths,
        [patternLengthKey(1, FIRST_PART)]: 12
      }
    };

    expect(pendingPatternLengthSelector(state)).toBe(12);
  });

  it("stepButtonSelector en manual play refleja patron seleccionado sin reproduccion", () => {
    const state = {
      ...initialState,
      selectedMode: MODE_MANUAL_PLAY,
      playing: false,
      selectedPlayPattern: 4,
      blinkState: true,
      fillScheduled: false
    };

    const step4Selector = stepButtonSelectorFactory(4);
    const step3Selector = stepButtonSelectorFactory(3);

    expect(step4Selector(state)).toBe(true);
    expect(step3Selector(state)).toBe(false);
  });

  it("variationSelector apaga luces en pattern clear sin clear presionado", () => {
    const state = {
      ...initialState,
      selectedMode: MODE_PATTERN_CLEAR,
      clearPressed: false
    };

    expect(variationSelector(state)).toBeNull();
  });
});
