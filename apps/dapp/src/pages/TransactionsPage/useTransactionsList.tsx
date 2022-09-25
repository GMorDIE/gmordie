import { DisplayJudgement } from "../../components/Address";
import { SUBSQUID_URL } from "../../lib/settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { useMemo } from "react";

export type HistoryAccount = {
  id: string;
  display: string;
  judgement: DisplayJudgement;
};
export type HistoryTx = {
  id: string;
  timestamp: string;
  blockNumber: number;
  amount: string;
  currency: "GM" | "GN";
  extrinsicHash: string;
  from: HistoryAccount;
  to: HistoryAccount;
};

type HistoryPageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type HistoryEdgeNode = {
  node: HistoryTx;
};

type TransactionsRequestResult = {
  transfersConnection: {
    pageInfo: HistoryPageInfo;
    edges: HistoryEdgeNode[];
  };
};

export const useTransactions = (address?: string) => {
  const where = useMemo(
    () =>
      address
        ? `, AND: {from: {id_eq: "${address}"}, OR: {to: {id_eq: "${address}"}} }`
        : "",
    [address]
  );

  return useInfiniteQuery(
    ["transactions", address],
    ({ pageParam = 0 }) => {
      return request<TransactionsRequestResult>(
        SUBSQUID_URL,
        gql`
          query MyQuery {
            transfersConnection(
              
              ${pageParam ? `after:"${pageParam}"` : ""}
              first: 20
              orderBy: timestamp_DESC
              where: { currency_in: ["GM", "GN"]${where} }
            ) {
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  timestamp
                  blockNumber
                  amount
                  currency
                  extrinsicHash
                  from {
                    id
                    display
                    judgement
                  }
                  to {
                    id
                    display
                    judgement
                  }
                }
              }
            }
          }
        `
      );
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage.transfersConnection.pageInfo.endCursor,
      getPreviousPageParam: (firstPage) =>
        firstPage.transfersConnection.pageInfo.startCursor,
      refetchInterval: 30_000, // 30sec
    }
  );
};
