import { WS_RPC_URLS } from "./settings";
import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, WsProvider } from "@polkadot/api";

const TIMEOUT = 10_000;

export const getApi = async () => {
  // Promise.any returns the fastest WsProvider to be ready
  // This should spread the load on all available nodes
  const provider = await Promise.any(
    WS_RPC_URLS.map((url) => new WsProvider(url, TIMEOUT)).map((p) => p.isReady)
  );

  const api = await ApiPromise.create({ provider });

  // register ORML types
  api.registerTypes(types);

  return api;
};
