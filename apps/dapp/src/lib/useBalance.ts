import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

import { useApi } from "./ApiContext";
import { useGmTime } from "./GmTimeContext";

export const useBalance = (address: string, tokenId: string) => {
  const { blockNumber } = useGmTime();
  const api = useApi();
  const [free, setFree] = useState<string>();

  const tokenIndex = useMemo(
    () => api?.registry.chainTokens.indexOf(tokenId),
    [api, tokenId]
  );

  const decimals = useMemo(
    () =>
      tokenIndex !== undefined
        ? api?.registry.chainDecimals[tokenIndex]
        : undefined,
    [api, tokenIndex]
  );

  useEffect(() => {
    if (!api) return;
    if (tokenIndex)
      api.query.tokens.accounts(address, tokenId).then((accountData) => {
        const { free } = api.createType<OrmlAccountData>(
          "OrmlAccountData",
          accountData
        );
        setFree(free.toString());
      });
    else
      api.query.system.account(address).then((accountInfo) => {
        const { data: accountData } = api.createType<AccountInfo>(
          "AccountInfo",
          accountInfo
        );
        setFree(accountData.free.toString());
      });
  }, [address, api, tokenIndex, blockNumber, tokenId]);

  return { free, tokenDecimals: decimals };
};
