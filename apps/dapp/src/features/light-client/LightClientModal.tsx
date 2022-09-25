import { Button } from "../../components/Button";
import { ModalDialog } from "../../components/ModalDialog";
import { useSettings } from "../../lib/SettingsContext";
import { isSubstrateConnectInstalled } from "./isSubstrateConnectInstalled";
import { FC, useCallback } from "react";

const FIREFOX_INSTALL_URL =
  "https://addons.mozilla.org/en-US/firefox/addon/substrate-connect/";
const CHROME_INSTALL_URL =
  "https://chrome.google.com/webstore/detail/substrate-connect-extensi/khccbhhbocaaklceanjginbdheafklai?hl=en-US";

const getInstallUrl = () =>
  navigator?.userAgent?.includes("Firefox")
    ? FIREFOX_INSTALL_URL
    : CHROME_INSTALL_URL;

type LightClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LightClientModal: FC<LightClientModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setLightClient } = useSettings();

  const handleSelect = useCallback(
    (withLightClient: boolean) => () => {
      setLightClient(withLightClient);
      onClose();
    },
    [onClose, setLightClient]
  );

  return (
    <ModalDialog title="Light client" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-2 font-medium text-zinc-300">
        <p>Nothing shall stop you from GMing your frens!</p>
        <p>
          Turning this experimental feature on will spawn a blockchain node
          inside your browser to securely connect to the GM parachain without
          relying on centralized 3rd parties.
        </p>
        {!isSubstrateConnectInstalled() && (
          <p>
            It&apos;s temporary but for now, connecting to a parachain requires
            a browser extension.
            <br />
            To get started,{" "}
            <a
              className="text-white font-bold"
              href={getInstallUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Install Substrate Connect
            </a>
          </p>
        )}
        <div className="h-1"></div>
        <div className="flex justify-end gap-4">
          <Button onClick={handleSelect(false)}>Nah, use RPC</Button>
          <Button
            disabled={!isSubstrateConnectInstalled()}
            onClick={handleSelect(true)}
          >
            Use light client
          </Button>
        </div>
      </div>
    </ModalDialog>
  );
};
