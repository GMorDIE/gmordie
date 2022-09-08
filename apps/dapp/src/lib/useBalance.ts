import { useApi } from "./ApiContext";
import { useGmTime } from "./GmTimeContext";
import { NATIVE_TOKEN, TOKEN_DECIMALS, TOKEN_ID } from "./constants";
import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";

export const useBalance = (tokenId: TOKEN_ID, address?: string) => {
  const { blockNumber } = useGmTime();
  const api = useApi();
  const [free, setFree] = useState<string>();
  const [locked, setLocked] = useState<string>();

  const decimals = useMemo(() => TOKEN_DECIMALS[tokenId], [tokenId]);

  useEffect(() => {
    // clear if address changes
    setFree(undefined);
    setLocked(undefined);
  }, [address]);

  useEffect(() => {
    if (!api || !address) return;

    if (tokenId === NATIVE_TOKEN)
      api.query.system.account(address).then((accountInfo) => {
        const { data: accountData } = api.createType<AccountInfo>(
          "AccountInfo",
          accountInfo
        );

        setFree(accountData.free.toString());
        setLocked(accountData.reserved.toString());
      });
    else
      api.query.tokens.accounts(address, tokenId).then((accountData) => {
        const { free, frozen, reserved } = api.createType<OrmlAccountData>(
          "OrmlAccountData",
          accountData
        );
        setFree(free.toString());
        setLocked(frozen.add(reserved).toString());
      });
  }, [address, api, blockNumber, tokenId]);

  return { free, locked, decimals };
};
