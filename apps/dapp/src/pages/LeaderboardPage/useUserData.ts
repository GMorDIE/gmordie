import { LeaderboardAccount } from "./useLeaderboard";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

const SUBSQUID_URL = "https://squid.subsquid.io/gmordie-frontend/v/v0/graphql";

type RequestResult = {
  accountById: Omit<LeaderboardAccount, "id">;
};

export const useUserStats = (address: string) => {
  return useQuery(["userstats", address], () => {
    return request<RequestResult>(
      SUBSQUID_URL,
      gql`
        query Accounts {
          accountById(id: "${address}") {
            balanceGMGN
            # burnedForGMGN
            # burnedForNothing
            receivedGMGN
            sentGMGN
          }
        }
      `
    );
  });
};
