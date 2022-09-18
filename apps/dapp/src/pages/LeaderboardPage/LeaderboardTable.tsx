import { Spinner } from "../../components/Spinner";
import { useSendPane } from "../../features/send/context";
import { useWallet } from "../../lib/WalletContext";
import { copyToClipboard } from "../../lib/copyToClipboard";
import {
  LEADERBOARD_DEFAULT_SORT,
  HeaderCell,
  LeaderboardSort,
  LEADERBOARD_PAGING_LIMIT,
  SortIndicator,
  LeaderboardRow,
} from "./LeaderboardShared";
import { LeaderboardAccount, useLeaderboard } from "./useLeaderboard";
import { useUserData } from "./useUserData";
import clsx from "clsx";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const userSortBy = useMemo(
    () => sort.orderBy.replace("GMGN", "") as "sent" | "received",
    [sort.orderBy]
  );

  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "10%",
    threshold: 0.9,
  });

  // we want to check only once for user's isFetched,
  // because in case of page refresh or direct page access, user might not be authenticated yet
  // we don't want authentication to hide the whole content
  const { data: user, isFetched: isUserFetched } = useUserData(
    address,
    userSortBy,
    sort.ascending
  );
  const [hasUserBeenFetched, setHasUserBeenFetched] = useState(isUserFetched);
  useEffect(() => {
    setHasUserBeenFetched((prev) => prev || isUserFetched);
  }, [isUserFetched]);

  useEffect(() => {
    if (isFetching || isFetchingNextPage || !hasNextPage) return;
    if (!hasUserBeenFetched) return;
    if (intersection && intersection.intersectionRatio >= 0.9) fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    intersection,
    isFetching,
    isFetchingNextPage,
    hasUserBeenFetched,
  ]);

  const { isOpen, sendToAddress } = useSendPane();
  const handleAccountClick = useCallback(
    (id?: string) => () => {
      if (!id) return false;
      if (isOpen) sendToAddress(id);
      else copyToClipboard(id);
      return false;
    },
    [isOpen, sendToAddress]
  );

  if (error)
    return (
      <div className="bg-red-500 text-white p-2 py-4 rounded whitespace-pre-wrap text-lg font-medium">
        {error.toString()}
      </div>
    );

  return (
    <>
      {data && hasUserBeenFetched && (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <HeaderCell className="text-center rounded-tl">Rank</HeaderCell>
              <HeaderCell className="text-left w-full">Account</HeaderCell>
              <HeaderCell
                className="text-center"
                onClick={handleHeaderClick("sentGMGN")}
              >
                Sent
                <SortIndicator field="sentGMGN" {...sort} />
              </HeaderCell>
              <HeaderCell
                className="text-center rounded-tr"
                onClick={handleHeaderClick("receivedGMGN")}
              >
                Received
                <SortIndicator field="receivedGMGN" {...sort} />
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {/* {address && (
              <LeaderboardUserRow
                address={address}
                avatar={avatar}
                sortBy={userSortBy}
                ascending={sort.ascending}
              />
            )} */}
            {user?.rankAccount.account && (
              <LeaderboardRow
                {...user.rankAccount.account}
                address={address}
                avatar={avatar}
                rank={user.rankAccount.rank}
                onClick={handleAccountClick(address)}
                className="border-b-salmon-500 border-b-2"
              />
            )}
            {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.accounts?.map((acc, j) => (
                  <LeaderboardRow
                    key={acc.id}
                    {...acc}
                    avatar={avatar}
                    address={address}
                    rank={i * LEADERBOARD_PAGING_LIMIT + j + 1}
                    onClick={handleAccountClick(acc.id)}
                  />
                ))}
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
        <Spinner className={clsx("w-8 h-8 animate-spin")} />
      </div>
    </>
  );
};
