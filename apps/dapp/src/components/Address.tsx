import { SS58_PREFIX } from "../lib/constants";
import { formatAddressShort } from "../lib/formatAddressShort";
import { ShieldCheckIcon } from "@heroicons/react/solid";

export const Address = ({
  address,
  keep = 6,
  display,
  verified = false,
}: {
  address: string;
  keep?: number;
  display?: string;
  verified?: boolean;
}) => (
  <span className="inline-flex items-center gap-1" title={address}>
    <span>{display || formatAddressShort(address, keep, SS58_PREFIX)}</span>
    {verified && <ShieldCheckIcon className="w-5 h-5 text-green-600" />}
  </span>
);
