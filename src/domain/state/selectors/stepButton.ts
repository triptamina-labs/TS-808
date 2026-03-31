import { createSelector } from "reselect";

import { stepKey } from "helpers";
import currentPartSelector from "selectors/currentPartDisplay";
import {
  getClearDragging,
  getCurrentPattern,
  getCurrentStep,
  getFillScheduled,
  getIntroFillVariationPosition,
  getPendingPatternLength,
  getPlaying,
  getSelectedInstrumentTrack,
  getSelectedMode,
  getSelectedPattern,
  getSelectedPlayFillPattern,
  getSelectedPlayPattern,
  getSteps
} from "selectors/common";
import basicVariationSelector from "selectors/variation";
import {
  A_VARIATION,
  BOTH_VARIATIONS,
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR,
  MODE_SECOND_PART
} from "store-constants";
import type { RootState } from "domain/state/types";

const getBlinkState = (state: RootState) => state.blinkState;

// Returns a boolean determining if the step button light is on.
export default function stepButtonSelectorFactory(stepNumber: number) {
  return createSelector(
    [
      getPlaying,
      getCurrentPattern,
      getSelectedMode,
      basicVariationSelector,
      getCurrentStep,
      getBlinkState,
      getSelectedInstrumentTrack,
      getSteps,
      currentPartSelector,
      getIntroFillVariationPosition,
      getFillScheduled,
      getSelectedPlayPattern,
      getSelectedPlayFillPattern,
      getSelectedPattern,
      getClearDragging,
      getPendingPatternLength
    ],
    (
      playing,
      currentPattern,
      selectedMode,
      basicVariation,
      currentStep,
      blinkState,
      selectedInstrument,
      steps,
      currentPart,
      introFillVariation,
      fillScheduled,
      selectedPlayPattern,
      selectedPlayFillPattern,
      selectedPattern,
      clearDragging,
      pendingPatternLength
    ) => {
      const currentVariation = currentPattern < 12 ? basicVariation : introFillVariation;
      const stepVariation =
        currentVariation == null || currentVariation === BOTH_VARIATIONS
          ? A_VARIATION
          : currentVariation;

      // Sequencer is playing.
      if (playing) {
        switch (selectedMode) {
          case MODE_FIRST_PART:
          case MODE_SECOND_PART: {
            if (clearDragging) {
              return pendingPatternLength > stepNumber;
            }

            const currentStepKey = stepKey(
              currentPattern,
              selectedInstrument,
              currentPart,
              stepVariation,
              stepNumber
            );
            const sequencerValue = steps[currentStepKey];
            return currentStep === stepNumber ? !sequencerValue : Boolean(sequencerValue);
          }
          case MODE_MANUAL_PLAY: {
            const isCurrentPattern = currentPattern === stepNumber;
            const isCurrentStep = currentStep === stepNumber;
            return isCurrentPattern ? isCurrentPattern && !isCurrentStep : isCurrentStep;
          }
          default:
            return false;
        }
      }

      // Sequencer is not playing.
      switch (selectedMode) {
        case MODE_PATTERN_CLEAR:
        case MODE_FIRST_PART:
        case MODE_SECOND_PART:
          if (clearDragging) {
            return pendingPatternLength > stepNumber;
          }
          return selectedPattern === stepNumber && blinkState;
        case MODE_MANUAL_PLAY:
          if (stepNumber < 12) {
            if (fillScheduled) {
              return selectedPlayPattern === stepNumber;
            }
            return selectedPlayPattern === stepNumber && blinkState;
          }

          {
            const selectedStep = selectedPlayFillPattern + 12;
            if (fillScheduled) {
              return selectedStep === stepNumber && blinkState;
            }
            return selectedStep === stepNumber;
          }
        default:
          return false;
      }
    }
  );
}
