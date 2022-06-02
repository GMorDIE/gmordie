import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, WsProvider } from "@polkadot/api";

import { WS_RPC_URL } from "./settings";

export const getApi = async () => {
  const wsProvider = new WsProvider(WS_RPC_URL);
  const api = await ApiPromise.create({ provider: wsProvider });
  // need the OrmlAccountData type
  api.registerTypes(types);
  return api;
};
