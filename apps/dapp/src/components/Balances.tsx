import { useWallet } from "../lib/WalletContext";
import { TOKEN_ID } from "../lib/constants";
import { formatBalance } from "../lib/formatBalance";
import { planckToTokens } from "../lib/planckToTokens";
import { useBalance } from "../lib/useBalance";
import { TokenIcon } from "./TokenIcon";
import { BN, BN_ZERO, BN_TEN } from "@polkadot/util";
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
  const { isLoading, data } = useBalance(token, address);
  const { rawTransferable, formattedTransferable, formattedLocked } =
    useMemo(() => {
      if (isLoading || !data)
        return {
          rawTransferable: "",
          formattedTransferable: "-",
          formattedLocked: "",
        };

      const { transferable, locked, decimals } = data;

      return {
        rawTransferable: planckToTokens(transferable, decimals).toFixed(
          decimals
        ),
        formattedTransferable: formatBalance(transferable, decimals),
        formattedLocked:
          showLocked && locked.gt(BN_ZERO)
            ? formatBalance(locked, decimals)
            : "",
      };
    }, [data, isLoading, showLocked]);

  const lockMessage = useMemo(() => {
    if (showLocked && token === "GM") return "Send a GN to unlock GMs";
    if (showLocked && token === "GN") return "Send a GM to unlock GNs";
    return undefined;
  }, [showLocked, token]);

  return (
    <div className=" text-base flex gap-1 align-bottom">
      <TokenIcon symbol={token} className="inline h-6 w-6" />
      <span
        className="text-xl font-bold ml-1 leading-none"
        title={`${rawTransferable} ${token}`}
      >
        {formattedTransferable}{" "}
        <span className="text-sm font-bold ">{token}</span>
      </span>
      {formattedLocked ? (
        <div>
          <span
            className="text-zinc-300 text-sm items-bottom"
            title={lockMessage}
          >
            (+{formattedLocked} locked)
          </span>
        </div>
      ) : (
        ""
      )}
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
