import { IdentityKnownGoodJudgement } from "./IdentityKnownGoodJudgement";
import { WellKnownJudgementRegistrar } from "./useIdentityVerification";
import { useRegistrars } from "./useRegistrars";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import {
  Registration,
  RegistrarInfo,
} from "@polkadot/types/interfaces/identity";
import { Fragment, useMemo } from "react";

type IdentityVerificationProps = {
  knownGoodRegistrars: WellKnownJudgementRegistrar[];
};

export const IdentityJudgements = ({
  knownGoodRegistrars,
}: IdentityVerificationProps) => {
  if (!knownGoodRegistrars.length) return <div>Unverified</div>;

  return (
    <div className="font-bold text-white leading-7 align-middle ">
      {/* <span className="inline-flex flex-col justify-center"></span> */}
      <ShieldCheckIcon className="inline w-6 h-6 text-green-600 mb-1" />
      <span>
        {" "}
        Verified by{" "}
        {[
          ...knownGoodRegistrars,
          ...knownGoodRegistrars,
          ...knownGoodRegistrars,
          ...knownGoodRegistrars,
        ]?.map((r, i, arr) => (
          <Fragment key={i + r.registrar.account.toString()}>
            {i > 0 && arr.length === i + 1 && " and "}
            {i > 0 && arr.length > i + 1 && ", "}
            <IdentityKnownGoodJudgement {...r} />
          </Fragment>
        ))}
      </span>
    </div>
  );
};
