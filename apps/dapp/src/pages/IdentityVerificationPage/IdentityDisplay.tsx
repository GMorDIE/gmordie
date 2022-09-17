import { Spinner } from "../../components/Spinner";
import { IdentityJudgements } from "./IdentityJudgements";
import { useIdentityVerification } from "./useIdentityVerification";
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
    <div className="flex flex-col pb-8 gap-2">
      <IdentityJudgements
        address={address}
        registration={data.registration}
        judges={data.judges}
      />
      <pre className="bg-zinc-800 rounded p-2">{stringified}</pre>
      {/* {stringified !== "null" && <IdentityVerifyButton address={address} />} */}
    </div>
  );
};
