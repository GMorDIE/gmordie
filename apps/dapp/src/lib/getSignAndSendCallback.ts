import { showToast } from "./showToast";
import { ISubmittableResult } from "@polkadot/types/types";

export const getSignAndSendCallback = () => {
  let id = "";

  return async (result: ISubmittableResult) => {
    if (!id) {
      id = showToast(
        {
          title: "Submitting transaction",
          description: "Cross your fingers fren...",
          type: "loading",
        },
        {
          duration: Infinity,
        }
      );
    }

    const ngmi = result.findRecord("system", "ExtrinsicFailed");

    if (ngmi || result.isError) {
      console.error("Transaction failed", {
        dispatchError: result.dispatchError?.toHuman(true),
        internalError: result.dispatchError?.toHuman(true),
        failedExtrinsic: ngmi?.toHuman(true),
      });
      showToast(
        {
          title: "Transaction failed",
          description: "༼☯﹏☯༽ NGMI...",
          type: "error",
        },
        {
          id,
          duration: Infinity,
        }
      );
    } else if (result.isInBlock) {
      showToast(
        {
          title: "Submitted",
          description: "Waiting for confirmation...",
          type: "loading",
        },
        {
          id,
          duration: Infinity,
        }
      );
    } else if (result.isCompleted || result.isFinalized) {
      showToast(
        {
          title: "Success",
          description: "Nailed it! 🤘",
          type: "success",
        },
        {
          id,
          duration: 2000,
        }
      );
    }
  };
};