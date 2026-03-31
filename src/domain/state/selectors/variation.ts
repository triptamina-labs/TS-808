import { createSelector } from "reselect";

import { A_VARIATION, BOTH_VARIATIONS, B_VARIATION, MODE_PATTERN_CLEAR } from "store-constants";
import { getCurrentPattern, getCurrentVariation, getIntroFillVariationPosition, getPlaying, getSelectedMode } from "selectors/common";
import type { RootState } from "domain/state/types";

const getBasicVariationPosition = (state: RootState) => state.basicVariationPosition;
const getPartLengths = (state: RootState) => state.patternLengths;
const getClearPressed = (state: RootState) => state.clearPressed;
const getCurrentStep = (state: RootState) => state.currentStep;

const variationMap = [A_VARIATION, BOTH_VARIATIONS, B_VARIATION] as const;

const basicVariationSelector = createSelector(
  [
    getPlaying,
    getSelectedMode,
    getCurrentStep,
    getCurrentPattern,
    getCurrentVariation,
    getPartLengths,
    getBasicVariationPosition,
    getClearPressed,
    getIntroFillVariationPosition
  ],
  (
    playing,
    selectedMode,
    _currentStep,
    currentPattern,
    currentVariation,
    _rhythmLengths,
    basicVariationPosition,
    clearPressed,
    introFillVariation
  ) => {
    // If current pattern is an intro/fill-in, lights follow I/F switch position.
    if (currentPattern >= 12) {
      if (selectedMode === MODE_PATTERN_CLEAR && !clearPressed) {
        return null;
      }
      return introFillVariation;
    }

    if (playing) {
      return currentVariation;
    }

    if (selectedMode === MODE_PATTERN_CLEAR && !clearPressed) {
      return null;
    }

    return variationMap[basicVariationPosition] ?? A_VARIATION;
  }
);

export default basicVariationSelector;
