import { LeaderboardAccount } from "./useLeaderboard";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { DetailedHTMLProps, TdHTMLAttributes, ThHTMLAttributes } from "react";

export type LeaderboardSort = {
  orderBy: keyof LeaderboardAccount;
  ascending: boolean;
};
export const LEADERBOARD_DEFAULT_SORT: LeaderboardSort = {
  orderBy: "sentGMGN",
  ascending: false,
};

export const LEADERBOARD_PAGING_LIMIT = 50;
type HeaderCellProps = DetailedHTMLProps<
  ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

export const HeaderCell = (props: HeaderCellProps) => (
  <th
    {...props}
    className={clsx(
      "bg-zinc-900 py-2 px-4 whitespace-nowrap",
      props.className,
      props.onClick && "cursor-pointer"
    )}
  >
    {props.children}
  </th>
);

type BodyCellProps = DetailedHTMLProps<
  TdHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

export const BodyCell = (props: BodyCellProps) => (
  <th
    {...props}
    className={clsx("py-2 px-4 whitespace-nowrap", props.className)}
  />
);

type SortIndicatorProps = LeaderboardSort & {
  field: keyof LeaderboardAccount;
};
export const SortIndicator = (props: SortIndicatorProps) => {
  if (props.field === props.orderBy)
    return props.ascending ? (
      <ChevronUpIcon className="inline w-8 h-8 mr-[-6px]" />
    ) : (
      <ChevronDownIcon className="inline w-8 h-8 mr-[-6px]" />
    );
  return <ChevronDownIcon className="inline w-8 h-8 mr-[-6px] invisible" />;
};
