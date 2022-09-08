import { IconSend } from "../../assets/icons";
import { Button } from "../../components/Button";
import { useWallet } from "../../lib/WalletContext";
import { SendModal } from "./SendModal";
import { SendModalProvider, useSendModal } from "./context";

const SendButtonInner = () => {
  const { open } = useSendModal();
  const { account } = useWallet();

  if (!account) return null;

  return (
    <Button
      onClick={open}
      title="Send GM or GN"
      className="flex gap-2 text-sm items-center border !py-1"
    >
      <span>Send it!</span>
      <IconSend className="h-4 w-4" />
    </Button>
  );
};

export const SendButton = () => {
  return (
    <SendModalProvider>
      <SendButtonInner />
      <SendModal />
    </SendModalProvider>
  );
};
