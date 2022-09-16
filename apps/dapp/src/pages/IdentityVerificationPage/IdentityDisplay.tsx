import { Spinner } from "../../components/Spinner";
import { useApi } from "../../lib/ApiContext";
import { useCall } from "../../lib/useCall";
import { IdentityJudgements } from "./IdentityJudgements";
import { IdentityVerifyButton } from "./IdentityVerify";
import { useIdentityVerification } from "./useIdentityVerification";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useMemo } from "react";

type IdentityDisplayProps = {
  address: string;
};

export const IdentityDisplay = ({ address }: IdentityDisplayProps) => {
  const { data, isLoading } = useIdentityVerification(address);

  const stringified = useMemo(
    () =>
      data?.registration
        ? JSON.stringify(data.registration.toHuman(true), undefined, 3)
        : "",
    [data]
  );

  if (!address) return null;

  if (!data && isLoading)
    return (
      <div className="flex w-full justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="space-y-2">
        <IdentityJudgements knownGoodRegistrars={data.knownGoodRegistrars} />
        <pre className="bg-zinc-800 rounded p-2">{stringified}</pre>
      </div>
      {stringified !== "null" && <IdentityVerifyButton address={address} />}
    </div>
  );
};
