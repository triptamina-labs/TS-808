import { A_VARIATION, B_VARIATION } from "store-constants";
import type { RootState } from "domain/state/types";

export const getIntroFillVariationPosition = (state: RootState) =>
  [A_VARIATION, B_VARIATION][state.introFillVariationPosition] ?? A_VARIATION;

export const getPlaying = (state: RootState) => state.playing;
export const getCurrentPattern = (state: RootState) => state.currentPattern;
export const getSelectedMode = (state: RootState) => state.selectedMode;
export const getCurrentVariation = (state: RootState) => state.currentVariation;
export const getCurrentStep = (state: RootState) => state.currentStep;
export const getBasicVaritionPosition = (state: RootState) => state.basicVariationPosition;
export const getClearPressed = (state: RootState) => state.clearPressed;
export const getSteps = (state: RootState) => state.steps;
export const getSelectedInstrumentTrack = (state: RootState) => state.selectedInstrumentTrack;
export const getPatternLengths = (state: RootState) => state.patternLengths;
export const getFillScheduled = (state: RootState) => state.fillScheduled;
export const getSelectedPlayPattern = (state: RootState) => state.selectedPlayPattern;
export const getSelectedPlayFillPattern = (state: RootState) => state.selectedPlayFillPattern;
export const getCurrentPart = (state: RootState) => state.currentPart;
export const getSelectedPattern = (state: RootState) => state.selectedPattern;
export const getClearDragging = (state: RootState) => state.clearDragging;
export const getPendingPatternLength = (state: RootState) => state.pendingPatternLength;
