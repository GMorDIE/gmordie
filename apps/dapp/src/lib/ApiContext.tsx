import { ApiPromise } from "@polkadot/api";
import { ReactNode, useEffect, useState } from "react";

import { getApi } from "./getApi";
import { provideContext } from "./provideContext";

const useApiProvider = () => {
  const [api, setApi] = useState<ApiPromise>();
  const [error, setError] = useState<Error>();
  const [suspense, setSuspense] = useState<Promise<void>>();

  useEffect(() => {
    setSuspense(
      getApi()
        .then(setApi)
        .catch(setError)
        .finally(() => setSuspense(undefined))
    );
  }, []);

  // failed to connect
  if (error) throw error;

  // throwing a promise enables suspense
  if (suspense) throw suspense;

  return api;
};

// on mount, before our suspense promise is created, the api will be undefined
// do not render provider's childs until we have an api

const [UnsafeApiProvider, useUnsafeApi] = provideContext(useApiProvider);

const ProviderChildren = ({ children }: { children: ReactNode }) => {
  const api = useUnsafeApi();
  return api ? <>{children}</> : null;
};

// Export provider and api where children always have access to the api (never undefined)
export const useApi = useUnsafeApi as () => ApiPromise;
export const ApiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UnsafeApiProvider>
      <ProviderChildren>{children}</ProviderChildren>
    </UnsafeApiProvider>
  );
};
