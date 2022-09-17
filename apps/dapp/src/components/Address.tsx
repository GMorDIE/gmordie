import { SS58_PREFIX } from "../lib/constants";
import { formatAddressShort } from "../lib/formatAddressShort";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export type DisplayJudgement = "KnownGood" | "Reasonable" | "Unknown" | null;

const JudgementIcon = ({
  judgement,
  className,
}: {
  judgement: DisplayJudgement;
  className?: string;
}) => {
  let color = "";
  if (judgement === "KnownGood") color = "text-green-600";
  if (judgement === "Reasonable") color = "text-white";

  if (!color) return null;

  return <ShieldCheckIcon className={clsx(color, className)} />;
};

export const Address = ({
  address,
  keep = 6,
  display,
  judgement,
}: {
  address: string;
  keep?: number;
  display?: string;
  judgement: DisplayJudgement;
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1",
        !display && "font-mono"
      )}
      title={address}
    >
      <span>{display || formatAddressShort(address, keep, SS58_PREFIX)}</span>
      <JudgementIcon judgement={judgement} className="w-5 h-5" />
    </span>
  );
};
