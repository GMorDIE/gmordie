import { useApi } from "./ApiContext";
import { useCall } from "./useCall";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";

export const useIdentityOf = (address?: string) => {
  const api = useApi();
  return useCall<Option<Registration>>(api?.query.identity.identityOf, [
    address,
  ]);
};
