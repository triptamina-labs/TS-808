import { produce } from "immer";

import { applyPersistedState } from "app/store/stateMigration";
import {
  AUTO_FILL_IN_CHANGE,
  BASIC_VARIATION_CHANGE,
  BLINK_TICK,
  CLEAR_DOWN,
  CLEAR_DRAG_DROP,
  CLEAR_DRAG_END,
  CLEAR_DRAG_ENTER,
  CLEAR_DRAG_EXIT,
  CLEAR_DRAG_START,
  CLEAR_UP,
  FINE_TEMPO_CHANGE,
  IF_VARIATION_CHANGE,
  INSTRUMENT_CHANGE,
  INSTRUMENT_TRACK_CHANGE,
  MASTER_VOLUME_CHANGE,
  MODE_CHANGE,
  RESET,
  START_STOP_BUTTON_CLICK,
  STATE_LOAD,
  STEP_BUTTON_CLICK,
  TAP_BUTTON_CLICK,
  TEMPO_CHANGE,
  TICK,
  type AppAction
} from "actionTypes";
import { patternLengthKey } from "helpers";
import initialState from "initialState";
import clearReducer from "reducers/clear";
import stepClickReducer from "reducers/stepClick";
import pendingPatternLengthSelector from "selectors/pendingPatternLength";
import patternLengthSelector from "selectors/patternLength";
import {
  A_VARIATION,
  AUTO_FILL_IN_MAPPING,
  B_VARIATION,
  FIRST_PART,
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR,
  MODE_SECOND_PART,
  MODE_TO_PART_MAPPING,
  SECOND_PART
} from "store-constants";
import type { RootState as State } from "domain/state/types";

function getNextVariation(currentVariation: typeof A_VARIATION | typeof B_VARIATION, basicVariationPosition: number) {
  switch (basicVariationPosition) {
    case 0:
      return A_VARIATION;
    case 1:
      return currentVariation === A_VARIATION ? B_VARIATION : A_VARIATION;
    case 2:
      return B_VARIATION;
    default:
      return A_VARIATION;
  }
}

function isMeasureAutoFill(state: State, measure: number) {
  const autoFillInValue = AUTO_FILL_IN_MAPPING[state.autoFillInPosition as number] as number | null;
  return measure !== 0 && autoFillInValue != null && measure % autoFillInValue === 0;
}

function nextMeasure(state: State) {
  const nextVariation = getNextVariation(state.currentVariation, state.basicVariationPosition);

  const stateUpdate: Partial<State> = {
    currentStep: 0,
    currentPart: FIRST_PART,
    currentVariation: nextVariation
  };

  if (state.fillScheduled) {
    return produce(state, draft => {
      Object.assign(draft, {
        ...stateUpdate,
        // If a fill has been scheduled, next pattern should be selected fill pattern.
        currentPattern: state.selectedPlayFillPattern + 12,
        // Clear fill schedule.
        fillScheduled: false
      });
    });
  }

  stateUpdate.currentPattern = state.selectedPlayPattern;

  // Move to next scheduled pattern.
  if (state.currentPattern < 12) {
    // Add auto fill-ins.
    if (isMeasureAutoFill(state, state.currentMeasure + 1)) {
      stateUpdate.currentPattern = state.selectedPlayFillPattern + 12;
    }

    // Pattern is a basic rhythm, increment measure.
    return produce(state, draft => {
      Object.assign(draft, {
        ...stateUpdate,
        currentMeasure: state.currentMeasure + 1
      });
    });
  }

  // Pattern is a fill-in, do not increment measure.
  return produce(state, draft => {
    Object.assign(draft, stateUpdate);
  });
}

export default function rootReducer(state: State = initialState, action: AppAction): State {
  switch (action.type) {
    case INSTRUMENT_CHANGE: {
      const {
        type: instrumentType,
        controlName,
        value
      } = action.payload;

      return produce(state, draft => {
        draft.instrumentState[instrumentType][controlName] = value;
      });
    }

    case STEP_BUTTON_CLICK:
      return stepClickReducer(state, action.payload);

    case START_STOP_BUTTON_CLICK:
      return produce(state, draft => {
        switch (state.selectedMode) {
          case MODE_PATTERN_CLEAR:
            break;

          case MODE_FIRST_PART:
          case MODE_SECOND_PART: {
            if (!state.playing) {
              draft.currentStep = -1;
              draft.currentVariation = state.basicVariationPosition > 1 ? B_VARIATION : A_VARIATION;
              draft.currentPattern = state.selectedPattern;
            }

            draft.playing = !state.playing;
            draft.currentPart = FIRST_PART;
            break;
          }

          case MODE_MANUAL_PLAY: {
            if (!state.playing) {
              draft.currentStep = -1;
              draft.currentVariation = state.basicVariationPosition > 1 ? B_VARIATION : A_VARIATION;
              draft.currentPattern = state.fillScheduled
                ? state.selectedPlayFillPattern + 12
                : state.selectedPlayPattern;
              draft.currentMeasure = 0;
              draft.fillScheduled = false;
            }

            draft.playing = !state.playing;
            draft.currentPart = FIRST_PART;
            break;
          }

          default:
            break;
        }
      });

    case MASTER_VOLUME_CHANGE:
      return produce(state, draft => {
        draft.masterVolume = action.payload;
      });

    case BASIC_VARIATION_CHANGE:
      return produce(state, draft => {
        draft.basicVariationPosition = action.payload;
      });

    case IF_VARIATION_CHANGE:
      return produce(state, draft => {
        draft.introFillVariationPosition = action.payload;
      });

    case TEMPO_CHANGE:
      return produce(state, draft => {
        draft.tempo = action.payload;
      });

    case FINE_TEMPO_CHANGE:
      return produce(state, draft => {
        draft.fineTempo = action.payload;
      });

    case AUTO_FILL_IN_CHANGE:
      return produce(state, draft => {
        draft.autoFillInPosition = action.payload;
      });

    case INSTRUMENT_TRACK_CHANGE:
      return produce(state, draft => {
        draft.selectedInstrumentTrack = action.payload;
      });

    case MODE_CHANGE:
      return produce(state, draft => {
        draft.selectedMode = action.payload;
        draft.playing = false;
      });

    case TICK: {
      const currentPatternLength = patternLengthSelector(state);

      // Go to next part/measure.
      if (state.currentStep + 1 >= currentPatternLength) {
        switch (state.selectedMode) {
          case MODE_FIRST_PART:
            return produce(state, draft => {
              draft.currentStep = 0;
              draft.currentPart = FIRST_PART;
              draft.currentVariation = getNextVariation(
                state.currentVariation,
                state.basicVariationPosition
              );
            });

          case MODE_SECOND_PART: {
            let nextPart: typeof FIRST_PART | typeof SECOND_PART = FIRST_PART;
            let nextVariation = state.currentVariation;

            if (state.currentPart === FIRST_PART) {
              // Go to second part if length > 0.
              const secondPartLength =
                state.patternLengths[patternLengthKey(state.currentPattern, SECOND_PART)];

              if (secondPartLength !== 0) {
                nextPart = SECOND_PART;
              } else {
                // Second part length is zero, go back to first part with next variation.
                nextVariation = getNextVariation(state.currentVariation, state.basicVariationPosition);
              }
            } else {
              // Second part finished, go back to first part with next variation.
              nextVariation = getNextVariation(state.currentVariation, state.basicVariationPosition);
            }

            return produce(state, draft => {
              draft.currentStep = 0;
              draft.currentPart = nextPart;
              draft.currentVariation = nextVariation;
            });
          }

          case MODE_MANUAL_PLAY: {
            if (state.currentPart === FIRST_PART) {
              // Go to second part if length > 0.
              const secondPartLength =
                state.patternLengths[patternLengthKey(state.currentPattern, SECOND_PART)];

              if (secondPartLength !== 0) {
                return produce(state, draft => {
                  draft.currentStep = 0;
                  draft.currentPart = SECOND_PART;
                });
              }
              return nextMeasure(state);
            }

            return nextMeasure(state);
          }

          default:
            break;
        }
      }

      return produce(state, draft => {
        draft.currentStep = state.currentStep + 1;
      });
    }

    case BLINK_TICK:
      return produce(state, draft => {
        draft.blinkState = !state.blinkState;
      });

    case CLEAR_DOWN:
    case CLEAR_UP:
    case CLEAR_DRAG_START:
    case CLEAR_DRAG_END:
      return clearReducer(state, action.type);

    case TAP_BUTTON_CLICK:
      switch (state.selectedMode) {
        case MODE_MANUAL_PLAY:
          return produce(state, draft => {
            draft.fillScheduled = !state.fillScheduled;
          });
        default:
          return state;
      }

    case CLEAR_DRAG_DROP: {
      const track = state.currentPattern;
      const part = MODE_TO_PART_MAPPING[state.selectedMode as keyof typeof MODE_TO_PART_MAPPING];

      if (part === FIRST_PART) {
        return produce(state, draft => {
          draft.patternLengths[patternLengthKey(track, FIRST_PART)] = action.payload;
          draft.patternLengths[patternLengthKey(track, SECOND_PART)] = 0;
        });
      }

      if (part === SECOND_PART) {
        return produce(state, draft => {
          draft.patternLengths[patternLengthKey(track, SECOND_PART)] = action.payload;
        });
      }

      return state;
    }

    case CLEAR_DRAG_ENTER:
      return produce(state, draft => {
        draft.pendingPatternLength = action.payload + 1;
      });

    case CLEAR_DRAG_EXIT:
      return produce(state, draft => {
        draft.pendingPatternLength = pendingPatternLengthSelector(state);
      });

    case STATE_LOAD:
      return applyPersistedState(state, action.payload);

    case RESET:
      return produce(state, () => {
        return initialState;
      });

    default:
      return state;
  }
}
