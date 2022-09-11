import { Drawer } from "../../components/Drawer";
import { IdentityForm } from "./IdentityForm";
import { useIdentityPane } from "./context";

export const IdentityPane = () => {
  const { isOpen, close } = useIdentityPane();

  return (
    <Drawer onDismiss={close} show={isOpen} title="On-chain identity">
      <IdentityForm />
    </Drawer>
  );
};
