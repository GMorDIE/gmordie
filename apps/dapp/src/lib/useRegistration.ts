import { useApi } from "./ApiContext";
import { useCall } from "./useCall";
import { useCallMulti } from "./useCallMulti";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";

export const useRegistration = (address: string) => {
  const api = useApi();
  return useCall<Option<Registration>>(api?.query.identity.identityOf, [
    address,
  ]);
};

export const useRegistrations = (addresses: string[]) => {
  const api = useApi();
  return useCallMulti<Option<Registration>[]>(
    api ? addresses.map((a) => [api.query.identity.identityOf, a]) : []
  );
};
