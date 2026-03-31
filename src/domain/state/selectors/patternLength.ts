import { createSelector } from "reselect";

import { patternLengthKey } from "helpers";
import { getCurrentPart, getCurrentPattern, getPatternLengths } from "selectors/common";

const patternLengthSelector = createSelector(
  [getCurrentPattern, getCurrentPart, getPatternLengths],
  (currentPattern, currentPart, patternLengths) => {
    return patternLengths[patternLengthKey(currentPattern, currentPart)];
  }
);

export default patternLengthSelector;
