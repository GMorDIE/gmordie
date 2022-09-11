import { useApi } from "../lib/ApiContext";
import { useWallet } from "../lib/WalletContext";
import { SS58_PREFIX } from "../lib/constants";
import { getSignAndSendCallback } from "../lib/getSignAndSendCallback";
import { showToast } from "../lib/showToast";
import { tokensToPlanck } from "../lib/tokensToPlanck";
import { useBalance } from "../lib/useBalance";
import { Button } from "./Button";
import { BN } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useMemo, useState } from "react";

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
          .signAndSend(
            encodeAddress(address, SS58_PREFIX),
            getSignAndSendCallback()
          );
      }
      setWorking(false);
    } catch (err) {
      console.error(err);
      const { message, cause } = err as Error;
      const description = typeof cause === "string" ? cause : undefined;
      showToast({
        title: message,
        description,
        type: "error",
      });
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
