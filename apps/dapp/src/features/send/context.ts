import { isValidAddress } from "../../lib/isValidAddress";
import { provideContext } from "../../lib/provideContext";
import { useOpenClose } from "../../lib/useOpenClose";
import { useCallback, useState } from "react";

const useSendPaneProvider = () => {
  const openClose = useOpenClose();
  const [copyAddressesHub, setCopyAddressesHub] = useState<string[]>([]);

  const sendToAddress = useCallback((address: string) => {
    if (!isValidAddress(address)) return false;
    setCopyAddressesHub((prev) => [...prev, address]);
  }, []);

  const pullAddress = useCallback(() => {
    if (copyAddressesHub.length) return copyAddressesHub.splice(0, 1)[0];
  }, [copyAddressesHub]);

  return { ...openClose, sendToAddress, pullAddress };
};

export const [SendPaneProvider, useSendPane] =
  provideContext(useSendPaneProvider);
