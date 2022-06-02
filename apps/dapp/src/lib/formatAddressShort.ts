export const formatAddressShort = (address: string, keep = 4) => {
  return `${address.substring(0, keep)}…${address.substring(
    address.length - keep
  )}`;
};
