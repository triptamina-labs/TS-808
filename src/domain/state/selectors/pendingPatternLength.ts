import { createSelector } from "reselect";

import { patternLengthKey } from "helpers";
import { MODE_TO_PART_MAPPING } from "store-constants";
import { getCurrentPattern, getPatternLengths, getSelectedMode } from "selectors/common";

const pendingPatternLengthSelector = createSelector(
  [getCurrentPattern, getPatternLengths, getSelectedMode],
  (currentPattern, patternLengths, selectedMode) => {
    const currentPart = MODE_TO_PART_MAPPING[selectedMode as keyof typeof MODE_TO_PART_MAPPING];
    if (currentPart == null) {
      return 0;
    }
    return patternLengths[patternLengthKey(currentPattern, currentPart)];
  }
);

export default pendingPatternLengthSelector;
