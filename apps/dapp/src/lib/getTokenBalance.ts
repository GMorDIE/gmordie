import { NATIVE_TOKEN, TOKEN_ID } from "./constants";
import { OrmlAccountData } from "@open-web3/orml-types/interfaces/tokens";
import { ApiPromise } from "@polkadot/api";
import { AccountInfo } from "@polkadot/types/interfaces/system";
import { BN } from "@polkadot/util";

export const getTokenBalance = async (
  api: ApiPromise,
  tokenId: TOKEN_ID,
  address?: string
) => {
  if (tokenId === NATIVE_TOKEN) {
    const accountInfo = await api.query.system.account(address);
    const {
      data: { free, reserved, miscFrozen: frozen },
    } = api.createType<AccountInfo>("AccountInfo", accountInfo);

    return {
      transferable: free.sub(frozen) as BN,
      locked: frozen.add(reserved) as BN,
    };
  }

  // ORML
  const accountData = await api.query.tokens.accounts(address, tokenId);
  const { free, frozen, reserved } = api.createType<OrmlAccountData>(
    "OrmlAccountData",
    accountData
  );
  return {
    transferable: free.sub(frozen) as BN,
    locked: frozen.add(reserved) as BN,
  };
};
