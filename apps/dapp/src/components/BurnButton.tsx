import { encodeAddress } from "@polkadot/keyring";
import { BN } from "@polkadot/util";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

import { useApi } from "../lib/ApiContext";
import { useWallet } from "../lib/WalletContext";
import { Button } from "./Button";
import { ToastContent } from "./ToastContent";

export const BurnButton = () => {
  const [working, setWorking] = useState(false);
  const { account, openConnectModal } = useWallet();
  const api = useApi();

  const handleBurn = useCallback(async () => {
    try {
      setWorking(true);
      if (!account) {
        await openConnectModal();
      } else {
        const frenDecimals = api.registry.chainDecimals[0];

        // always burn 10
        const tokenAmount = new BN("10");
        const tokenDecimals = new BN(frenDecimals);
        const base = new BN("10");

        const amount = tokenAmount.mul(base.pow(tokenDecimals));

        let waitingToast = "";

        const unsubscribe = await api.tx.currencies
          .burnFren(amount.toString())
          .signAndSend(
            encodeAddress(account.address, api.registry.chainSS58),
            (result) => {
              if (waitingToast) toast.dismiss(waitingToast);

              if (result.status.isInBlock) {
                waitingToast = toast.custom(
                  (t) => (
                    <ToastContent
                      t={t}
                      title="⌚ Transaction submitted"
                      description="Waiting for confirmation..."
                    />
                  ),
                  { duration: 30_000 }
                );
              } else if (result.isError) {
                toast.custom((t) => (
                  <ToastContent t={t} title="❌ Transaction error" />
                ));
                unsubscribe();
              } else if (result.status.isFinalized) {
                toast.custom((t) => (
                  <ToastContent t={t} title="✅ Transaction succeded" />
                ));
                unsubscribe();
              } else if (result.status.isDropped) {
                toast.custom((t) => (
                  <ToastContent t={t} title="❌ Transaction dropped" />
                ));
                unsubscribe();
              } else if (result.status.isFinalityTimeout) {
                toast.custom((t) => (
                  <ToastContent t={t} title="❌ Transaction timeout" />
                ));
                unsubscribe();
              } else if (result.status.isInvalid) {
                toast.custom((t) => (
                  <ToastContent t={t} title="❌ Transaction invalid" />
                ));
                unsubscribe();
              }
            }
          );
      }
      setWorking(false);
    } catch (err) {
      toast((err as Error).message);
      console.log("WTF", { err });
      console.error(err);
      setWorking(false);
    }
  }, [
    account,
    api.registry.chainDecimals,
    api.registry.chainSS58,
    api.tx.currencies,
    openConnectModal,
  ]);

  return (
    <Button
      className="my-4 w-full"
      color="salmon"
      onClick={handleBurn}
      disabled={working}
    >
      {account ? "Sacrifice 10 $FREN" : "Connect Wallet"}
    </Button>
  );
};
