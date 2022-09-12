import { useWallet } from "../../lib/WalletContext";
import { SUBSQUID_URL } from "../../lib/settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";

export type LeaderboardAccount = {
  id: string;
  display: string;
  verified: boolean;
  receivedGMGN: string;
  sentGMGN: string;
};

type RequestResult = {
  accounts: LeaderboardAccount[];
};

export const useLeaderboard = (
  sortBy: keyof LeaderboardAccount = "sentGMGN",
  ascending = false,
  limit = 50
) => {
  const orderBy = useMemo(
    () => `${sortBy}_${ascending ? "ASC" : "DESC"}`,
    [ascending, sortBy]
  );

  return useInfiniteQuery(
    ["leaderboard", orderBy, limit],
    ({ pageParam = 0 }) => {
      return request<RequestResult>(
        SUBSQUID_URL,
        gql`
        query Accounts {
          accounts(orderBy: ${orderBy}, limit: ${limit}, offset: ${pageParam}) {
            id
            display
            verified
            sentGMGN
            receivedGMGN
          }
        }
      `
      );
    },
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.accounts.length === limit ? pages.length * limit : null,
    }
  );
};
