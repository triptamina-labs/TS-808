import initialState from "initialState";
import { ALL_INSTRUMENTS } from "store-constants";
import type { PersistMigrate, PersistedState as ReduxPersistedState } from "redux-persist/es/types";
import type {
  InstrumentControls,
  InstrumentStateMap,
  PatternLengthsState,
  PersistedState,
  RootState,
  StepsState
} from "domain/state/types";

export const STATE_MIGRATION_VERSION = 1 as const;

const STEP_KEYS = Object.keys(initialState.steps);
const PATTERN_LENGTH_KEYS = Object.keys(initialState.patternLengths);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const toBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
  }

  return fallback;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const normalizeInstrumentControls = (
  rawControls: unknown,
  fallbackControls: InstrumentControls
): InstrumentControls => {
  const controls = isRecord(rawControls) ? rawControls : {};

  const normalized: InstrumentControls = {
    level: clamp(toNumber(controls.level, fallbackControls.level), 0, 100)
  };

  if (fallbackControls.tone != null) {
    normalized.tone = clamp(toNumber(controls.tone, fallbackControls.tone), 0, 100);
  }

  if (fallbackControls.decay != null) {
    normalized.decay = clamp(toNumber(controls.decay, fallbackControls.decay), 0, 100);
  }

  if (fallbackControls.snappy != null) {
    normalized.snappy = clamp(toNumber(controls.snappy, fallbackControls.snappy), 0, 100);
  }

  if (fallbackControls.tuning != null) {
    normalized.tuning = clamp(toNumber(controls.tuning, fallbackControls.tuning), 0, 100);
  }

  if (fallbackControls.selector != null) {
    const selector = toNumber(controls.selector, fallbackControls.selector);
    normalized.selector = Math.round(clamp(selector, 0, 1));
  }

  return normalized;
};

const normalizeInstrumentState = (rawInstrumentState: unknown): InstrumentStateMap => {
  const source = isRecord(rawInstrumentState) ? rawInstrumentState : {};
  const normalized = {} as InstrumentStateMap;

  ALL_INSTRUMENTS.forEach(instrumentId => {
    const fallbackControls = initialState.instrumentState[instrumentId];
    const rawControls = source[String(instrumentId)];
    normalized[instrumentId] = normalizeInstrumentControls(rawControls, fallbackControls);
  });

  return normalized;
};

const normalizePatternLengths = (rawPatternLengths: unknown): PatternLengthsState => {
  const source = isRecord(rawPatternLengths) ? rawPatternLengths : {};
  const normalized: PatternLengthsState = {
    ...initialState.patternLengths
  };

  PATTERN_LENGTH_KEYS.forEach(key => {
    const nextValue = toNumber(source[key], normalized[key]);
    normalized[key] = clamp(Math.round(nextValue), 0, 16);
  });

  return normalized;
};

const normalizeSteps = (rawSteps: unknown): StepsState => {
  const source = isRecord(rawSteps) ? rawSteps : {};
  const normalized: StepsState = {
    ...initialState.steps
  };

  STEP_KEYS.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      normalized[key] = toBoolean(source[key], normalized[key]);
    }
  });

  return normalized;
};

export function normalizePersistedState(rawState: unknown): PersistedState {
  const source = isRecord(rawState) ? rawState : {};

  return {
    instrumentState: normalizeInstrumentState(source.instrumentState),
    patternLengths: normalizePatternLengths(source.patternLengths),
    steps: normalizeSteps(source.steps),
    masterVolume: clamp(toNumber(source.masterVolume, initialState.masterVolume), 0, 100),
    tempo: clamp(Math.round(toNumber(source.tempo, initialState.tempo)), 30, 300),
    fineTempo: clamp(toNumber(source.fineTempo, initialState.fineTempo), -6.75, 6.75)
  };
}

export function applyPersistedState(baseState: RootState, rawPersistedState: unknown): RootState {
  const normalized = normalizePersistedState(rawPersistedState);
  return {
    ...baseState,
    ...normalized
  };
}

export const persistMigrate: PersistMigrate = async (
  state: ReduxPersistedState,
  currentVersion: number
): Promise<ReduxPersistedState> => {
  void currentVersion;

  if (!isRecord(state)) {
    return state;
  }

  const normalized = normalizePersistedState(state);
  const persistMeta = isRecord(state._persist)
    ? state._persist
    : { version: STATE_MIGRATION_VERSION, rehydrated: false };

  return {
    ...normalized,
    _persist: persistMeta
  };
};
