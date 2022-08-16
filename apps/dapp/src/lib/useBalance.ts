import { useApi } from "./ApiContext";
import { useGmTime } from "./GmTimeContext";
import { NATIVE_TOKEN, TOKEN_DECIMALS, TOKEN_ID } from "./constants";
import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

export const useBalance = (address: string, tokenId: TOKEN_ID) => {
  const { blockNumber } = useGmTime();
  const api = useApi();
  const [free, setFree] = useState<string>();

  const decimals = useMemo(() => TOKEN_DECIMALS[tokenId], [tokenId]);

  useEffect(() => {
    if (!api) return;

    if (tokenId === NATIVE_TOKEN)
      api.query.system.account(address).then((accountInfo) => {
        const { data: accountData } = api.createType<AccountInfo>(
          "AccountInfo",
          accountInfo
        );
        setFree(accountData.free.toString());
      });
    else
      api.query.tokens.accounts(address, tokenId).then((accountData) => {
        const { free } = api.createType<OrmlAccountData>(
          "OrmlAccountData",
          accountData
        );
        setFree(free.toString());
      });
  }, [address, api, blockNumber, tokenId]);

  return { free, decimals };
};
