import { Spinner } from "../../components/Spinner";
import { IdentityJudgements } from "./IdentityJudgements";
import { useIdentityVerification } from "./useIdentityVerification";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import clsx from "clsx";
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
        : null,
    [data]
  );

  if (!address) return null;

  if (!data && isLoading)
    return (
      <div className="flex w-full justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );

  if (isLoading) return null;

  return (
    <div className="flex flex-col pb-8 gap-2">
      {data ? (
        <>
          <IdentityJudgements
            address={address}
            registration={data.registration}
            judges={data.judges}
          />
          <pre className="bg-zinc-800 rounded p-2">{stringified}</pre>
        </>
      ) : (
        <div className="text-white font-bold">
          <ShieldCheckIcon
            className={clsx("inline w-6 h-6 mb-1 text-red-500")}
          />{" "}
          Identity has not been set
        </div>
      )}
    </div>
  );
};
