import { useRegistration } from "../../lib/useRegistration";
import { WellKnownJudgementRegistrar } from "./useIdentityVerification";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";
import clsx from "clsx";
import { useMemo } from "react";

type IdentityKnownGoodJudgementProps = WellKnownJudgementRegistrar;

export const IdentityKnownGoodJudgement = ({
  registrar,
  registration,
}: IdentityKnownGoodJudgementProps) => {
  // const address = useMemo(
  //   () => registrar?.account?.toString(),
  //   [registrar?.account]
  // );
  // const { data: identity, isLoading } = useRegistration(address);
  // console.log({ type: "identity", identity: identity?.toHuman(), isLoading });

  const { display, verified } = useMemo(
    () => ({
      display:
        (registration?.info.display?.value?.toHuman() as string) ??
        registrar?.account?.toString(),
      verified: registration?.judgements?.some(([, j]) => j.isKnownGood),
    }),
    [registrar, registration]
  );

  if (!display) return null;

  return (
    <span className={clsx(verified && "text-green-500")}>
      {/* {verified && <ShieldCheckIcon className="w-5 h-5 text-green-600" />}{" "} */}
      {display}
    </span>
  );
};
