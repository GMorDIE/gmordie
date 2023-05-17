import { useWallet } from "../lib/WalletContext";
import { copyToClipboard } from "../lib/copyToClipboard";
import { HeaderButton } from "./HeaderButton";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";

export const CopyAddressButton = () => {
  const { address } = useWallet();

  const handleClick = useCallback(() => {
    if (!address) return;
    copyToClipboard(address);
  }, [address]);

  if (!address) return null;

  return (
    <HeaderButton
      text="Receive"
      title="Copy address to clipboard"
      onClick={handleClick}
      icon={DocumentDuplicateIcon}
    />
  );
};
