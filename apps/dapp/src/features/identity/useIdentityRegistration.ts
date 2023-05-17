import { useApi } from "../../lib/ApiContext";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useQuery } from "@tanstack/react-query";

type QueryOptions = {
  refetchOnReconnect: boolean;
  refetchOnWindowFocus: boolean;
  refetchInterval: number;
};

const DEFAULT_OPTIONS: QueryOptions = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  refetchInterval: 0,
};

export const useIdentityRegistration = (
  address?: string,
  options: Partial<QueryOptions> = DEFAULT_OPTIONS
) => {
  const api = useApi();

  return useQuery(
    ["identity", address, !!api],
    async () => {
      if (!address) return null;
      if (!api) return null;

      await api.isReady;
      return api.query.identity.identityOf<Option<Registration>>(address);
    },
    { ...DEFAULT_OPTIONS, ...options }
  );
};
