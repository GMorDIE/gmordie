import { useInfiniteQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";

const SUBSQUID_URL = "https://squid.subsquid.io/gmordie-frontend/v/v0/graphql";

export type LeaderboardAccount = {
  id: string;
  receivedGMGN: string;
  sentGMGN: string;
  balanceGMGN: string;
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
            balanceGMGN
            burnedForGMGN
            burnedForNothing
            receivedGMGN
            sentGMGN
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
