import { provideContext } from "../../lib/provideContext";
import { useOpenClose } from "../../lib/useOpenClose";

const useIdentityPaneProvider = () => {
  return useOpenClose();
};

export const [IdentityPaneProvider, useIdentityPane] = provideContext(
  useIdentityPaneProvider
);
