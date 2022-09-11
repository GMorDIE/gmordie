import { IconSend } from "../../assets/icons";
import { Button } from "../../components/Button";
import { HeaderButton } from "../../components/HeaderButton";
import { useWallet } from "../../lib/WalletContext";
import { SendPane } from "./SendPane";
import { SendModalProvider, useSendModal } from "./context";

const SendButtonInner = () => {
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

export const SendButton = () => {
  return (
    <SendModalProvider>
      <SendButtonInner />
      <SendPane />
    </SendModalProvider>
  );
};
