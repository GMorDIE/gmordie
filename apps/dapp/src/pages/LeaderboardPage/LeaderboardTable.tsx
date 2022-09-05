import { Address } from "../../components/Address";
import { useWallet } from "../../lib/WalletContext";
import { LeaderboardAccount, useLeaderboard } from "./useLeaderboard";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { encodeAddress } from "@polkadot/util-crypto";
import clsx from "clsx";
import {
  DetailedHTMLProps,
  TdHTMLAttributes,
  ThHTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from "react";

type LeaderboardSort = {
  orderBy: keyof LeaderboardAccount;
  ascending: boolean;
};
const DEFAULT_SORT: LeaderboardSort = {
  orderBy: "sentGMGN",
  ascending: false,
};

type HeaderCellProps = DetailedHTMLProps<
  ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

const HeaderCell = (props: HeaderCellProps) => (
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

const BodyCell = (props: BodyCellProps) => (
  <th
    {...props}
    className={clsx("py-2 px-4 whitespace-nowrap", props.className)}
  />
);

type SortIndicatorProps = LeaderboardSort & {
  field: keyof LeaderboardAccount;
};
const SortIndicator = (props: SortIndicatorProps) => {
  if (props.field === props.orderBy)
    return props.ascending ? (
      <ChevronUpIcon className="inline w-8 h-8 mr-[-6px]" />
    ) : (
      <ChevronDownIcon className="inline w-8 h-8 mr-[-6px]" />
    );
  return <ChevronDownIcon className="inline w-8 h-8 mr-[-6px] invisible" />;
};

export const LeaderboardTable = () => {
  const [sort, setSort] = useState<LeaderboardSort>(DEFAULT_SORT);
  const { status, data, error, isFetching } = useLeaderboard(
    sort.orderBy,
    sort.ascending
  );

  const { account } = useWallet();
  const gmAddress = useMemo(
    () => (account?.address ? encodeAddress(account.address, 7013) : null),
    [account?.address]
  );

  const handleHeaderClick = useCallback(
    (field: keyof LeaderboardAccount) => () => {
      setSort((prev) => ({
        orderBy: field,
        ascending: field === prev.orderBy ? !prev.ascending : false,
      }));
    },
    []
  );

  console.log({ status, data, error, isFetching });

  if (error) return <div>error.toString()</div>;

  return (
    <table className="table-auto w-full">
      <thead>
        <HeaderCell className="text-center">Rank</HeaderCell>
        <HeaderCell className="text-left w-full">Account</HeaderCell>
        <HeaderCell
          className="text-center"
          onClick={handleHeaderClick("sentGMGN")}
        >
          Sent
          <SortIndicator field="sentGMGN" {...sort} />
        </HeaderCell>
        <HeaderCell
          className="text-center"
          onClick={handleHeaderClick("receivedGMGN")}
        >
          Received
          <SortIndicator field="receivedGMGN" {...sort} />
        </HeaderCell>
        <HeaderCell
          className="text-center"
          onClick={handleHeaderClick("balanceGMGN")}
        >
          Balance
          <SortIndicator field="balanceGMGN" {...sort} />
        </HeaderCell>
      </thead>
      <tbody>
        {data?.accounts.map(
          ({ id, receivedGMGN, sentGMGN, balanceGMGN }, i) => (
            <tr
              key={id}
              className={clsx(
                "bg-zinc-800 odd:bg-zinc-700 hover:bg-zinc-600 font-bold",
                id === gmAddress && "text-salmon-500"
              )}
            >
              <BodyCell className="text-center">{i + 1}</BodyCell>
              <BodyCell className="text-left" title={id}>
                <Address keep={6} address={id} />
              </BodyCell>
              <BodyCell className="text-center">{sentGMGN}</BodyCell>
              <BodyCell className="text-center">{receivedGMGN}</BodyCell>
              <BodyCell className="text-center">{balanceGMGN}</BodyCell>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
