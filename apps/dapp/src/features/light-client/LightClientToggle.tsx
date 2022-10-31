import { Button } from "../../components/Button";
import { useSettings } from "../../lib/SettingsContext";
import { useOpenClose } from "../../lib/useOpenClose";
import { LightClientModal } from "./LightClientModal";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

export const LightClientToggle = () => {
  const { lightClient, toggleLightClient } = useSettings();
  const { isOpen, open, close } = useOpenClose();

  // TODO remove when it works again
  return null;

  return (
    <>
      <Button
        onClick={lightClient ? toggleLightClient : open}
        title={lightClient ? "Use GMorDIE RPC" : "Use light client"}
      >
        {lightClient ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </Button>
      <LightClientModal isOpen={isOpen} onClose={close} />
    </>
  );
};
