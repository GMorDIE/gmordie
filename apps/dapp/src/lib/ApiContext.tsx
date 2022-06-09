import { ApiPromise } from "@polkadot/api";
import { useEffect, useState } from "react";

import { getApi } from "./getApi";
import { provideContext } from "./provideContext";

const useApiProvider = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    getApi().then(setApi).catch(setError);
  }, []);

  // failed to connect
  if (error) throw error;

  return api;
};

// on mount, before our suspense promise is created, the api will be undefined
// do not render provider's childs until we have an api

export const [ApiProvider, useApi] = provideContext(useApiProvider);
