import { gmChainSpec, kusamaChainSpec } from "../chainSpecs";
import { WS_RPC_URLS } from "./settings";
import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, ScProvider, WsProvider } from "@polkadot/api";

const TIMEOUT = 10_000;

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

export const getRpcApi = async () => {
  // Promise.any returns the fastest WsProvider to be ready
  // This should spread the load on all available nodes
  const providers = WS_RPC_URLS.map((url) => new WsProvider(url, TIMEOUT));
  const provider = await Promise.any(providers.map((p) => p.isReady));

  // disconnect other ones
  providers.forEach(async (p, i) => {
    try {
      if (p !== provider) {
        await p.disconnect();
      }
    } catch (err) {
      console.log(`failed to disconnect from ${WS_RPC_URLS[i]}`);
      console.error(err);
    }
  });

  const api = await ApiPromise.create({ provider });

  // register ORML types
  api.registerTypes(types);

  return api;
};

export const getApi = (withLightClient?: boolean) => {
  if (withLightClient) {
    if (!apiCache.lightClient) apiCache.lightClient = getLightClientApi();
    return apiCache.lightClient;
  }

  if (!apiCache.rpc) apiCache.rpc = getRpcApi();
  return apiCache.rpc;
};
