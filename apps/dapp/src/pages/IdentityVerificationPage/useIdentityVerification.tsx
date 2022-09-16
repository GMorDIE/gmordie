import { useApi } from "../../lib/ApiContext";
import { useCall } from "../../lib/useCall";
import { useRegistrations } from "../../lib/useRegistration";
import { useRegistrars } from "./useRegistrars";
import { Option } from "@polkadot/types-codec";
import {
  RegistrarInfo,
  Registration,
} from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

export type WellKnownJudgementRegistrar = {
  registrar: RegistrarInfo;
  registration: Registration;
};

export type IdentityVerification = {
  registration: Registration;
  knownGoodRegistrars: WellKnownJudgementRegistrar[];
};

export const useIdentityVerification = (address: string) => {
  const api = useApi();
  const { data: registrars, isLoading: isLoadingRegistrars } = useRegistrars();
  const { data: registration, isLoading: isLoadingRegistration } = useCall<
    Option<Registration>
  >(api?.query.identity.identityOf, [address]);

  const kgRegistrarsIndexs = useMemo(
    () =>
      registration?.value?.judgements
        ?.filter(([, j]) => j.isKnownGood)
        ?.map(([i]) => i) ?? [],

    [registration]
  );

  const { kgRegistrars, kgRegistrarsAddresses } = useMemo(() => {
    const kgRegistrars =
      (kgRegistrarsIndexs
        .map((ri) => {
          return registrars?.find((_, idx) => idx === ri.toNumber())?.value;
        })
        .filter(Boolean) as RegistrarInfo[]) ?? [];
    return {
      kgRegistrars,
      kgRegistrarsAddresses: kgRegistrars.map((r) => r.account.toString()),
    };
  }, [kgRegistrarsIndexs, registrars]);

  const {
    data: kgRegistrarsIdentities,
    isLoading: isLoadingRegistrarIdentities,
  } = useRegistrations(kgRegistrarsAddresses);

  const isLoading = useMemo(
    () =>
      isLoadingRegistrars ||
      isLoadingRegistration ||
      isLoadingRegistrarIdentities,
    [isLoadingRegistrarIdentities, isLoadingRegistrars, isLoadingRegistration]
  );

  const data: IdentityVerification | undefined = useMemo(() => {
    if (isLoading) return undefined;

    const arkgRegistrarIdentities = kgRegistrarsIdentities?.map((a) => a);
    if (kgRegistrars?.length !== kgRegistrarsIdentities?.length)
      return undefined;

    return {
      registration: registration?.value,
      knownGoodRegistrars:
        kgRegistrars?.map((kgr, i) => ({
          registrar: kgr,
          registration: arkgRegistrarIdentities?.[i]?.value,
        })) ?? [],
    } as IdentityVerification;
  }, [isLoading, kgRegistrars, kgRegistrarsIdentities, registration]);

  console.log("useID", address, isLoading, data, {
    kgRegistrars,
    kgRegistrarsIdentities,
    registration,
  });

  return { isLoading, data };
};
