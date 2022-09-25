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
    <div className="w-64 text-left">
      <div className="my-3 font-bold">🕵️ Connecting via light client</div>
      <div className="text-xs font-medium text-left text-zinc-400">
        This feature is experimental :<br />
        <ul className="list-disc pl-4">
          <li>
            synchronizing with other parachain nodes may take between 2 and 5
            minutes
          </li>
          <li>
            fully restarting your browser (close all windows) should fix
            connection issues
          </li>
        </ul>
        <br />
        If you&apos;re in a hurry,{" "}
        <LinkButton onClick={toggleLightClient}>connect via RPC</LinkButton>.
      </div>
    </div>
  );
};
