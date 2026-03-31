import type { InstrumentId, Mode } from "store-constants";
import type {
  AppAction,
  AutoFillInChangeAction,
  BasicVariationChangeAction,
  BlinkTickAction,
  ClearDownAction,
  ClearDragDropAction,
  ClearDragEndAction,
  ClearDragEnterAction,
  ClearDragExitAction,
  ClearDragStartAction,
  ClearUpAction,
  FineTempoChangeAction,
  IFVariationChangeAction,
  InstrumentChangeAction,
  InstrumentTrackChangeAction,
  MasterVolumeChangeAction,
  ModeChangeAction,
  PreScaleChangeAction,
  ResetAction,
  StartStopButtonClickAction,
  StateLoadAction,
  StepButtonClickAction,
  TapButtonClickAction,
  TempoChangeAction,
  TickAction
} from "actionTypes";
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
  PRE_SCALE_CHANGE,
  RESET,
  START_STOP_BUTTON_CLICK,
  STATE_LOAD,
  STEP_BUTTON_CLICK,
  TAP_BUTTON_CLICK,
  TEMPO_CHANGE,
  TICK
} from "actionTypes";
import type { InstrumentControls, PersistedStateInput } from "domain/state/types";

export const onAutoFillInChange = (value: number): AutoFillInChangeAction => ({
  type: AUTO_FILL_IN_CHANGE,
  payload: value
});

export const onFineTempoChange = (value: number): FineTempoChangeAction => ({
  type: FINE_TEMPO_CHANGE,
  payload: value
});

export const onInstrumentTrackChange = (
  value: InstrumentId
): InstrumentTrackChangeAction => ({
  type: INSTRUMENT_TRACK_CHANGE,
  payload: value
});

export const onModeChange = (value: Mode): ModeChangeAction => ({
  type: MODE_CHANGE,
  payload: value
});

export const onTempoChange = (value: number): TempoChangeAction => ({
  type: TEMPO_CHANGE,
  payload: value
});

export const onInstrumentChange = (
  type: InstrumentId,
  controlName: keyof InstrumentControls,
  value: number
): InstrumentChangeAction => ({
  type: INSTRUMENT_CHANGE,
  payload: { type, controlName, value }
});

export const onMasterVolumeChange = (value: number): MasterVolumeChangeAction => ({
  type: MASTER_VOLUME_CHANGE,
  payload: value
});

export const onBasicVariationChange = (
  position: number
): BasicVariationChangeAction => ({
  type: BASIC_VARIATION_CHANGE,
  payload: position
});

export const onStartStopButtonClick = (): StartStopButtonClickAction => ({
  type: START_STOP_BUTTON_CLICK
});

export const onIFVariationChange = (
  position: number
): IFVariationChangeAction => ({
  type: IF_VARIATION_CHANGE,
  payload: position
});

export const onTapButtonClick = (): TapButtonClickAction => ({
  type: TAP_BUTTON_CLICK
});

export const onPreScaleChange = (position: number): PreScaleChangeAction => ({
  type: PRE_SCALE_CHANGE,
  payload: position
});

export const onStepButtonClick = (index: number): StepButtonClickAction => ({
  type: STEP_BUTTON_CLICK,
  payload: index
});

export const onTick = (): TickAction => ({
  type: TICK
});

export const onBlinkTick = (): BlinkTickAction => ({
  type: BLINK_TICK
});

export const onClearDown = (): ClearDownAction => ({
  type: CLEAR_DOWN
});

export const onClearUp = (): ClearUpAction => ({
  type: CLEAR_UP
});

export const onClearDragStart = (): ClearDragStartAction => ({
  type: CLEAR_DRAG_START
});

export const onClearDragEnd = (): ClearDragEndAction => ({
  type: CLEAR_DRAG_END
});

export const onClearDragDrop = (length: number): ClearDragDropAction => ({
  type: CLEAR_DRAG_DROP,
  payload: length
});

export const onStateLoad = (loadedState: PersistedStateInput): StateLoadAction => ({
  type: STATE_LOAD,
  payload: loadedState
});

export const onClearDragEnter = (length: number): ClearDragEnterAction => ({
  type: CLEAR_DRAG_ENTER,
  payload: length
});

export const onClearDragExit = (): ClearDragExitAction => ({
  type: CLEAR_DRAG_EXIT
});

export const onReset = (): ResetAction => ({
  type: RESET
});

export type ActionCreatorResult = AppAction;
