import React from "react";

import Button from "components/button";
import { UploadIcon } from "components/icons";

import { PERSISTANCE_FILTER } from "store-constants";
import type { PersistedStateInput } from "domain/state/types";
import { buttonColor, darkGrey } from "theme/variables";

type LoadButtonProps = {
  playing: boolean;
  onLoadedState: (loadedState: PersistedStateInput) => void;
  size?: number;
};

export function validateLoadedState(state: unknown): state is PersistedStateInput {
  if (state == null || typeof state !== "object" || Array.isArray(state)) {
    return false;
  }

  let output = true;

  for (let stateProperty in state) {
    if (Object.prototype.hasOwnProperty.call(state, stateProperty)) {
      if (!(PERSISTANCE_FILTER as readonly string[]).includes(stateProperty)) output = false;
    }
  }
  return output;
}

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
    transform: "scale(0.8)"
  },
  input: {
    display: "none"
  }
};

const LoadButton = (props: LoadButtonProps) => {
  const { playing, onLoadedState, size = 50 } = props;

  const fileUploadRef = React.useRef<HTMLInputElement>(null);

  const handlePress = React.useCallback(() => {
    const fileUpload = fileUploadRef.current;
    if (fileUpload != null) {
      fileUpload.click();
    }
  }, []);

  const handleFileChange = React.useCallback(() => {
    const fileUpload = fileUploadRef.current;
    if (fileUpload != null) {
      const files = fileUpload.files;
      if (files != null && files.length === 1) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const fileContent =
              typeof reader.result === "string"
                ? reader.result
                : new TextDecoder().decode(reader.result ?? new ArrayBuffer(0));
            const loadedState = JSON.parse(fileContent);
            if (validateLoadedState(loadedState)) {
              onLoadedState(loadedState);
              return;
            }
            window.alert("Sorry, the given io808 save is invalid.");
          } catch {
            window.alert("Sorry, the given io808 save is invalid.");
          }
        };

        reader.readAsText(file);
      } else {
        window.alert("Sorry, please only upload one io808 save at a time.");
      }
    } else {
      window.alert("Sorry, an unknown error occured while uploading your save.");
    }
  }, [onLoadedState]);

  return (
    <Button
      style={{ ...styles.button, width: size, height: size }}
      disabled={playing}
      onClick={handlePress}
    >
      <input
        ref={fileUploadRef}
        type="file"
        style={styles.input}
        onChange={handleFileChange}
      />
      <UploadIcon
        title="Load"
        style={{ ...styles.icon, width: size, height: size }}
        size={size}
        color={darkGrey}
      />
    </Button>
  );
};

export default LoadButton;
