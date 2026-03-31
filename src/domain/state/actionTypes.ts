import type { InstrumentId, Mode } from "store-constants";
import type { InstrumentControls, PersistedStateInput } from "domain/state/types";

export const INSTRUMENT_CHANGE = "INSTRUMENT_CHANGE" as const;
export const MASTER_VOLUME_CHANGE = "MASTER_VOLUME_CHANGE" as const;
export const BASIC_VARIATION_CHANGE = "BASIC_VARIATION_CHANGE" as const;
export const START_STOP_BUTTON_CLICK = "START_STOP_BUTTON_CLICK" as const;
export const IF_VARIATION_CHANGE = "IF_VARIATION_CHANGE" as const;
export const TAP_BUTTON_CLICK = "TAP_BUTTON_CLICK" as const;
export const PRE_SCALE_CHANGE = "PRE_SCALE_CHANGE" as const;
export const STEP_BUTTON_CLICK = "STEP_BUTTON_CLICK" as const;
export const AUTO_FILL_IN_CHANGE = "AUTO_FILL_IN_CHANGE" as const;
export const FINE_TEMPO_CHANGE = "FINE_TEMPO_CHANGE" as const;
export const INSTRUMENT_TRACK_CHANGE = "INSTRUMENT_TRACK_CHANGE" as const;
export const MODE_CHANGE = "MODE_CHANGE" as const;
export const TEMPO_CHANGE = "TEMPO_CHANGE" as const;

export const TICK = "TICK" as const;
export const BLINK_TICK = "BLINK_TICK" as const;

export const CLEAR_DOWN = "CLEAR_DOWN" as const;
export const CLEAR_UP = "CLEAR_UP" as const;
export const CLEAR_DRAG_START = "CLEAR_DRAG_START" as const;
export const CLEAR_DRAG_END = "CLEAR_DRAG_END" as const;
export const CLEAR_DRAG_ENTER = "CLEAR_DRAG_ENTER" as const;
export const CLEAR_DRAG_EXIT = "CLEAR_DRAG_EXIT" as const;
export const CLEAR_DRAG_DROP = "CLEAR_DRAG_DROP" as const;

export const STATE_LOAD = "STATE_LOAD" as const;
export const RESET = "RESET" as const;

export interface InstrumentChangeAction {
  type: typeof INSTRUMENT_CHANGE;
  payload: {
    type: InstrumentId;
    controlName: keyof InstrumentControls;
    value: number;
  };
}

export interface MasterVolumeChangeAction {
  type: typeof MASTER_VOLUME_CHANGE;
  payload: number;
}

export interface BasicVariationChangeAction {
  type: typeof BASIC_VARIATION_CHANGE;
  payload: number;
}

export interface StartStopButtonClickAction {
  type: typeof START_STOP_BUTTON_CLICK;
}

export interface IFVariationChangeAction {
  type: typeof IF_VARIATION_CHANGE;
  payload: number;
}

export interface TapButtonClickAction {
  type: typeof TAP_BUTTON_CLICK;
}

export interface PreScaleChangeAction {
  type: typeof PRE_SCALE_CHANGE;
  payload: number;
}

export interface StepButtonClickAction {
  type: typeof STEP_BUTTON_CLICK;
  payload: number;
}

export interface AutoFillInChangeAction {
  type: typeof AUTO_FILL_IN_CHANGE;
  payload: number;
}

export interface FineTempoChangeAction {
  type: typeof FINE_TEMPO_CHANGE;
  payload: number;
}

export interface InstrumentTrackChangeAction {
  type: typeof INSTRUMENT_TRACK_CHANGE;
  payload: InstrumentId;
}

export interface ModeChangeAction {
  type: typeof MODE_CHANGE;
  payload: Mode;
}

export interface TempoChangeAction {
  type: typeof TEMPO_CHANGE;
  payload: number;
}

export interface TickAction {
  type: typeof TICK;
}

export interface BlinkTickAction {
  type: typeof BLINK_TICK;
}

export interface ClearDownAction {
  type: typeof CLEAR_DOWN;
}

export interface ClearUpAction {
  type: typeof CLEAR_UP;
}

export interface ClearDragStartAction {
  type: typeof CLEAR_DRAG_START;
}

export interface ClearDragEndAction {
  type: typeof CLEAR_DRAG_END;
}

export interface ClearDragEnterAction {
  type: typeof CLEAR_DRAG_ENTER;
  payload: number;
}

export interface ClearDragExitAction {
  type: typeof CLEAR_DRAG_EXIT;
}

export interface ClearDragDropAction {
  type: typeof CLEAR_DRAG_DROP;
  payload: number;
}

export interface StateLoadAction {
  type: typeof STATE_LOAD;
  payload: PersistedStateInput;
}

export interface ResetAction {
  type: typeof RESET;
}

export type AppAction =
  | InstrumentChangeAction
  | MasterVolumeChangeAction
  | BasicVariationChangeAction
  | StartStopButtonClickAction
  | IFVariationChangeAction
  | TapButtonClickAction
  | PreScaleChangeAction
  | StepButtonClickAction
  | AutoFillInChangeAction
  | FineTempoChangeAction
  | InstrumentTrackChangeAction
  | ModeChangeAction
  | TempoChangeAction
  | TickAction
  | BlinkTickAction
  | ClearDownAction
  | ClearUpAction
  | ClearDragStartAction
  | ClearDragEndAction
  | ClearDragEnterAction
  | ClearDragExitAction
  | ClearDragDropAction
  | StateLoadAction
  | ResetAction;

export type ClearReducerActionType =
  | typeof CLEAR_DOWN
  | typeof CLEAR_UP
  | typeof CLEAR_DRAG_START
  | typeof CLEAR_DRAG_END;
