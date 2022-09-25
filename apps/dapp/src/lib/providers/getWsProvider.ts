import { WS_RPC_URLS } from "../settings";
import { WsProvider } from "@polkadot/api";

const TIMEOUT = 10_000;

export const getWsProvider = async () => {
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

  return provider;
};
