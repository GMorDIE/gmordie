import { useApi } from "../../lib/ApiContext";
import { Option } from "@polkadot/types-codec";
import { Vec } from "@polkadot/types/codec";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_OPTIONS = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export const useRegistrars = (options = DEFAULT_OPTIONS) => {
  const api = useApi();

  return useQuery(
    ["registrars", api],
    async () => {
      if (!api) return null;

      await api.isReady;
      return api.query.identity.registrars<Option<RegistrarInfo>[]>();
    },
    options
  );
};