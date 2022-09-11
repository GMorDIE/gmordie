import { SS58_PREFIX } from "../lib/constants";
import { formatAddressShort } from "../lib/formatAddressShort";

export const Address = ({
  address,
  keep = 6,
}: {
  address: string;
  keep?: number;
}) => {
  return <>{formatAddressShort(address, keep, SS58_PREFIX)}</>;
};
