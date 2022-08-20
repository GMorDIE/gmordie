import { ReactComponent as FrenCoin } from "../assets/fren-coin.svg";
import { ReactComponent as GmCoin } from "../assets/gm-coin.svg";
import { ReactComponent as GnCoin } from "../assets/gn-coin.svg";
import { useWallet } from "../lib/WalletContext";
import { TOKEN_ID } from "../lib/constants";
import { formatBalance } from "../lib/formatBalance";
import { useBalance } from "../lib/useBalance";

export const Balance = ({
  address,
  token,
}: {
  address: string;
  token: TOKEN_ID;
}) => {
  const { free, decimals } = useBalance(token, address);
  return (
    <div className=" text-base flex gap-1">
      {token === "FREN" && <FrenCoin className="inline h-6 w-6" />}
      {token === "GM" && <GmCoin className="inline h-6 w-6" />}
      {token === "GN" && <GnCoin className="inline h-6 w-6" />}
      <span className="text-xl font-bold ml-1 leading-none" title={free}>
        {free ? `${formatBalance(free, decimals)}` : "-"}
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
