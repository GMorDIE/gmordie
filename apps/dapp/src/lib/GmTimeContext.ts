import { useApi } from "./ApiContext";
import { provideContext } from "./provideContext";
import { useEffect, useMemo, useState } from "react";

const BLOCKS_PER_DAY = 690 * 4;

const useGmTimeProvider = () => {
  const [blockNumber, setBlockNumber] = useState<number>();
  const api = useApi();

  useEffect(() => {
    if (!api) return;

    const unsubscribePromise = api.rpc.chain.subscribeNewHeads(
      (blockHeader) => {
        setBlockNumber(blockHeader.number.toNumber());
      }
    );

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [api]);

  const { day, canGm, canGn, time, timeRatio } = useMemo(() => {
    if (!blockNumber) return {};

    const day = Math.floor(blockNumber / BLOCKS_PER_DAY) + 1;
    const timeRatio = (blockNumber % BLOCKS_PER_DAY) / BLOCKS_PER_DAY;
    const canGm = timeRatio < 0.25;
    const canGn = 0.5 <= timeRatio && timeRatio < 0.75;

    const HOURS_PER_DAY = 6.9;
    const SECONDS_PER_DAY = HOURS_PER_DAY * 60 * 60;

    const SECONDS_PER_HOUR = 60 * 60;

    const currSecondsInDay = timeRatio * SECONDS_PER_DAY;
    const h = Math.floor(currSecondsInDay / SECONDS_PER_HOUR);
    const m = Math.floor((currSecondsInDay % SECONDS_PER_HOUR) / 60);
    const s = Math.floor((currSecondsInDay % SECONDS_PER_HOUR) % 60);

    const time = new Date(0, 0, 0, h, m, s);

    return { day, timeRatio, canGm, canGn, time };
  }, [blockNumber]);

  return { blockNumber, day, timeRatio, canGm, canGn, time };
};

export const [GmTimeProvider, useGmTime] = provideContext(useGmTimeProvider);
