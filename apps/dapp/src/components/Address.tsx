import { formatAddressShort } from "../lib/formatAddressShort";

export const Address = ({
  address,
  keep = 6,
}: {
  address: string;
  keep?: number;
}) => {
  //const api = useApi();

  // const prefix = useMemo(
  //   () => api?.registry.chainSS58,
  //   []
  // );

  return <>{formatAddressShort(address, keep, 7013)}</>;
};
