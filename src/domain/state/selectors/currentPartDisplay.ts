import { createSelector } from "reselect";

import {
  FIRST_PART,
  MODE_FIRST_PART,
  MODE_PATTERN_CLEAR,
  MODE_SECOND_PART,
  SECOND_PART
} from "store-constants";
import { getClearPressed, getCurrentPart, getSelectedMode } from "selectors/common";

const currentPartDisplaySelector = createSelector(
  [getSelectedMode, getClearPressed, getCurrentPart],
  (selectedMode, clearPressed, currentPart) => {
    switch (selectedMode) {
      case MODE_PATTERN_CLEAR:
        return clearPressed ? SECOND_PART : FIRST_PART;
      case MODE_FIRST_PART:
        return FIRST_PART;
      case MODE_SECOND_PART:
        return SECOND_PART;
      default:
        return currentPart;
    }
  }
);

export default currentPartDisplaySelector;
