import { useSettings } from "./SettingsContext";
import { getApi } from "./getApi";
import { provideContext } from "./provideContext";
import { ApiPromise } from "@polkadot/api";
import { useEffect, useState } from "react";

const useApiProvider = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [error, setError] = useState<Error>();
  const { lightClient } = useSettings();

  useEffect(() => {
    getApi(lightClient).then(setApi).catch(setError);
  }, [lightClient]);

  // failed to connect
  if (error) throw error;

  return api;
};

// on mount, before our suspense promise is created, the api will be undefined
// do not render provider's childs until we have an api

export const [ApiProvider, useApi] = provideContext(useApiProvider);
