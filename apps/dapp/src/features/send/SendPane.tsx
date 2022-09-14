import { Drawer } from "../../components/Drawer";
import { SendForm } from "./SendForm";
import { useSendPane } from "./context";

export const SendPane = () => {
  const { isOpen, close } = useSendPane();

  return (
    <Drawer onDismiss={close} show={isOpen} title="Send it!">
      <SendForm />
    </Drawer>
  );
};
