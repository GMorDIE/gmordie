import { useApi } from "../../lib/ApiContext";
import { useCall } from "../../lib/useCall";
import { IdentityJudgements } from "./IdentityJudgements";
import { IdentityVerifyButton } from "./IdentityVerify";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

type IdentityDisplayProps = {
  address?: string;
};

export const IdentityDisplay = ({ address }: IdentityDisplayProps) => {
  const api = useApi();
  const registration = useCall<Option<Registration>>(
    api?.query.identity.identityOf,
    [address]
  );

  console.log({ registration, registrationHuman: registration?.toHuman() });

  const stringified = useMemo(
    () =>
      registration
        ? JSON.stringify(registration.toHuman(true), undefined, 3)
        : "",
    [registration]
  );

  const isVerified = useMemo(
    () => registration?.value?.judgements?.some(([, j]) => j.isKnownGood),
    [registration?.value?.judgements]
  );

  if (!address) return null;

  //   if (!data && isFetching)
  //     return (
  //       <div className="flex w-full justify-center">
  //         <Spinner className="w-10 h-10" />
  //       </div>
  //     );

  //   if (error)
  //     return (
  //       <div className="text-red-500 whitespace-pre-wrap">
  //         {(error as Error).message ?? error.toString()}
  //       </div>
  //     );

  return (
    <div className="flex flex-col gap-4 pb-8">
      {registration && (
        <IdentityJudgements registration={registration?.value} />
      )}
      <pre className="bg-zinc-800 rounded p-2">{stringified}</pre>
      {!isVerified && stringified !== "null" && (
        <IdentityVerifyButton address={address} />
      )}
    </div>
  );
};
