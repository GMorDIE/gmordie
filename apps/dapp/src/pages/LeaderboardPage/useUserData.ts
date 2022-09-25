import { SUBSQUID_URL } from "../../lib/settings";
import { LeaderboardAccount } from "./useLeaderboard";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";

type RequestResult = {
  rankAccount: {
    rank: number;
    account: LeaderboardAccount;
  };
};

export const useUserData = (
  address?: string,
  sortBy: "sent" | "received" = "sent",
  ascending = false
) => {
  const orderDirection = useMemo(
    () => (ascending ? "ASC" : "DESC"),
    [ascending]
  );

  return useQuery(["userstats", address, sortBy, orderDirection], () => {
    if (!address) return null;
    return request<RequestResult>(
      SUBSQUID_URL,
      gql`
        query Accounts {
          rankAccount(id: "${address}", orderDirection: ${orderDirection}, rankedBy: ${sortBy}) {
            rank
            account {
              id
              display
              verified
              sentGMGN
              receivedGMGN
              judgement
            }
          }
        }
      `
    );
  });
};
