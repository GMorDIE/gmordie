import { Address } from "../components/Address";
import { showToast } from "./showToast";
import copy from "copy-to-clipboard";

export const copyToClipboard = (text: string) => {
  try {
    if (!copy(text)) throw new Error("Unknown error 🤷‍♂️");

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
      title: "Failed to copy",
      description: (err as Error)?.message,
      type: "error",
    });
  }
};
