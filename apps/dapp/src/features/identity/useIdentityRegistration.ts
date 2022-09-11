import { useApi } from "../../lib/ApiContext";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_OPTIONS = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export const useIdentityRegistration = (
  address?: string,
  options = DEFAULT_OPTIONS
) => {
  const api = useApi();

  return useQuery(
    ["identity", address, api],
    async () => {
      if (!address) return null;
      if (!api) return null;

      await api.isReady;
      return api.query.identity.identityOf<Option<Registration>>(address);
    },
    options
  );
};
