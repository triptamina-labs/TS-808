import { describe, expect, it } from "vitest";

import initialState from "initialState";
import { BASS_DRUM, MODE_MANUAL_PLAY } from "store-constants";

import {
  applyPersistedState,
  normalizePersistedState,
  persistMigrate,
  STATE_MIGRATION_VERSION
} from "./stateMigration";

describe("stateMigration", () => {
  it("genera estado persistido por defecto para usuario nuevo", () => {
    const normalized = normalizePersistedState(undefined);

    expect(normalized.masterVolume).toBe(initialState.masterVolume);
    expect(normalized.tempo).toBe(initialState.tempo);
    expect(normalized.fineTempo).toBe(initialState.fineTempo);
    expect(normalized.instrumentState[BASS_DRUM]).toEqual(initialState.instrumentState[BASS_DRUM]);
  });

  it("normaliza estado legado con valores invalidos", () => {
    const firstStepKey = Object.keys(initialState.steps)[0];
    const firstPatternLengthKey = Object.keys(initialState.patternLengths)[0];

    const normalized = normalizePersistedState({
      instrumentState: {
        [BASS_DRUM]: {
          level: "150",
          tone: "-10",
          decay: 40
        }
      },
      patternLengths: {
        [firstPatternLengthKey]: 99
      },
      steps: {
        [firstStepKey]: "true"
      },
      masterVolume: "-20",
      tempo: "500",
      fineTempo: "99"
    });

    expect(normalized.instrumentState[BASS_DRUM].level).toBe(100);
    expect(normalized.instrumentState[BASS_DRUM].tone).toBe(0);
    expect(normalized.instrumentState[BASS_DRUM].decay).toBe(40);
    expect(normalized.patternLengths[firstPatternLengthKey]).toBe(16);
    expect(normalized.steps[firstStepKey]).toBe(true);
    expect(normalized.masterVolume).toBe(0);
    expect(normalized.tempo).toBe(300);
    expect(normalized.fineTempo).toBe(6.75);
  });

  it("aplica estado persistido sin perder estado transitorio de runtime", () => {
    const runtimeState = {
      ...initialState,
      playing: true,
      selectedMode: MODE_MANUAL_PLAY,
      currentStep: 7
    };

    const hydrated = applyPersistedState(runtimeState, {
      masterVolume: 32,
      tempo: 142
    });

    expect(hydrated.masterVolume).toBe(32);
    expect(hydrated.tempo).toBe(142);
    expect(hydrated.playing).toBe(true);
    expect(hydrated.currentStep).toBe(7);
  });

  it("migra contenedor redux-persist preservando _persist", async () => {
    const migrated = (await persistMigrate({
      _persist: { version: 0, rehydrated: false },
      masterVolume: 88
    } as never, STATE_MIGRATION_VERSION)) as {
      _persist: { version: number; rehydrated: boolean };
      masterVolume: number;
    };

    expect(migrated.masterVolume).toBe(88);
    expect(migrated._persist.version).toBe(0);
    expect(migrated._persist.rehydrated).toBe(false);
  });

  it("crea _persist por defecto cuando falta metadata", async () => {
    const migrated = (await persistMigrate({
      masterVolume: 77
    } as never, STATE_MIGRATION_VERSION)) as {
      _persist: { version: number; rehydrated: boolean };
      masterVolume: number;
    };

    expect(migrated.masterVolume).toBe(77);
    expect(migrated._persist.version).toBe(STATE_MIGRATION_VERSION);
    expect(migrated._persist.rehydrated).toBe(false);
  });
});
