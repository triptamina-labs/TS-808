import { patternLengthKey, stepKey } from "helpers";
import {
  ACCENT,
  A_VARIATION,
  B_VARIATION,
  BASS_DRUM,
  CLAVES_RIMSHOT,
  CLSD_HIHAT,
  COWBELL,
  CYMBAL,
  FIRST_PART,
  HI_CONGA_HI_TOM,
  LOW_CONGA_LOW_TOM,
  MARACAS_HANDCLAP,
  MID_CONGA_MID_TOM,
  OPEN_HIHAT,
  SECOND_PART,
  SNARE_DRUM
} from "store-constants";
import type {
  InstrumentStateMap,
  PatternLengthsState,
  RootState,
  StepsState
} from "domain/state/types";

const PARTS = [FIRST_PART, SECOND_PART] as const;
const VARIATIONS = [A_VARIATION, B_VARIATION] as const;

const initialStepsState = (() => {
  const steps: StepsState = {};
  for (let track = 0; track < 16; track++) {
    for (let instrument = 0; instrument < 12; instrument++) {
      PARTS.forEach(part => {
        VARIATIONS.forEach(variation => {
          for (let step = 0; step < 16; step++) {
            const key = stepKey(track, instrument, part, variation, step);
            steps[key] = false;
          }
        });
      });
    }
  }
  return steps;
})();

const initialRhythmLengthState = (() => {
  const lengths: PatternLengthsState = {};
  for (let track = 0; track < 16; track++) {
    lengths[patternLengthKey(track, FIRST_PART)] = 16;
    lengths[patternLengthKey(track, SECOND_PART)] = 0;
  }
  return lengths;
})();

const initialInstrumentState: InstrumentStateMap = {
  [ACCENT]: { level: 0 },
  [BASS_DRUM]: { level: 75, tone: 50, decay: 50 },
  [SNARE_DRUM]: { level: 75, tone: 50, snappy: 50 },
  [LOW_CONGA_LOW_TOM]: { level: 75, tuning: 50, selector: 1 },
  [MID_CONGA_MID_TOM]: { level: 75, tuning: 50, selector: 1 },
  [HI_CONGA_HI_TOM]: { level: 75, tuning: 50, selector: 1 },
  [CLAVES_RIMSHOT]: { level: 75, selector: 1 },
  [MARACAS_HANDCLAP]: { level: 75, selector: 1 },
  [COWBELL]: { level: 75 },
  [CYMBAL]: { level: 75, tone: 50, decay: 50 },
  [OPEN_HIHAT]: { level: 75, decay: 50 },
  [CLSD_HIHAT]: { level: 75 }
};

export const initialState: RootState = {
  instrumentState: initialInstrumentState,
  patternLengths: initialRhythmLengthState,
  steps: initialStepsState,
  currentPart: FIRST_PART,
  currentVariation: A_VARIATION,
  currentMeasure: 0,
  selectedPattern: 0,
  currentPattern: 0,
  playing: false,
  selectedMode: 1,
  selectedInstrumentTrack: 1,
  masterVolume: 70,
  autoFillInPosition: 0,
  basicVariationPosition: 0,
  introFillVariationPosition: 0,
  selectedPlayPattern: 0,
  selectedPlayFillPattern: 0,
  fillScheduled: false,
  tempo: 135,
  fineTempo: 0,
  currentStep: 0,
  blinkState: true,
  clearPressed: false,
  clearDragging: false,
  pendingPatternLength: 0
};

export default initialState;
