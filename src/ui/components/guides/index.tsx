// @ts-nocheck
import React from "react";

const baseGuideStyle: React.CSSProperties = {
  cursor: "default",
  position: "absolute",
  top: "50%",
  left: "50%"
};

const baseWrapperStyle: React.CSSProperties = {
  position: "absolute",
  width: "100%",
  height: "100%"
};

const Guides = React.memo(
  (props: {
    num?: number;
    distance: number;
    hideCount?: number;
    guideStyle?: React.CSSProperties;
    rotate?: boolean;
    values?: React.ReactNode[];
    offset?: number;
  }) => {
    let {
      num,
      distance,
      hideCount = 0,
      guideStyle = {},
      rotate = true,
      values,
      offset
    } = props;

    let useValues = false;
    if (values != null && values.length !== 0) {
      num = values.length;
      useValues = true;
    }

    const guides: React.ReactNode[] = [];
    let angleCounter = 360 / ((num ?? 0) + hideCount);
    let currentAngle = 180 + hideCount * angleCounter;

    if (offset) currentAngle += offset;

    const hideCountAdjust = hideCount > 1 ? hideCount - 1 : 0;
    const hideCompensation = (angleCounter * hideCountAdjust) / 2;

    for (let i = 0; i < (num ?? 0); i++) {
      let value: React.ReactNode = null;
      if (useValues) value = values![i];

      let transform = `translateX(-50%) translateY(-50%) rotate(${currentAngle}deg) translateY(-${distance}px)`;
      if (rotate === false) transform += ` rotate(-${currentAngle - hideCompensation}deg)`;

      guides.push(
        <div
          style={{
            ...guideStyle,
            ...baseGuideStyle,
            transform
          }}
          key={i}
        >
          {value}
        </div>
      );

      currentAngle += angleCounter;
    }
    return (
      <div
        style={{
          ...baseWrapperStyle,
          transform: `rotate(-${hideCompensation}deg)`
        }}
      >
        {guides}
      </div>
    );
  },
  () => true
);

export default Guides;
