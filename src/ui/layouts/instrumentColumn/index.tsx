import React from "react";

export default function InstrumentColumnLayout(props: {
  labels: React.ReactNode[];
  children?: React.ReactNode;
  width?: number;
  height?: number;
}) {
  const { labels, children, width = 110, height = 450 } = props;

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "stretch",
      justifyContent: "space-between",

      width,
      height,
      padding: 4
    },

    knobsWrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center"
    },

    controlSpacing: {
      marginBottom: 5
    },

    labelWrapper: {
      width: "100%",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "stretch"
    },

    labelSpacing: {
      marginTop: 8
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.knobsWrapper}>
        {React.Children.map(children, (child, index) => (
          <div key={index} style={styles.controlSpacing}>
            {child}
          </div>
        ))}
      </div>
      <div style={styles.labelWrapper}>
        {labels.map((label, index) => (
          <div key={index} style={styles.labelSpacing}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
