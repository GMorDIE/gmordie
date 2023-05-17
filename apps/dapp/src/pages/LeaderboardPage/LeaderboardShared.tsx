import { Address, DisplayJudgement } from "../../components/Address";
import { LeaderboardAccount } from "./useLeaderboard";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Identicon from "@polkadot/react-identicon";
import clsx from "clsx";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

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

type BodyRowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

export const BodyRow = (props: BodyRowProps) => (
  <tr
    {...props}
    className={clsx(
      "bg-zinc-700 odd:bg-zinc-800 hover:bg-zinc-600 font-bold",
      props.className
    )}
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

type LeaderboardRowProps = {
  id: string;
  address?: string;
  rank: number;
  avatar?: string;
  display: string;
  judgement: DisplayJudgement;
  sentGMGN: string;
  receivedGMGN: string;
  className?: string;
  onClick?: () => void;
};

export const LeaderboardRow = ({
  id, // account for the row
  address, // current user
  rank,
  avatar,
  display,
  judgement,
  sentGMGN,
  receivedGMGN,
  onClick,
  className,
}: LeaderboardRowProps) => (
  <BodyRow
    key={id}
    className={clsx(id === address ? "text-salmon-500" : "", className)}
  >
    <BodyCell className="text-center">{rank}</BodyCell>
    <BodyCell className="text-left cursor-pointer" onClick={onClick}>
      <div className="flex align-middle gap-2 ">
        {id === address && avatar ? (
          <img width={24} height={24} src={avatar} alt="" />
        ) : (
          <Identicon value={id} size={24} theme="polkadot" />
        )}
        <Address
          keep={6}
          address={id}
          display={display}
          judgement={judgement}
        />
      </div>
    </BodyCell>
    <BodyCell className="text-center">{sentGMGN}</BodyCell>
    <BodyCell className="text-center">{receivedGMGN}</BodyCell>
  </BodyRow>
);
