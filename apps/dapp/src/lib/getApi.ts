import { gmChainSpec, kusamaChainSpec } from "../chainSpecs";
import { WS_RPC_URL } from "./settings";
import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, ScProvider, WsProvider } from "@polkadot/api";

// Cache light client api object because it's long to initialize
const apiCache: Record<string, Promise<ApiPromise>> = {};

const getProvider = (
  id: string,
  spec: string,
  sharedSandbox?: ScProvider | undefined
): Promise<ScProvider> =>
  new Promise((resolve, reject) => {
    const provider = new ScProvider(spec, sharedSandbox);
    provider.on("connected", (...a) => {
      console.debug("connected to ", id, a);
      resolve(provider);
    });
    provider.on("disconnected", (...a) => {
      console.error("disconnected from", id, a);
      reject(new Error("disconnected from " + id));
    });
    provider.on("error", (err) => {
      console.error("error from", id, err);
      reject(err);
    });
    provider.connect().then(() => {
      if (provider.isConnected) resolve(provider);
    });
  });

const getLightClientApi = async () => {
  console.time("connected to kusama");
  const relayProvider = await getProvider(
    "kusama",
    JSON.stringify(kusamaChainSpec)
  );
  console.debug("relay provider connected");
  console.timeEnd("connected to kusama");

  // const apiKusama = await ApiPromise.create({ provider: relayProvider });
  // const kusamaBlock = await apiKusama.rpc.chain.getBlock();
  // console.log("kusama block", kusamaBlock.toHuman());

  console.time("connected to GM");
  const gmProvider = await getProvider(
    "GM",
    JSON.stringify(gmChainSpec),
    relayProvider
  );
  console.timeEnd("connected to GM");

  const api = await ApiPromise.create({ provider: gmProvider });
  console.debug("api created");
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
