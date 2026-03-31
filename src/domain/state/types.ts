import type {
  InstrumentId,
  Mode,
  Part,
  Variation
} from "store-constants";
import { PERSISTANCE_FILTER } from "store-constants";

export type PatternIndex = number;
export type StepIndex = number;

export interface InstrumentControls {
  level: number;
  tone?: number;
  decay?: number;
  snappy?: number;
  tuning?: number;
  selector?: number;
}

export type InstrumentStateMap = Record<InstrumentId, InstrumentControls>;
export type StepsState = Record<string, boolean>;
export type PatternLengthsState = Record<string, number>;

export interface RootState {
  instrumentState: InstrumentStateMap;
  patternLengths: PatternLengthsState;
  steps: StepsState;
  currentPart: Part;
  currentVariation: Variation;
  currentMeasure: number;
  selectedPattern: PatternIndex;
  currentPattern: PatternIndex;
  playing: boolean;
  selectedMode: Mode;
  selectedInstrumentTrack: InstrumentId;
  masterVolume: number;
  autoFillInPosition: number;
  basicVariationPosition: number;
  introFillVariationPosition: number;
  selectedPlayPattern: PatternIndex;
  selectedPlayFillPattern: number;
  fillScheduled: boolean;
  tempo: number;
  fineTempo: number;
  currentStep: number;
  blinkState: boolean;
  clearPressed: boolean;
  clearDragging: boolean;
  pendingPatternLength: number;
}

export type PersistedState = Pick<RootState, (typeof PERSISTANCE_FILTER)[number]>;
export type PersistedStateInput = Partial<PersistedState>;
