import { useIdentityDisplayName } from "../features/identity/useIdentityDisplayName";
import { SS58_PREFIX } from "../lib/constants";
import { formatAddressShort } from "../lib/formatAddressShort";
import { ShieldCheckIcon } from "@heroicons/react/solid";

export const Address = ({
  address,
  keep = 6,
  withIdentity = false,
}: {
  address: string;
  keep?: number;
  withIdentity?: boolean;
}) => {
  const { data } = useIdentityDisplayName(withIdentity ? address : undefined);

  if (data?.verified) console.log("verified", address, data);

  return data ? (
    <span className="inline-flex items-center gap-1" title={address}>
      <span>{data.display}</span>
      {data?.verified && <ShieldCheckIcon className="w-5 h-5 text-green-700" />}
    </span>
  ) : (
    <>{formatAddressShort(address, keep, SS58_PREFIX)}</>
  );
};
