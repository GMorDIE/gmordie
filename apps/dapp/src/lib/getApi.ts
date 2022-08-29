import { gmChainSpec, kusamaChainSpec } from "../chainSpecs";
import { WS_RPC_URL } from "./settings";
import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, ScProvider, WsProvider } from "@polkadot/api";

// Cache light client api object because it's long to initialize
const apiCache: Record<string, Promise<ApiPromise>> = {};

const getLightClientApi = async () => {
  const relayProvider = new ScProvider(JSON.stringify(kusamaChainSpec));
  const gmProvider = new ScProvider(JSON.stringify(gmChainSpec), relayProvider);
  await gmProvider.connect();

  const api = await ApiPromise.create({ provider: gmProvider });

  // need the OrmlAccountData type
  api.registerTypes(types);
  return api;
};

const getRpcApi = async () => {
  const wsProvider = new WsProvider(WS_RPC_URL);
  const api = await ApiPromise.create({ provider: wsProvider });
  // need the OrmlAccountData type
  api.registerTypes(types);
  return api;
};

export const getApi = async (withLightClient?: boolean) => {
  if (withLightClient) {
    if (!apiCache.lightClient) apiCache.lightClient = getLightClientApi();
    return apiCache.lightClient;
  }

  if (!apiCache.rpc) apiCache.rpc = getRpcApi();
  return apiCache.rpc;
};
