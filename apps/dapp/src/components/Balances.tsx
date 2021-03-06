import { ReactComponent as FrenCoin } from "../assets/fren-coin.svg";
import { ReactComponent as GmCoin } from "../assets/gm-coin.svg";
import { ReactComponent as GnCoin } from "../assets/gn-coin.svg";
import { formatBalance } from "../lib/formatBalance";
import { useBalance } from "../lib/useBalance";
import { useWallet } from "../lib/WalletContext";

export const Balance = ({
  address,
  token,
}: {
  address: string;
  token: string;
}) => {
  const { free, decimals: tokenDecimals } = useBalance(address, token);
  if (tokenDecimals === undefined) return null;
  return (
    <div className=" text-base flex gap-1">
      {token === "FREN" && <FrenCoin className="inline h-6 w-6" />}
      {token === "GM" && <GmCoin className="inline h-6 w-6" />}
      {token === "GN" && <GnCoin className="inline h-6 w-6" />}
      <span className="text-xl font-bold ml-1 leading-none" title={free}>
        {free ? `${formatBalance(free, tokenDecimals)}` : "-"}
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
