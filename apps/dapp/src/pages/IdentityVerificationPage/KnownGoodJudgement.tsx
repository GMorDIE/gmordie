import { useIdentityOf } from "../../lib/useIdentityOf";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { RegistrarInfo } from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

type KnownGoodJudgementProps = {
  registrar: RegistrarInfo;
};

export const KnownGoodJudgement = ({ registrar }: KnownGoodJudgementProps) => {
  const address = useMemo(
    () => registrar?.account?.toString(),
    [registrar?.account]
  );
  const identity = useIdentityOf(address);

  const { display, verified } = useMemo(
    () => ({
      display:
        (identity?.value?.info.display?.value?.toHuman() as string) ??
        registrar?.account?.toString(),
      verified: identity?.value?.judgements?.some(([, j]) => j.isKnownGood),
    }),
    [identity, registrar]
  );

  if (!display) return null;

  console.log({ identity, iden: identity?.toHuman() });
  return (
    <div className="flex font-bold gap-2">
      Verified by{" "}
      {verified && <ShieldCheckIcon className="w-5 h-5 text-green-600" />}{" "}
      {display}
    </div>
  );
};
