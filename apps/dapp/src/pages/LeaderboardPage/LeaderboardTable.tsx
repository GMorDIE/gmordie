import { Address } from "../../components/Address";
import { useWallet } from "../../lib/WalletContext";
import { copyToClipboard } from "../../lib/copyToClipboard";
import { LeaderboardUserRow } from "./LeaderBoardUserRow";
import {
  BodyCell,
  LEADERBOARD_DEFAULT_SORT,
  HeaderCell,
  LeaderboardSort,
  LEADERBOARD_PAGING_LIMIT,
  SortIndicator,
  BodyRow,
} from "./LeaderboardShared";
import { LeaderboardAccount, useLeaderboard } from "./useLeaderboard";
import { SunIcon } from "@heroicons/react/solid";
import Identicon from "@polkadot/react-identicon";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";

export const LeaderboardTable = () => {
  const [sort, setSort] = useState<LeaderboardSort>(LEADERBOARD_DEFAULT_SORT);
  const leaderboard = useLeaderboard(sort.orderBy, sort.ascending);

  const {
    error,
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = leaderboard;

  const { avatar, address } = useWallet();

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
    rootMargin: "400px",
    threshold: 1,
  });

  useEffect(() => {
    if (isFetching || isFetchingNextPage || !hasNextPage) return;
    if (intersection && intersection.intersectionRatio === 1) fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    intersection,
    isFetching,
    isFetchingNextPage,
  ]);

  const handleAccountClick = useCallback(
    (id: string) => () => {
      copyToClipboard(id);
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
            {address && (
              <LeaderboardUserRow address={address} avatar={avatar} />
            )}
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.accounts?.map(
                  ({ id, receivedGMGN, sentGMGN, balanceGMGN }, j) => (
                    <BodyRow
                      key={id}
                      className={id === address ? "text-salmon-500" : ""}
                    >
                      <BodyCell className="text-center">
                        {i * LEADERBOARD_PAGING_LIMIT + j + 1}
                      </BodyCell>
                      <BodyCell
                        className="text-left cursor-pointer"
                        onClick={handleAccountClick(id)}
                      >
                        <div className="flex align-middle gap-2 ">
                          {id === address && avatar ? (
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
                    </BodyRow>
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
