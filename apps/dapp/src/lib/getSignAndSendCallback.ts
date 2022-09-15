import { showToast } from "./showToast";
import { ISubmittableResult } from "@polkadot/types/types";

export const getSignAndSendCallback = () => {
  let id = "";
  let finished = false;

  return async ({ events, status }: ISubmittableResult) => {
    // prevents error to be displayed multiple times
    if (finished) return;

    if (status.isInvalid) {
      showToast(
        {
          title: "Transaction is invalid",
          description: "༼☯﹏☯༽ NGMI...",
          type: "error",
        },
        {
          id,
          duration: Infinity,
        }
      );
      finished = true;
    } else if (status.isReady) {
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
    } else if (status.isBroadcast) {
      showToast(
        {
          title: "Submitting transaction",
          description: "Waiting to be included in a block...",
          type: "loading",
        },
        {
          id,
          duration: Infinity,
        }
      );
    } else if (status.isInBlock) {
      showToast(
        {
          title: "Transaction accepted",
          description: "Waiting for confirmation...",
          type: "pending",
        },
        {
          id,
          duration: Infinity,
        }
      );
    } else if (status.isFinalized) {
      const success = events.find(
        ({ event }) => event.method === "ExtrinsicSuccess"
      );
      const failed = events.find(
        ({ event }) => event.method === "ExtrinsicFailed"
      );

      if (success) {
        showToast(
          {
            title: "Success",
            description: "Nailed it! 🤘",
            type: "success",
          },
          {
            id,
            duration: 3000,
          }
        );
        finished = true;
      } else if (failed) {
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
        finished = true;
        console.error(failed.toHuman(true));
      } else throw new Error("unknown transaction result");
    }
  };
};
