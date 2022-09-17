import { Judge as IdentityJudge } from "./useIdentityVerification";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

type IdentityJudgementProps = {
  judge: IdentityJudge;
  registration: Registration;
};

export const IdentityJudgement = ({
  judge,
  registration,
}: IdentityJudgementProps) => {
  const { display, className, account } = useMemo(() => {
    const judgement = registration?.judgements?.find(
      ([index]) => index.toNumber() === judge?.index
    )?.[1];
    let className = "text-red-500";
    if (judgement?.isKnownGood) className = "text-green-500";
    else if (judgement?.isReasonable) className = "text-white";

    const account = judge.registrar?.account?.toString();
    const display =
      (judge.registration?.info.display?.value?.toHuman() as string) ?? account;

    return {
      account,
      display,
      className,
    };
  }, [judge, registration]);

  if (!display) return null;

  return (
    <span className={className} title={account}>
      {display}
    </span>
  );
};
