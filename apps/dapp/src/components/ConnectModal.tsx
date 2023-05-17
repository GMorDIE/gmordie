import { useWallet } from "../lib/WalletContext";
import { Button } from "./Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const ConnectModal = () => {
  const { connect, isConnectModalOpen, closeConnectModal } = useWallet();

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
                  Connect your Wallet
                </Dialog.Title>
                <div className="flex flex-col gap-4 mt-4">
                  <Button
                    onClick={connect}
                    className="min-h-[4rem] normal-case flex flex-col items-start justify-center px-3 "
                  >
                    <div className="text-lg font-bold text-left">
                      Injected Wallet
                    </div>
                    <div className="text-sm font-semibold opacity-80 text-left">
                      Talisman, Polkadot.js, Nova, SubWallet, etc.
                    </div>
                  </Button>
                  <Button
                    onClick={connect}
                    disabled
                    className="min-h-[4rem] normal-case flex flex-col items-start justify-center px-3 "
                  >
                    <div className="text-lg font-bold  text-left">
                      Wallet Connect
                    </div>
                    <div className="text-sm font-semibold opacity-80  text-left">
                      Coming soon...
                    </div>
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
