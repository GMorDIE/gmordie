import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

const SUBSQUID_URL = "https://squid.subsquid.io/gmordie-frontend/v/v0/graphql";

type RequestResult = {
  accountsConnection: {
    totalCount: number;
  };
};

export const useHolders = () => {
  return useQuery(["holders"], () => {
    return request<RequestResult>(
      SUBSQUID_URL,
      gql`
        query MyQuery {
          accountsConnection(orderBy: id_ASC) {
            totalCount
          }
        }
      `
    );
  });
};
