import { useEffect } from "react";

export const useForceDocumentScroll = () => {
  useEffect(() => {
    //force vertical scrollbar
    document.documentElement.classList.add("overflow-y-scroll");

    return () => {
      document.documentElement.classList.remove("overflow-y-scroll");
    };
  }, []);
};
