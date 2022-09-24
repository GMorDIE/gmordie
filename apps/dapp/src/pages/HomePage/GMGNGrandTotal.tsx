import { SocialLinks } from "../../components/SocialLinks";
import { useGmTime } from "../../lib/GmTimeContext";
import { useGMGNGrandTotal } from "../../lib/useGMGNGrandTotal";
import clsx from "clsx";
import { useEffect, useState } from "react";
import CountUp, { CountUpProps } from "react-countup";

export const GMGNGrandTotal = () => {
  const { time } = useGmTime();
  const [props, setProps] = useState<CountUpProps>();
  const { data, isLoading, error } = useGMGNGrandTotal();

  useEffect(() => {
    if (data)
      setProps((prev) => ({
        start: prev?.end ?? data.transfersConnection.totalCount,
        end: data.transfersConnection.totalCount,
      }));
  }, [data]);
  console.log({ time, isLoading, error, props });
  if (!time || isLoading) return null;
  //console.log({ data });
  return (
    <div
      className={clsx(
        "text-xl mb-4 font-medium text-center opacity-0 transition-opacity space-y-4 text-zinc-400",
        time && props && "opacity-100"
      )}
    >
      {!error && (
        <div>
          {props && <CountUp {...props} />} decentralized GMs &amp; GNs sent
        </div>
      )}
      <SocialLinks />
    </div>
  );
};
