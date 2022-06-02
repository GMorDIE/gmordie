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
  const { free, tokenDecimals } = useBalance(address, token);
  return (
    <div className="items-center text-base">
      {token === "FREN" && <FrenCoin className="inline h-10" />}
      {token === "GM" && <GmCoin className="inline h-10" />}
      {token === "GN" && <GnCoin className="inline h-10" />}
      <span className="text-xl font-bold" title={free}>
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
    <div className="flex flex-col ">
      <Balance address={account.address} token="FREN" />
      <Balance address={account.address} token="GM" />
      <Balance address={account.address} token="GN" />
    </div>
  );
};
