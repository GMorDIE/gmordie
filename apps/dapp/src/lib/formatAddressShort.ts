import { encodeAddress } from "@polkadot/util-crypto";

export const formatAddressShort = (
  address: string,
  keep = 4,
  prefix = 7013
) => {
  const formatted = encodeAddress(address, prefix);
  return `${formatted.substring(0, keep)}…${formatted.substring(
    address.length - keep
  )}`;
};
