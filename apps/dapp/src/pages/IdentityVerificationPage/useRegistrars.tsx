import { useApi } from "../../lib/ApiContext";
import { useCall } from "../../lib/useCall";
import { Option } from "@polkadot/types-codec";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";

export const useRegistrars = () => {
  const api = useApi();
  return useCall<Option<RegistrarInfo>[]>(api?.query.identity.registrars, []);
};
