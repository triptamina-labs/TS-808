import { produce } from "immer";

import {
  CLEAR_DOWN,
  CLEAR_DRAG_END,
  CLEAR_DRAG_START,
  CLEAR_UP,
  type ClearReducerActionType
} from "actionTypes";
import { stepKey } from "helpers";
import pendingPatternLengthSelector from "selectors/pendingPatternLength";
import {
  A_VARIATION,
  B_VARIATION,
  FIRST_PART,
  MODE_PATTERN_CLEAR,
  SECOND_PART
} from "store-constants";
import type { RootState, StepsState } from "domain/state/types";

export default function clearReducer(state: RootState, type: ClearReducerActionType): RootState {
  switch (type) {
    case CLEAR_DOWN: {
      if (state.selectedMode === MODE_PATTERN_CLEAR) {
        return produce(state, draft => {
          draft.clearPressed = true;
        });
      }
      return state;
    }

    case CLEAR_UP: {
      if (state.selectedMode !== MODE_PATTERN_CLEAR) {
        return state;
      }

      return produce(state, draft => {
        draft.clearPressed = false;

        const variationsToClear: Array<typeof A_VARIATION | typeof B_VARIATION> = [];

        // Basic rhythm.
        if (state.selectedPattern < 12) {
          if (state.basicVariationPosition <= 1) {
            variationsToClear.push(A_VARIATION);
          }
          if (state.basicVariationPosition >= 1) {
            variationsToClear.push(B_VARIATION);
          }
        } else {
          // Intro/fill in.
          if (state.introFillVariationPosition === 0) {
            variationsToClear.push(A_VARIATION);
          } else {
            variationsToClear.push(B_VARIATION);
          }
        }

        const steps: StepsState = {};
        variationsToClear.forEach(variation => {
          [FIRST_PART, SECOND_PART].forEach(part => {
            for (let stepNumber = 0; stepNumber < 16; stepNumber++) {
              for (let instrument = 0; instrument < 12; instrument++) {
                const key = stepKey(
                  state.selectedPattern,
                  instrument,
                  part,
                  variation,
                  stepNumber
                );
                steps[key] = false;
              }
            }
          });
        });

        draft.steps = steps;
      });
    }

    case CLEAR_DRAG_START:
      return produce(state, draft => {
        draft.clearDragging = true;
        draft.pendingPatternLength = pendingPatternLengthSelector(state);
      });

    case CLEAR_DRAG_END:
      return produce(state, draft => {
        draft.clearDragging = false;
      });

    default:
      return state;
  }
}
