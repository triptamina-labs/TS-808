import { shallowEqual, useDispatch, useSelector } from "react-redux";
import React from "react";
import type { RootState, PersistedStateInput } from "domain/state/types";
import type { AppDispatch } from "store";

// Action Creators
import { onStateLoad, onReset } from "actionCreators";

// Components
import SaveButton from "components/saveButton";
import LoadButton from "components/loadButton";
import Button from "components/button";

import { buttonColor, darkGrey } from "theme/variables";
import { labelGreyLarge } from "theme/mixins";

type SizedButtonProps = {
  size?: number;
};

type SaveStateSnapshot = Pick<
  RootState,
  "instrumentState" | "patternLengths" | "steps" | "masterVolume" | "tempo" | "fineTempo"
> & {
  playing: boolean;
};

const selectSaveStateSnapshot = (state: RootState): SaveStateSnapshot => ({
  instrumentState: state.instrumentState,
  patternLengths: state.patternLengths,
  steps: state.steps,
  masterVolume: state.masterVolume,
  tempo: state.tempo,
  fineTempo: state.fineTempo,
  playing: state.playing
});

export const ConnectedSaveButton = (props: SizedButtonProps) => {
  const storeState = useSelector(selectSaveStateSnapshot, shallowEqual);
  return <SaveButton storeState={storeState} {...props} />;
};

export const ConnectedLoadButton = (props: SizedButtonProps) => {
  const playing = useSelector((state: RootState) => state.playing);

  const dispatch = useDispatch<AppDispatch>();
  const onLoadedState = React.useCallback(
    (loadedState: PersistedStateInput) => dispatch(onStateLoad(loadedState)),
    [dispatch]
  );

  return <LoadButton {...props} playing={playing} onLoadedState={onLoadedState} />;
};

export const ConnectedResetButton = (props: SizedButtonProps) => {
  const disabled = useSelector((state: RootState) => state.playing);

  const dispatch = useDispatch<AppDispatch>();
  const onClick = React.useCallback(() => {
    if (window.confirm("Are you sure you want to reset your sequencer?")) {
      dispatch(onReset());
    }
  }, [dispatch]);

  const { size = 35, ...rest } = props;

  return (
    <Button
      {...rest}
      style={
        {
          ...labelGreyLarge,
          color: darkGrey,
          width: "auto",
          height: size,
          padding: 7,
          borderRadius: 4,
          backgroundColor: buttonColor,
          marginLeft: 5,
          marginRight: 5,
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        } as React.CSSProperties
      }
      onClick={onClick}
      disabled={disabled}
    >
      Reset
    </Button>
  );
};
