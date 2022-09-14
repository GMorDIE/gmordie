import { IconSend } from "../../assets/icons";
import { HeaderButton } from "../../components/HeaderButton";
import { useWallet } from "../../lib/WalletContext";
import { useSendModal } from "./context";

export const SendButton = () => {
  const { open } = useSendModal();
  const { account } = useWallet();

  if (!account) return null;

  return (
    <HeaderButton
      text="Send it!"
      title="Send GM or GN"
      onClick={open}
      icon={IconSend}
    />
  );
};
