import { useApi } from "../../lib/ApiContext";
import { useSettings } from "../../lib/SettingsContext";
import { ReactNode } from "react";

const LinkButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button type="button" className="text-zinc-300 underline" onClick={onClick}>
    {children}
  </button>
);

export const LightClientConnecting = () => {
  const { lightClient, toggleLightClient } = useSettings();
  const api = useApi();

  // only show while connecting using light client
  if (!lightClient || api) return null;

  return (
    <div className="w-64">
      <p className="my-2 font-bold">🕵️ Connecting using light client...</p>
      <p className="text-xs font-medium text-justify text-zinc-400">
        Connecting to GM using light clients spawns a light blockchain node
        right in your browser.
        <br />
        Synchronizing with other nodes may take between 2 and 5 minutes.
        <br />
        <br />
        Please note that this feature is experimental, fully restarting your
        browser (all windows) helps fixing connection issues.
        <br />
        <br />
        If you&apos;re in a hurry,{" "}
        <LinkButton onClick={toggleLightClient}>connect via RPC</LinkButton>.
      </p>
    </div>
  );
};
