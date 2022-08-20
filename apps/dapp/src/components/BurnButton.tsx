import { useApi } from "../lib/ApiContext";
import { useWallet } from "../lib/WalletContext";
import { Button } from "./Button";
import { ToastContent } from "./ToastContent";
import { encodeAddress } from "@polkadot/keyring";
import { BN } from "@polkadot/util";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export const BurnButton = () => {
  const [working, setWorking] = useState(false);
  const { account, openConnectModal, isReady } = useWallet();
  const api = useApi();

  const handleBurn = useCallback(async () => {
    if (!api) return;
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

              const fail = result.findRecord("system", "ExtrinsicFailed");
              if (fail || result.dispatchError || result.isError) {
                toast.custom((t) => (
                  <ToastContent
                    t={t}
                    title="Doh !"
                    description="Transaction failed 😭"
                    type="error"
                  />
                ));
                unsubscribe();
                return;
              }

              if (result.status.isInBlock) {
                waitingToast = toast.custom((t) => (
                  <ToastContent
                    t={t}
                    title="Success"
                    description="Well done fren!"
                    type="success"
                  />
                ));
                unsubscribe();
              } else if (result.status.isFinalized) {
                toast.custom((t) => (
                  <ToastContent
                    t={t}
                    title="Success"
                    description="Well done fren!"
                    type="success"
                  />
                ));
                unsubscribe();
              } else if (result.status.isDropped) {
                toast.custom((t) => (
                  <ToastContent
                    t={t}
                    title="Oops"
                    description="Your transaction was dropped"
                    type="error"
                  />
                ));
                unsubscribe();
              } else if (result.status.isFinalityTimeout) {
                toast.custom((t) => (
                  <ToastContent
                    t={t}
                    title="Oops"
                    description="This looks like a timeout"
                    type="error"
                  />
                ));
                unsubscribe();
              } else if (result.status.isInvalid) {
                toast.custom((t) => (
                  <ToastContent
                    type="error"
                    t={t}
                    title="Transaction invalid"
                  />
                ));
                unsubscribe();
              }
            }
          );
      }
      setWorking(false);
    } catch (err) {
      const { message, cause } = err as Error;
      const description = typeof cause === "string" ? cause : cause?.message;
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
  }, [account, api, openConnectModal]);

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
