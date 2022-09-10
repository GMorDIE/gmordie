import { useApi } from "../lib/ApiContext";
import { useWallet } from "../lib/WalletContext";
import { getSignAndSendCallback } from "../lib/getSignAndSendCallback";
import { tokensToPlanck } from "../lib/tokensToPlanck";
import { useBalance } from "../lib/useBalance";
import { Button } from "./Button";
import { ToastContent } from "./ToastContent";
import { BN } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export const BurnButton = () => {
  const [working, setWorking] = useState(false);
  const { account, openConnectModal, isReady, address } = useWallet();
  const { free, decimals } = useBalance("FREN", account?.address);
  const api = useApi();

  const handleBurn = useCallback(async () => {
    if (!api) return;

    try {
      setWorking(true);
      if (!account) {
        await openConnectModal();
      } else {
        if (!address) throw new Error("Account not found");

        // always burn 10
        const amountToBurn = tokensToPlanck("10", decimals);

        // check if account has enough to burn
        if (!free || new BN(free ?? "0").lte(amountToBurn))
          throw new Error("You don't have enough FRENs!");

        await api.tx.currencies
          .burnFren(amountToBurn.toString())
          .signAndSend(encodeAddress(address, 7013), getSignAndSendCallback());
      }
      setWorking(false);
    } catch (err) {
      const { message, cause } = err as Error;
      const description = typeof cause === "string" ? cause : undefined;
      toast.custom((t) => (
        <ToastContent
          type="error"
          t={t}
          title={message}
          description={description}
        />
      ));
      console.error(err);
      setWorking(false);
    }
  }, [account, address, api, decimals, free, openConnectModal]);

  const label = useMemo(() => {
    if (!isReady) return null;
    return account ? "Sacrifice 10 $FREN" : "Connect Wallet";
  }, [account, isReady]);

  return (
    <Button
      className="my-4 w-full h-10"
      color="salmon"
      onClick={handleBurn}
      disabled={working}
    >
      {label}
    </Button>
  );
};
