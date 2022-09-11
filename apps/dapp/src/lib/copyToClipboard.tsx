import { Address } from "../components/Address";
import { showToast } from "./showToast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(
      {
        title: "Copied to clipboard",
        description: <Address address={text} />,
        type: "success",
      },
      { duration: 2000 }
    );
  } catch (err) {
    showToast({
      title: "Failed to copy address",
      description: (err as Error)?.message,
      type: "error",
    });
  }
};
