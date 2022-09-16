import { Button } from "../../components/Button";
import { Spinner } from "../../components/Spinner";
import { useIdentityRegistration } from "../../features/identity/useIdentityRegistration";
import { IdentityVerifyButton } from "./IdentityVerify";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import is from "date-fns/esm/locale/is/index.js";
import { useMemo } from "react";

type IdentityDisplayProps = {
  address?: string;
};

export const IdentityDisplay = ({ address }: IdentityDisplayProps) => {
  const { data, error, isFetching } = useIdentityRegistration(address, {
    refetchInterval: 10_000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const stringified = useMemo(
    () => (data ? JSON.stringify(data.toHuman(true), undefined, 3) : ""),
    [data]
  );

  const isVerified = useMemo(
    () => data?.value?.judgements?.some(([i, j]) => j.isKnownGood),
    [data?.value?.judgements]
  );

  if (!address) return null;

  if (!data && isFetching)
    return (
      <div className="flex w-full justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 whitespace-pre-wrap">
        {(error as Error).message ?? error.toString()}
      </div>
    );

  return (
    <div className="flex flex-col gap-4 pb-8">
      <pre className="bg-zinc-800 rounded p-2">{stringified}</pre>
      {isVerified && (
        <div className="flex font-bold gap-2">
          {<ShieldCheckIcon className="w-5 h-5 text-green-600" />} Verified
        </div>
      )}
      {!isVerified && stringified !== "null" && (
        <IdentityVerifyButton address={address} />
      )}
    </div>
  );
};
