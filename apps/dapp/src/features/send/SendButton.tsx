import { Button } from "../../components/Button";
import { useWallet } from "../../lib/WalletContext";
import { SendModal } from "./SendModal";
import { SendModalProvider, useSendModal } from "./context";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

const SendButtonInner = () => {
  const { open } = useSendModal();
  const { account } = useWallet();

  if (!account) return null;

  return (
    <Button onClick={open} title="Send GM or GN">
      <PaperAirplaneIcon className="w-6 h-6 rotate-90" />
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
