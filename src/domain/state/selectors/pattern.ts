import { createSelector } from "reselect";

import {
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR,
  MODE_SECOND_PART
} from "store-constants";
import { getCurrentPattern, getSelectedMode, getSelectedPattern } from "selectors/common";

const patternSelector = createSelector(
  [getCurrentPattern, getSelectedMode, getSelectedPattern],
  (currentPattern, mode, selectedPattern) => {
    switch (mode) {
      case MODE_PATTERN_CLEAR:
      case MODE_FIRST_PART:
      case MODE_SECOND_PART:
        return selectedPattern;
      case MODE_MANUAL_PLAY:
      default:
        return currentPattern;
    }
  }
);

export default patternSelector;
