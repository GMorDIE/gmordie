import { Address } from "../components/Address";
import { ToastContent } from "../components/ToastContent";
import toast from "react-hot-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.custom((t) => (
      <ToastContent
        t={t}
        title="Copied to clipboard"
        description={<Address address={text} />}
        type="success"
      />
    ));
  } catch (err) {
    toast.custom((t) => (
      <ToastContent
        t={t}
        title="Failed to copy address"
        description={(err as Error)?.message}
        type="error"
      />
    ));
  }
};
