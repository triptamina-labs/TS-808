import { describe, expect, it } from "vitest";

import {
  onClearDown,
  onClearDragDrop,
  onModeChange,
  onStateLoad,
  onStepButtonClick,
  onTapButtonClick
} from "actionCreators";
import { patternLengthKey } from "helpers";
import initialState from "initialState";
import rootReducer from "reducers/index";
import {
  FIRST_PART,
  MODE_FIRST_PART,
  MODE_MANUAL_PLAY,
  MODE_PATTERN_CLEAR,
  SECOND_PART
} from "store-constants";

describe("rootReducer", () => {
  it("detiene reproduccion al cambiar de modo", () => {
    const state = { ...initialState, playing: true };
    const nextState = rootReducer(state, onModeChange(MODE_FIRST_PART));

    expect(nextState.selectedMode).toBe(MODE_FIRST_PART);
    expect(nextState.playing).toBe(false);
  });

  it("selecciona patron al clickear step en write mode sin reproduccion", () => {
    const state = { ...initialState, selectedMode: MODE_FIRST_PART, selectedPattern: 0, playing: false };
    const nextState = rootReducer(state, onStepButtonClick(5));

    expect(nextState.selectedPattern).toBe(5);
  });

  it("alterna fillScheduled con TAP en manual play", () => {
    const state = { ...initialState, selectedMode: MODE_MANUAL_PLAY, fillScheduled: false };
    const nextState = rootReducer(state, onTapButtonClick());
    const finalState = rootReducer(nextState, onTapButtonClick());

    expect(nextState.fillScheduled).toBe(true);
    expect(finalState.fillScheduled).toBe(false);
  });

  it("clear drag drop en first part ajusta longitudes de ambas partes", () => {
    const state = { ...initialState, selectedMode: MODE_FIRST_PART, currentPattern: 2 };
    const nextState = rootReducer(state, onClearDragDrop(9));

    expect(nextState.patternLengths[patternLengthKey(2, FIRST_PART)]).toBe(9);
    expect(nextState.patternLengths[patternLengthKey(2, SECOND_PART)]).toBe(0);
  });

  it("clear down solo activa clearPressed en pattern clear", () => {
    const writeModeState = { ...initialState, selectedMode: MODE_FIRST_PART, clearPressed: false };
    const patternClearState = { ...initialState, selectedMode: MODE_PATTERN_CLEAR, clearPressed: false };

    expect(rootReducer(writeModeState, onClearDown()).clearPressed).toBe(false);
    expect(rootReducer(patternClearState, onClearDown()).clearPressed).toBe(true);
  });

  it("state load hidrata subset persistido sin perder estado de runtime", () => {
    const runtimeState = {
      ...initialState,
      playing: true,
      currentStep: 5
    };

    const nextState = rootReducer(
      runtimeState,
      onStateLoad({
        masterVolume: 20,
        tempo: 140
      })
    );

    expect(nextState.masterVolume).toBe(20);
    expect(nextState.tempo).toBe(140);
    expect(nextState.playing).toBe(true);
    expect(nextState.currentStep).toBe(5);
  });
});
