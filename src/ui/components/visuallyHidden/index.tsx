// @ts-nocheck
import * as React from "react";

const style: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal"
};

export default function VisuallyHidden(props: {
  role?: React.AriaRole;
  children?: React.ReactNode;
}) {
  return (
    <span role={props.role} style={style}>
      {props.children}
    </span>
  );
}
