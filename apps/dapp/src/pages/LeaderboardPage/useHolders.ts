import { SUBSQUID_URL } from "../../lib/settings";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

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
