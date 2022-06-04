import clsx from "clsx";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { ReactComponent as SvgWheel } from "../assets/wheel.svg";
import { useGmTime } from "../lib/GmTimeContext";

type WheelProps = {
  className?: string;
};

export const Wheel = ({ className }: WheelProps) => {
  const { timeRatio } = useGmTime();

  const rotate = useMotionValue(0);
  const degreesPerTick = useRef(8);
  const refIsLastTurn = useRef(false);

  const [allowEndSpin, setAllowEndSpin] = useState(false);
  useEffect(() => {
    // disk must spin at least 1 second
    const timeout = setTimeout(() => setAllowEndSpin(true), 0);

    return () => clearTimeout(timeout);
  });

  const targetRotate = useMemo(
    () =>
      timeRatio === undefined || !allowEndSpin
        ? undefined
        : Math.round((360 + 45 - timeRatio * 360) % 360),
    [timeRatio, allowEndSpin]
  );

  useEffect(() => {
    if (degreesPerTick.current === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      rotate.set(targetRotate!);
    } else {
      const interval = setInterval(() => {
        // rotate
        const current = rotate.get();
        const target = (360 + current - degreesPerTick.current) % 360;
        rotate.set(target);

        // target reached, exit
        if (degreesPerTick.current === 1 && targetRotate === target) {
          console.log("finished");
          clearInterval(interval);
        }

        // check for end of turn
        if (
          targetRotate !== undefined &&
          !refIsLastTurn.current &&
          (target < targetRotate || target > current) &&
          (targetRotate <= current || target > current)
        ) {
          console.log("start last turn");
          // start last turn
          refIsLastTurn.current = true;
        } else if (refIsLastTurn.current) {
          // slow down while approaching from target
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const degreesLeft = (360 + current - targetRotate!) % 360;
          if (degreesPerTick.current === 2 && degreesLeft < 10)
            degreesPerTick.current = 1;
          else if (degreesPerTick.current === 3 && degreesLeft < 25)
            degreesPerTick.current = 2;
          else if (degreesPerTick.current === 4 && degreesLeft < 50)
            degreesPerTick.current = 3;
          else if (degreesPerTick.current === 6 && degreesLeft < 90)
            degreesPerTick.current = 4;
          else if (degreesPerTick.current === 8 && degreesLeft < 140)
            degreesPerTick.current = 6;
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [rotate, targetRotate]);

  return (
    <div className={clsx("w-64 h-64 ", className)}>
      <motion.div
        style={{ rotate }}
        className="flex overflow-hidden  w-full h-full flex-col justify-center items-center rounded-full"
      >
        <SvgWheel className="transition-transform" />
      </motion.div>
    </div>
  );
};
