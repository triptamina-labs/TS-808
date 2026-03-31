import { produce } from "immer";

import { stepKey } from "helpers";
import basicVariationSelector from "selectors/variation";
import {
  BOTH_VARIATIONS,
  FIRST_PART,
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR,
  MODE_SECOND_PART,
  MODE_TO_PART_MAPPING
} from "store-constants";
import type { RootState } from "domain/state/types";

export default function stepClickReducer(state: RootState, stepNumber: number): RootState {
  const { playing, selectedMode, currentPattern, selectedInstrumentTrack, currentStep, currentPart } =
    state;

  const currentVariationLight = basicVariationSelector(state);
  const currentVariation =
    currentVariationLight == null || currentVariationLight === BOTH_VARIATIONS
      ? state.currentVariation
      : currentVariationLight;

  if (playing) {
    switch (selectedMode) {
      case MODE_FIRST_PART:
      case MODE_SECOND_PART: {
        const selectedPart = MODE_TO_PART_MAPPING[selectedMode];
        const key = stepKey(
          currentPattern,
          selectedInstrumentTrack,
          selectedPart,
          currentVariation,
          stepNumber
        );

        return produce(state, draft => {
          draft.steps[key] = !state.steps[key];
        });
      }
      case MODE_MANUAL_PLAY: {
        if (stepNumber < 12) {
          if (currentPart === FIRST_PART && currentStep < 4) {
            // Change pattern immediately.
            return produce(state, draft => {
              draft.selectedPlayPattern = stepNumber;
              draft.currentPattern = stepNumber;
            });
          }

          // Change selected basic rhythm.
          return produce(state, draft => {
            draft.selectedPlayPattern = stepNumber;
          });
        }

        // Change selected fill pattern.
        return produce(state, draft => {
          draft.selectedPlayFillPattern = stepNumber - 12;
        });
      }
      default:
        return state;
    }
  }

  switch (selectedMode) {
    case MODE_PATTERN_CLEAR:
    case MODE_FIRST_PART:
    case MODE_SECOND_PART:
      return produce(state, draft => {
        draft.selectedPattern = stepNumber;
      });
    case MODE_MANUAL_PLAY:
      return produce(state, draft => {
        if (stepNumber < 12) {
          draft.selectedPlayPattern = stepNumber;
        } else {
          draft.selectedPlayFillPattern = stepNumber - 12;
        }
      });
    default:
      return state;
  }
}
