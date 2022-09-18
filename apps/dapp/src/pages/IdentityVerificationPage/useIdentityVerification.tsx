import { useRegistration, useRegistrations } from "../../lib/useRegistration";
import { useRegistrars } from "./useRegistrars";
import {
  RegistrarInfo,
  Registration,
} from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

export type Judge = {
  registrar: RegistrarInfo;
  registration: Registration;
  index: number;
};

export type IdentityVerification = {
  registration: Registration;
  judges: Judge[];
};

export const useIdentityVerification = (address: string) => {
  const { data: registrars, isLoading: isLoadingRegistrars } = useRegistrars();
  const { data: registration, isLoading: isLoadingRegistration } =
    useRegistration(address);

  const judgesIndexs = useMemo(
    () => registration?.value?.judgements?.map(([i]) => i) ?? [],
    [registration]
  );

  const { judges, judgesAddresses } = useMemo(() => {
    const judges =
      (judgesIndexs
        .map((ri) => {
          return registrars?.find((_, idx) => idx === ri.toNumber())?.value;
        })
        .filter(Boolean) as RegistrarInfo[]) ?? [];
    return {
      judges,
      judgesAddresses: judges.map((r) => r.account.toString()),
    };
  }, [judgesIndexs, registrars]);

  const { data: judgesIdentities, isLoading: isLoadingJudgesIdentities } =
    useRegistrations(judgesAddresses);

  const isLoading = useMemo(() => {
    const hasMissingIdentities = judges?.length !== judgesIdentities?.length;
    return (
      isLoadingRegistrars ||
      isLoadingRegistration ||
      isLoadingJudgesIdentities ||
      hasMissingIdentities
    );
  }, [
    isLoadingJudgesIdentities,
    isLoadingRegistrars,
    isLoadingRegistration,
    judges?.length,
    judgesIdentities,
  ]);

  const data: IdentityVerification | undefined = useMemo(() => {
    if (isLoading || registration?.isNone) return undefined;

    const arJudges = judgesIdentities?.map((a) => a);

    return {
      registration: registration?.value,
      judges:
        judges?.map((registrar, i) => ({
          registrar,
          registration: arJudges?.[i]?.value,
          index: registrars?.findIndex((r) => r.value === registrar),
        })) ?? [],
    } as IdentityVerification;
  }, [isLoading, judges, judgesIdentities, registrars, registration]);

  // //@devs keep for debugging
  // console.log("useIdentityVerification", {
  //   isLoading,
  //   isLoadingJudgesIdentities,
  //   isLoadingRegistrars,
  //   isLoadingRegistration,
  //   registrars: registrars?.map((r) => r.toHuman()),
  //   registration: registration?.toHuman(),
  //   judgesIndexs: judgesIndexs?.map((r) => r.toHuman()),
  //   judgesIdentities: judgesIdentities?.map((r) => r.toHuman()),
  //   judgesAddresses,
  // });

  return { isLoading, data };
};
