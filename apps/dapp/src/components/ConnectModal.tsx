import { useWallet } from "../lib/WalletContext";
import { injectedWindow } from "../lib/injectedWindow";
import { KnownWallet, knownWallets } from "../lib/knownWallets";
import { Button } from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useMemo } from "react";

export const ConnectModal = () => {
  const { connect, isConnectModalOpen, closeConnectModal } = useWallet();

  const connectWallet = useCallback(
    (wallet: KnownWallet) => () => {
      console.log("condition", wallet.condition);
      // if there is a condition, check for it
      if (wallet.condition !== undefined && !wallet.condition) {
        window.open(wallet.downloadUrl, "_blank");
      }
      // if wallet isn't injected, redirect to download url
      else if (!injectedWindow.injectedWeb3[wallet.injectedKey]) {
        window.open(wallet.downloadUrl, "_blank");
      } else {
        connect(wallet.injectedKey);
      }
    },
    [connect]
  );

  const connectTo = useCallback(
    (walletKey: string) => () => {
      connect(walletKey);
    },
    [connect]
  );

  const unknownWalletKeys = useMemo(() => {
    return Object.keys(injectedWindow.injectedWeb3 ?? {}).filter(
      (key) => !knownWallets.find((wallet) => wallet.injectedKey === key)
    );
    // some wallets (ex parallel) inject after this component renders
    // adding this dep ensures the list is up to date when displayed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnectModalOpen]);

  return (
    <Transition appear show={isConnectModalOpen} as={Fragment}>
      <Dialog open onClose={closeConnectModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" z-20 fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className=" z-30 fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm overflow-hidden rounded-md bg-background p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6">
                  Connect Wallet
                </Dialog.Title>
                <p className="py-4 text-lg">
                  Best frens connect using Talisman!
                </p>
                <div className="flex flex-col gap-4">
                  {knownWallets.map((wallet) => {
                    const { id, name, logo: Logo } = wallet;
                    return (
                      <Button
                        key={id}
                        onClick={connectWallet(wallet)}
                        className="h-12 text-xl normal-case flex items-center justify-center gap-2 px-3 "
                      >
                        {Logo ? <Logo className="text-2xl w-6 h-6" /> : null}{" "}
                        {name}
                      </Button>
                    );
                  })}
                  {unknownWalletKeys.map((key, idx) => (
                    <Button
                      key={`${key}-${idx}`}
                      onClick={connectTo(key)}
                      className="h-12 text-xl normal-case  flex items-center justify-center gap-2 px-3 "
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
