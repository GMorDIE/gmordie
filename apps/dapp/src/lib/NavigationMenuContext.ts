import { provideContext } from "./provideContext";
import { useOpenClose } from "./useOpenClose";

export const useNavigationMenuProvider = () => {
  return useOpenClose();
};

export const [NavigationMenuProvider, useNavigationMenu] = provideContext(
  useNavigationMenuProvider
);
