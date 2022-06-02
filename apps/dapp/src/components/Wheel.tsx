import clsx from "clsx";
import { CSSProperties, useMemo } from "react";

import { ReactComponent as SvgWheel } from "../assets/wheel.svg";
import { useGmTime } from "../lib/GmTimeContext";

type WheelProps = {
  className?: string;
};

export const Wheel = ({ className }: WheelProps) => {
  const { timeRatio } = useGmTime();

  const wheelStyle = useMemo(
    () =>
      timeRatio === undefined
        ? undefined
        : ({
            // original svg has top midway of GM, our base top must be the start of night
            transform: `rotate(${45 - Math.round(timeRatio * 360)}deg)`,
          } as CSSProperties),
    [timeRatio]
  );

  return (
    <div
      className={clsx(
        "flex overflow-hidden  flex-col justify-center items-center w-64 h-64 rounded-full",
        className
      )}
    >
      {wheelStyle && (
        <SvgWheel className="transition-transform" style={wheelStyle} />
      )}
    </div>
  );
};
