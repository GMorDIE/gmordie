import { useApi } from "../../lib/ApiContext";
import { useRegistrars } from "./useRegistrars";
import { Option } from "@polkadot/types-codec";
import { Vec } from "@polkadot/types/codec";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const DEFAULT_OPTIONS = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export const useRegistrar = (address?: string, options = DEFAULT_OPTIONS) => {
  const { data: registrars, isLoading } = useRegistrars();
  //const { data } = useRegistrars();

  const { registrar, index }: { registrar?: RegistrarInfo; index: number } =
    useMemo(() => {
      if (!registrars?.length) return { index: -1 };
      const registrar = registrars.find(
        (r) => r?.value?.account.toString() === address
      );

      return {
        registrar: registrar?.value,
        index: registrar ? registrars.indexOf(registrar) : -1,
      };
      //const registrar = Array.from(data?.values.).find
    }, [address, registrars]);

  return { isLoading, isRegistrar: !!registrar, index, registrar };
};
