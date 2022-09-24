import { SUBSQUID_URL } from "./settings";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

type RequestResult = {
  transfersConnection: {
    totalCount: number;
  };
};

export const useGMGNGrandTotal = () => {
  return useQuery(
    ["gm_gn_toal"],
    () => {
      return request<RequestResult>(
        SUBSQUID_URL,
        gql`
          query GrandTotal {
            transfersConnection(
              orderBy: id_ASC
              where: { currency_in: ["GM", "GN"] }
            ) {
              totalCount
            }
          }
        `
      );
    },
    {
      refetchInterval: 5000,
    }
  );
};
