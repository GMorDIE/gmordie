import { useWallet } from "../lib/WalletContext";
import { TOKEN_ID } from "../lib/constants";
import { formatBalance } from "../lib/formatBalance";
import { useBalance } from "../lib/useBalance";
import { TokenIcon } from "./TokenIcon";
import { useMemo } from "react";

export const Balance = ({
  address,
  token,
}: {
  address: string;
  token: TOKEN_ID;
}) => {
  const { free, locked, decimals } = useBalance(token, address);
  const formattedLocked = useMemo(
    () => (locked ? formatBalance(locked, decimals) : "0"),
    [decimals, locked]
  );

  return (
    <div className=" text-base flex gap-1">
      <TokenIcon symbol={token} className="inline h-6 w-6" />
      <span className="text-xl font-bold ml-1 leading-none" title={free}>
        {free ? `${formatBalance(free, decimals)}` : "-"}
        {formattedLocked !== "0" ? ` (+${formattedLocked})` : ""}
      </span>{" "}
      <span className="font-normal text-zinc-300">{token}</span>
    </div>
  );
};

export const Balances = () => {
  const { account } = useWallet();

  if (!account) return null;

  return (
    <div className="flex flex-col gap-2">
      <Balance address={account.address} token="FREN" />
      <Balance address={account.address} token="GM" />
      <Balance address={account.address} token="GN" />
    </div>
  );
};
