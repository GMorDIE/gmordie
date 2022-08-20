import { useApi } from "../lib/ApiContext";
import { formatAddressShort } from "../lib/formatAddressShort";
import { useMemo } from "react";

export const Address = ({
  address,
  keep = 4,
}: {
  address: string;
  keep?: number;
}) => {
  const api = useApi();

  const prefix = useMemo(
    () => api?.registry.chainSS58,
    [api?.registry.chainSS58]
  );

  return <>{formatAddressShort(address, keep, prefix)}</>;
};