import React from "react";

import Button from "components/button";
import { DownloadIcon } from "components/icons";

import type { RootState } from "domain/state/types";
import { buttonColor, darkGrey } from "theme/variables";

type SaveStateSnapshot = Pick<
  RootState,
  "instrumentState" | "patternLengths" | "steps" | "masterVolume" | "tempo" | "fineTempo"
> & {
  playing: boolean;
};

type SaveButtonProps = {
  storeState: SaveStateSnapshot;
  size?: number;
};

const styles = {
  button: {
    borderRadius: 4,
    backgroundColor: buttonColor,
    marginLeft: 5,
    marginRight: 5
  },
  icon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: darkGrey,
    transform: "scale(0.7)"
  }
};

const SaveButton = (props: SaveButtonProps) => {
  const { storeState, size = 50 } = props;

  const saveOpCounter = React.useRef(0);
  const handlePress = React.useCallback(() => {
    const opId = ++saveOpCounter.current;
    const fileSaverPromise = import("file-saver");

    const saveObj = {
      instrumentState: storeState.instrumentState,
      patternLengths: storeState.patternLengths,
      steps: storeState.steps,
      masterVolume: storeState.masterVolume,
      tempo: storeState.tempo,
      fineTempo: storeState.fineTempo
    };

    const saveString = JSON.stringify(saveObj);
    const saveData = new Blob([saveString], {
      type: "text/plain;charset=utf-8"
    });

    fileSaverPromise.then(res => {
      const { saveAs } = res.default;
      if (opId === saveOpCounter.current) {
        saveAs(saveData, "io808.json");
      }
    });
  }, [storeState]);

  return (
    <Button
      style={{ ...styles.button, width: size, height: size }}
      disabled={storeState.playing}
      onClick={handlePress}
    >
      <DownloadIcon
        title="Save"
        style={{ ...styles.icon, width: size, height: size }}
        size={size}
        color={darkGrey}
      />
    </Button>
  );
};

export default SaveButton;
