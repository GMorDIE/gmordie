import { provideContext } from "../../lib/provideContext";
import { useOpenClose } from "../../lib/useOpenClose";

const useSendModalProvider = () => {
  return useOpenClose();
};

export const [SendModalProvider, useSendModal] =
  provideContext(useSendModalProvider);
