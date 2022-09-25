import { gmChainSpec } from "../../chainSpecs";
import { sleep } from "../sleep";
import { ScProvider } from "@polkadot/api";
import { WellKnownChain } from "@substrate/connect";

// cache provider in an object to prevent closure issues
const PROVIDER_CACHE: Record<string, Promise<ScProvider> | undefined> = {};
const PROVIDER_KEY = "provider";

export const getScProviderInner = async () => {
  const relayProvider = new ScProvider(WellKnownChain.ksmcc3);

  const gmProvider = new ScProvider(JSON.stringify(gmChainSpec), relayProvider);
  await gmProvider.connect();

  while (!gmProvider.isConnected) await sleep(50);

  return gmProvider;
};

export const getScProvider = async () => {
  // instanciate the provider only once
  if (!PROVIDER_CACHE[PROVIDER_KEY])
    PROVIDER_CACHE[PROVIDER_KEY] = getScProviderInner();
  return PROVIDER_CACHE[PROVIDER_KEY];
};
