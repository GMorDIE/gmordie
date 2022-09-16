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
  const { data } = useRegistrars();
  console.log(data);

  const { registrar, index }: { registrar?: RegistrarInfo; index: number } =
    useMemo(() => {
      if (!data) return { index: -1 };
      const registrar = data.find(
        (r) => r.isSome && r.value.account.toString() === address
      );

      return {
        registrar: registrar?.value,
        index: registrar ? data.indexOf(registrar) : -1,
      };
      //const registrar = Array.from(data?.values.).find
    }, [address, data]);

  return { isRegistrar: !!registrar, index, registrar };
};
