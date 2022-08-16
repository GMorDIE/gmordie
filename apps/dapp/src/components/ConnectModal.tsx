import { Dialog, Transition } from "@headlessui/react";
import { isWeb3Injected } from "@polkadot/extension-dapp";
import { InjectedWindow } from "@polkadot/extension-inject/types";
import { Fragment, useCallback, useMemo } from "react";

import { ReactComponent as TalismanLogo } from "../assets/talisman-white.svg";
import { useWallet } from "../lib/WalletContext";
import { Button } from "./Button";

const ELON_MUSK_WALLET_KEY = "elon-musk-wallet"
const injectedWindow = window as Window & InjectedWindow;

export const ConnectModal = () => {
  const { connect, isConnectModalOpen, closeConnectModal } = useWallet();

  const connectTo = useCallback(
    (walletKey: string) => () => {
      if (walletKey === ELON_MUSK_WALLET_KEY)
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      else connect(walletKey);
    },
    [connect]
  );

  const nonTalismanWalletKeys = useMemo(() => {
    if (!isWeb3Injected) return [];
    // pjs appears first
    const frenWalletKeys = ["polkadot-js"].filter(
      (key) => injectedWindow.injectedWeb3[key]
    );
    const otherWalletKeys = Object.keys(injectedWindow.injectedWeb3).filter(
      (key) => !frenWalletKeys.includes(key) && key !== "talisman"
    );
    return [...frenWalletKeys, ...otherWalletKeys];
  }, []);

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
                  <Button
                    onClick={connectTo("talisman")}
                    className="h-12 text-xl normal-case  flex items-center justify-center gap-2 px-3 "
                  >
                    <TalismanLogo className=" text-2xl" />
                    Talisman
                  </Button>
                  {nonTalismanWalletKeys.map((key) => (
                    <Button
                      key={key}
                      onClick={connectTo(key)}
                      className="h-12 text-xl normal-case  flex items-center justify-center gap-2 px-3 "
                    >
                      😢 {key}
                    </Button>
                  ))}
                  <Button
                    key={ELON_MUSK_WALLET_KEY}
                    onClick={connectTo(ELON_MUSK_WALLET_KEY)}
                    className="h-12 text-xl normal-case  flex items-center justify-center gap-2 px-3 "
                  >
                    ✨ Elon Musk wallet
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
