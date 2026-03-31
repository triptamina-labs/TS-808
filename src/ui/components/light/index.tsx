// @ts-nocheck
import React from "react";

import { lightActive, lightInactive } from "theme/variables";

const size = 18;
const innerPadding = 4;

const baseInnerStyle: React.CSSProperties = {
  position: "absolute",
  left: innerPadding,
  right: innerPadding,
  top: innerPadding,
  bottom: innerPadding,
  borderRadius: "50%"
};

const styles = {
  outer: {
    position: "relative" as const,
    backgroundColor: "rgba(0,0,0,0.4)",
    width: size,
    height: size,
    borderRadius: "50%",
    pointerEvents: "none" as const
  },
  innerInactive: {
    ...baseInnerStyle,
    backgroundColor: lightInactive
  },
  innerActive: {
    ...baseInnerStyle,
    backgroundColor: lightActive,
    transition: "opacity 0.1s"
  }
};

export default function Light(props: { active: boolean }) {
  const { active } = props;
  return (
    <div style={styles.outer}>
      <div style={styles.innerInactive} />
      <div style={{ ...styles.innerActive, opacity: active ? 1 : 0 }} />
    </div>
  );
}
