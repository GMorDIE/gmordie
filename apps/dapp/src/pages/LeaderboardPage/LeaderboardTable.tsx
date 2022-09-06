import { Address } from "../../components/Address";
import { ToastContent } from "../../components/ToastContent";
import { useWallet } from "../../lib/WalletContext";
import { LeaderboardAccount, useLeaderboard } from "./useLeaderboard";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
} from "@heroicons/react/solid";
import Identicon from "@polkadot/react-identicon";
import { encodeAddress } from "@polkadot/util-crypto";
import clsx from "clsx";
import {
  DetailedHTMLProps,
  Fragment,
  TdHTMLAttributes,
  ThHTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useIntersection } from "react-use";

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

const PAGING_LIMIT = 50;

export const LeaderboardTable = () => {
  const [sort, setSort] = useState<LeaderboardSort>(DEFAULT_SORT);
  const leaderboard = useLeaderboard(sort.orderBy, sort.ascending);

  const {
    error,
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = leaderboard;

  const { account } = useWallet();
  const avatar = useMemo(
    () => (account as { avatar?: string })?.avatar,
    [account]
  );
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

  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  useEffect(() => {
    if (isFetching || isFetchingNextPage || !hasNextPage) return;
    if (intersection && intersection.intersectionRatio > 0) fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    intersection,
    isFetching,
    isFetchingNextPage,
  ]);

  const handleAccountClick = useCallback(
    (id: string) => async () => {
      try {
        await navigator.clipboard.writeText(id);
        toast.custom((t) => (
          <ToastContent
            t={t}
            title="Copied to clipboard"
            description={<Address address={id} />}
            type="success"
          />
        ));
      } catch (err) {
        toast.custom((t) => (
          <ToastContent
            t={t}
            title="Failed to copy address"
            description={(err as Error)?.message}
            type="error"
          />
        ));
      }
    },
    []
  );

  if (error)
    return (
      <div className="bg-red-500 text-white p-2 py-4 rounded whitespace-pre-wrap text-lg font-medium">
        {error.toString()}
      </div>
    );

  return (
    <>
      {data && (
        <table className="table-auto w-full">
          <thead>
            <tr>
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
            </tr>
          </thead>
          <tbody>
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.accounts?.map(
                  ({ id, receivedGMGN, sentGMGN, balanceGMGN }, j) => (
                    <tr
                      key={id}
                      className={clsx(
                        "bg-zinc-800 odd:bg-zinc-700 hover:bg-zinc-600 font-bold",
                        id === gmAddress && "text-salmon-500"
                      )}
                    >
                      <BodyCell className="text-center">
                        {i * PAGING_LIMIT + j + 1}
                      </BodyCell>
                      <BodyCell
                        className="text-left cursor-pointer"
                        onClick={handleAccountClick(id)}
                      >
                        <div className="flex align-middle gap-2 ">
                          {id === gmAddress && avatar ? (
                            <img width={24} height={24} src={avatar} alt="" />
                          ) : (
                            <Identicon value={id} size={24} theme="polkadot" />
                          )}
                          <Address keep={6} address={id} />
                        </div>
                      </BodyCell>
                      <BodyCell className="text-center">{sentGMGN}</BodyCell>
                      <BodyCell className="text-center">
                        {receivedGMGN}
                      </BodyCell>
                      <BodyCell className="text-center">{balanceGMGN}</BodyCell>
                    </tr>
                  )
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
      <div
        ref={intersectionRef}
        className={clsx(
          isFetching || leaderboard.hasNextPage ? "visible" : "hidden",
          "flex w-full justify-center py-4 animate-spin"
        )}
      >
        <SunIcon className={clsx("w-8 h-8", isFetching && "animate-spin")} />
      </div>
    </>
  );
};
