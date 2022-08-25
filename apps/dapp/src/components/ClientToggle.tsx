import { useSettings } from "../lib/SettingsContext";
import { Button } from "./Button";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

export const ClientToggle = () => {
  const { lightClient, toggleLightClient } = useSettings();

  return (
    <Button
      onClick={toggleLightClient}
      title={lightClient ? "Use GMorDIE RPC" : "Use light client"}
    >
      {lightClient ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </Button>
  );
};
