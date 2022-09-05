import { useQuery } from "@tanstack/react-query";
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
  ascending = false
) => {
  const orderBy = useMemo(
    () => `${sortBy}_${ascending ? "ASC" : "DESC"}`,
    [ascending, sortBy]
  );

  return useQuery(["leaderboard", sortBy, ascending], async () => {
    const result = await request<RequestResult>(
      SUBSQUID_URL,
      gql`
        query Accounts {
          accounts(orderBy: ${orderBy}) {
            id
            balanceGMGN
            # balanceFREN
            # balanceGM
            # balanceGN
            # burnedForGM
            burnedForGMGN
            # burnedForGN
            burnedForNothing
            # burnedTotal
            # receivedGM
            receivedGMGN
            # receivedGN
            # sentGM
            sentGMGN
            # sentGN
          }
        }
      `
    );
    console.log(result);
    return result;
  });
};
