import { isSubstrateConnectInstalled } from "../features/light-client/isSubstrateConnectInstalled";
import { useSettings } from "./SettingsContext";
import { provideContext } from "./provideContext";
import { getScProvider, getWsProvider } from "./providers";
import { types as ormlTypes } from "@open-web3/orml-type-definitions";
import { ApiPromise } from "@polkadot/api";
import { ProviderInterface } from "@polkadot/rpc-provider/types";
import { useEffect, useMemo, useState } from "react";

const useConnectionProvider = (withLightClient: boolean) => {
  const [provider, setProvider] = useState<ProviderInterface>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error>();

  const isLightClient = useMemo(
    () => withLightClient && isSubstrateConnectInstalled(),
    [withLightClient]
  );

  useEffect(() => {
    setIsConnecting(true);
    setError(undefined);

    const getProvider = isLightClient ? getScProvider : getWsProvider;

    getProvider()
      .then(setProvider)
      .catch((err) => {
        setError(err as Error);
      })
      .finally(() => {
        setIsConnecting(false);
      });
  }, [isLightClient]);

  return { provider, isConnecting, error, isLightClient };
};

const useApiProvider = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [isApiConnecting, setIsApiConnecting] = useState(false);
  const [apiError, setApiError] = useState<Error>();
  const { lightClient } = useSettings();
  const {
    provider,
    isConnecting: isProviderConnecting,
    error: providerError,
  } = useConnectionProvider(lightClient);

  useEffect(() => {
    if (!provider) return;
    setApiError(undefined);
    setIsApiConnecting(true);

    ApiPromise.create({ provider })
      .then((apiPromise) => {
        apiPromise.registerTypes(ormlTypes);
        setApi(apiPromise);
      })
      .catch((err) => {
        setApiError(err as Error);
      })
      .finally(() => {
        setIsApiConnecting(false);
      });
  }, [provider]);

  const { error } = useMemo(
    () => ({
      isConnecting: isProviderConnecting || isApiConnecting,
      error: providerError ?? apiError,
    }),
    [apiError, isApiConnecting, isProviderConnecting, providerError]
  );

  // failed to connect
  if (error) throw error;

  return api;
};

// on mount, before our suspense promise is created, the api will be undefined
// do not render provider's childs until we have an api
export const [ApiProvider, useApi] = provideContext(useApiProvider);
