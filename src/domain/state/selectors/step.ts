import { createSelector } from "reselect";

import { getCurrentStep, getSelectedMode } from "selectors/common";
import patternLengthSelector from "selectors/patternLength";

const stepSelector = createSelector(
  [getCurrentStep, getSelectedMode, patternLengthSelector],
  currentStep => {
    return currentStep;
  }
);

export default stepSelector;
