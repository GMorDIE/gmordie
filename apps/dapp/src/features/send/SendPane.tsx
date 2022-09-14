import { Drawer } from "../../components/Drawer";
import { SendForm } from "./SendForm";
import { useSendModal } from "./context";

export const SendPane = () => {
  const { isOpen, close } = useSendModal();

  return (
    <Drawer onDismiss={close} show={isOpen} title="Send it!">
      <SendForm />
    </Drawer>
  );
};
