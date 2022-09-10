import { useWallet } from "../lib/WalletContext";
import { TOKEN_ID } from "../lib/constants";
import { formatBalance } from "../lib/formatBalance";
import { useBalance } from "../lib/useBalance";
import { TokenIcon } from "./TokenIcon";
import { useMemo } from "react";

export const Balance = ({
  address,
  token,
  showLocked,
}: {
  address: string;
  token: TOKEN_ID;
  showLocked?: boolean;
}) => {
  const { free, locked, decimals } = useBalance(token, address);
  const formattedLocked = useMemo(
    () => (showLocked && locked ? formatBalance(locked, decimals) : "0"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decimals, locked]
  );

  return (
    <div className=" text-base flex gap-1">
      <TokenIcon symbol={token} className="inline h-6 w-6" />
      <span className="text-xl font-bold ml-1 leading-none" title={free}>
        {free ? `${formatBalance(free, decimals)}` : "-"}
        {showLocked && formattedLocked !== "0" ? ` (+${formattedLocked})` : ""}
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
      <Balance address={account.address} token="GM" showLocked />
      <Balance address={account.address} token="GN" showLocked />
    </div>
  );
};
