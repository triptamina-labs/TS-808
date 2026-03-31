export const ACCENT = 0 as const;
export const BASS_DRUM = 1 as const;
export const SNARE_DRUM = 2 as const;
export const LOW_CONGA_LOW_TOM = 3 as const;
export const MID_CONGA_MID_TOM = 4 as const;
export const HI_CONGA_HI_TOM = 5 as const;
export const CLAVES_RIMSHOT = 6 as const;
export const MARACAS_HANDCLAP = 7 as const;
export const COWBELL = 8 as const;
export const CYMBAL = 9 as const;
export const OPEN_HIHAT = 10 as const;
export const CLSD_HIHAT = 11 as const;

export type InstrumentId =
  | typeof ACCENT
  | typeof BASS_DRUM
  | typeof SNARE_DRUM
  | typeof LOW_CONGA_LOW_TOM
  | typeof MID_CONGA_MID_TOM
  | typeof HI_CONGA_HI_TOM
  | typeof CLAVES_RIMSHOT
  | typeof MARACAS_HANDCLAP
  | typeof COWBELL
  | typeof CYMBAL
  | typeof OPEN_HIHAT
  | typeof CLSD_HIHAT;

export const MODE_PATTERN_CLEAR = 0 as const;
export const MODE_FIRST_PART = 1 as const;
export const MODE_SECOND_PART = 2 as const;
export const MODE_MANUAL_PLAY = 3 as const;
export const MODE_RHYTHM_TRACK_PLAY = 4 as const;
export const MODE_RHYTHM_TRACK_COMPOSE = 5 as const;

export type Mode =
  | typeof MODE_PATTERN_CLEAR
  | typeof MODE_FIRST_PART
  | typeof MODE_SECOND_PART
  | typeof MODE_MANUAL_PLAY
  | typeof MODE_RHYTHM_TRACK_PLAY
  | typeof MODE_RHYTHM_TRACK_COMPOSE;

export const FIRST_PART = "FIRST_PART" as const;
export const SECOND_PART = "SECOND_PART" as const;
export type Part = typeof FIRST_PART | typeof SECOND_PART;

export const A_VARIATION = "A_VARIATION" as const;
export const B_VARIATION = "B_VARIATION" as const;
export const BOTH_VARIATIONS = "BOTH_VARIATIONS" as const;
export type Variation = typeof A_VARIATION | typeof B_VARIATION;
export type VariationLight = Variation | typeof BOTH_VARIATIONS | null;

export const AUTO_FILL_IN_MAPPING = [null, 16, 12, 8, 4, 2] as const;
export type AutoFillInPosition = 0 | 1 | 2 | 3 | 4 | 5;

export const MODE_TO_PART_MAPPING: Record<
  typeof MODE_FIRST_PART | typeof MODE_SECOND_PART,
  Part
> = {
  [MODE_FIRST_PART]: FIRST_PART,
  [MODE_SECOND_PART]: SECOND_PART
};

export const UNIMPLEMENTED_MODES = [MODE_RHYTHM_TRACK_PLAY, MODE_RHYTHM_TRACK_COMPOSE] as const;

export const PERSISTANCE_FILTER = [
  "instrumentState",
  "patternLengths",
  "steps",
  "masterVolume",
  "tempo",
  "fineTempo"
] as const;

export const APP_STORAGE_KEY = "TS-808" as const;

export const ALL_INSTRUMENTS: InstrumentId[] = [
  ACCENT,
  BASS_DRUM,
  SNARE_DRUM,
  LOW_CONGA_LOW_TOM,
  MID_CONGA_MID_TOM,
  HI_CONGA_HI_TOM,
  CLAVES_RIMSHOT,
  MARACAS_HANDCLAP,
  COWBELL,
  CYMBAL,
  OPEN_HIHAT,
  CLSD_HIHAT
];
