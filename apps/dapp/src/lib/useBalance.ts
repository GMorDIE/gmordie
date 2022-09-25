import { useApi } from "./ApiContext";
import { NATIVE_TOKEN, TOKEN_DECIMALS, TOKEN_ID } from "./constants";
import { useCall } from "./useCall";
import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import { BN } from "@polkadot/util";
import { useCallback } from "react";
import { useMemo } from "react";

export type TokenBalance = {
  symbol: TOKEN_ID;
  decimals: number;
  transferable: BN;
  locked: BN;
};

const getNativeTokenBalance = (value: unknown) => {
  const accountInfo = value as AccountInfo;
  const { free, reserved, miscFrozen: frozen } = accountInfo.data;
  return { free, reserved, frozen };
};

const getORMLTokenBalance = (value: unknown) => {
  const accountData = value as OrmlAccountData;
  const { free, reserved, frozen } = accountData;

  return { free, reserved, frozen };
};

export const useBalance = (tokenId: TOKEN_ID, address?: string) => {
  const api = useApi();

  const transform = useCallback(
    (value: unknown) => {
      const { free, reserved, frozen } =
        tokenId === "FREN"
          ? getNativeTokenBalance(value)
          : getORMLTokenBalance(value);

      return {
        transferable: free.sub(frozen),
        locked: reserved,
        symbol: tokenId,
        decimals: TOKEN_DECIMALS[tokenId],
      } as TokenBalance;
    },
    [tokenId]
  );

  const { call, args } = useMemo(
    () => ({
      call:
        tokenId === NATIVE_TOKEN
          ? api?.query.system.account
          : api?.query.tokens.accounts,
      args: tokenId === NATIVE_TOKEN ? [address] : [address, tokenId],
    }),
    [address, api, tokenId]
  );

  return useCall<TokenBalance>(call, args, {
    transform,
  });
};
