import { useRegistrars } from "./useRegistrars";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

export const useRegistrar = (address?: string) => {
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
