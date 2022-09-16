import { KnownGoodJudgement } from "./KnownGoodJudgement";
import { useRegistrars } from "./useRegistrars";
import {
  Registration,
  RegistrarInfo,
} from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

type IdentityVerificationProps = {
  registration?: Registration;
};

export const IdentityJudgements = ({
  registration,
}: IdentityVerificationProps) => {
  const registrars = useRegistrars();
  // keep only known good ones
  const knownGoodRegistrarIndexs = useMemo(
    () =>
      registration?.judgements
        ?.filter(([, j]) => j.isKnownGood)
        ?.map(([i]) => i) ?? [],

    [registration?.judgements]
  );

  const knownGoodRegistrars = useMemo(() => {
    return (
      (knownGoodRegistrarIndexs
        .map((ri) => {
          return registrars?.find((_, idx) => idx === ri.toNumber())?.value;
        })
        .filter(Boolean) as RegistrarInfo[]) ?? []
    );
  }, [knownGoodRegistrarIndexs, registrars]);

  console.log({
    knownGoodRegistrars,
  });
  // const validJudgementRegistrars = useMemo(() => {

  // }, [])

  // console.log({
  //   registration: registration?.toHuman(),
  //   validJudgements,
  //   //regJudgements: validJudgements?.toHuman?.(),
  // });

  if (!knownGoodRegistrars) return null;

  if (!knownGoodRegistrars.length) return <div>Unverified</div>;

  return (
    <>
      {knownGoodRegistrars?.map((registrarInfo) => (
        <KnownGoodJudgement
          key={registrarInfo.account.toString()}
          registrar={registrarInfo}
        />
      ))}
    </>
  );
};
