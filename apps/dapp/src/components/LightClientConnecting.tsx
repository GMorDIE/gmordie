import { useApi } from "../lib/ApiContext";
import { useSettings } from "../lib/SettingsContext";
import { ReactNode, useCallback } from "react";

const LinkButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button type="button" className="text-white underline" onClick={onClick}>
    {children}
  </button>
);

export const LightClientConnecting = () => {
  const { lightClient, toggleLightClient } = useSettings();
  const api = useApi();

  const handleExtensionClick = useCallback(() => {
    window.open(
      "https://chrome.google.com/webstore/detail/substrate-connect-extensi/khccbhhbocaaklceanjginbdheafklai",
      "_blank"
    );
  }, []);

  // only show while connecting using light client
  if (!lightClient || api) return null;

  return (
    <div className="w-64">
      <p className="my-2">Connecting using light client...</p>
      <p>
        If experiencing issues ensure that{" "}
        <LinkButton onClick={handleExtensionClick}>
          Substrate Connect
        </LinkButton>{" "}
        is installed, or{" "}
        <LinkButton onClick={toggleLightClient}>connect using RPC</LinkButton>
      </p>
    </div>
  );
};
