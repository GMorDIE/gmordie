import { useIdentityPane } from "../features/identity/context";
import { useWallet } from "../lib/WalletContext";
import { useIsMounted } from "../lib/useIsMounted";
import { Address } from "./Address";
import { Button } from "./Button";
import { Popover, Transition } from "@headlessui/react";
import { XMarkIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import Identicon from "@polkadot/react-identicon";
import clsx from "clsx";
import { Fragment } from "react";
import { useCallback } from "react";

export const ConnectButton = () => {
  const { openConnectModal } = useWallet();
  const isMounted = useIsMounted();

  return (
    <Button
      className={clsx(
        "flex items-center p-0 py-0 px-4 opacity-0 transition-opacity",
        isMounted && "opacity-100"
      )}
      onClick={openConnectModal}
    >
      Connect
    </Button>
  );
};

export const AccountIcon = ({
  account,
  size = 32,
}: {
  account: InjectedAccountWithMeta;
  size?: number;
}) => {
  const acc = account as InjectedAccountWithMeta & { avatar?: string };
  return acc?.avatar ? (
    <img
      width={size}
      height={size}
      src={acc.avatar}
      alt={acc.meta.name ?? acc.address}
    />
  ) : (
    <Identicon value={acc.address} size={size} theme="polkadot" />
  );
};

export const AccountSwitchButton = () => {
  const isMounted = useIsMounted();
  const {
    account: currentAccount,
    connectedAccounts,
    select,
    disconnect,
  } = useWallet();
  const { open: openIdentityPane } = useIdentityPane();

  const handleSelectAccount = useCallback(
    (account: InjectedAccountWithMeta, closePopover: () => void) => () => {
      select(account);
      closePopover();
    },
    [select]
  );

  // this won't happen, this is only for ts
  if (!currentAccount) return null;

  return (
    <Popover className="h-full">
      {({ close }) => (
        <>
          <Popover.Button
            className={clsx(
              "flex items-center p-2 py-0 px-3 gap-2 h-full outline-none hover:bg-salmon-400 opacity-0 transition-opacity",
              isMounted && "opacity-100"
            )}
          >
            <div className="hidden sm:flex max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap flex-col text-right">
              <div className="text-sm">{currentAccount.meta.name}</div>
              <div className="text-xs opacity-50">
                <Address address={currentAccount.address} keep={4} />
              </div>
            </div>
            <AccountIcon account={currentAccount} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="flex fixed right-1 z-10 flex-col max-w-[250px] bg-zinc-900 rounded-md sm:max-w-[300px] max-h-[calc(100%_-_3rem)] overflow-auto">
              {connectedAccounts?.map((account) => (
                <button
                  key={`${account.meta.source}-${account.address}`}
                  className={clsx(
                    "flex gap-3 items-center p-3 py-2 text-sm font-bold  text-left hover:bg-zinc-800 rounded-md sm:text-base",
                    account.address === currentAccount?.address &&
                      account.meta.source === currentAccount.meta.source &&
                      "font-bold bg-zinc-800 cursor-default"
                  )}
                  onClick={handleSelectAccount(account, close)}
                >
                  <div className="flex flex-col justify-center relative min-w-fit">
                    <AccountIcon account={account} />
                  </div>
                  <div className={clsx("flex overflow-hidden flex-col grow")}>
                    <div className="overflow-hidden max-w-full text-ellipsis whitespace-nowrap flex items-center">
                      <div className="grow overflow-hidden max-w-full text-ellipsis whitespace-nowrap ">
                        {account.meta.name} ({account.meta.source})
                      </div>
                    </div>
                    <div className="font-mono text-zinc-500">
                      <Address address={account.address} keep={4} />
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={openIdentityPane}
                className="flex gap-3 items-center p-3 py-2 text-sm font-bold text-left hover:bg-zinc-800 rounded-md sm:text-base"
              >
                <div className="flex flex-col justify-center relative min-w-fit">
                  <UserCircleIcon className="h-8 text-zinc-300" />
                </div>
                <div className={clsx("flex overflow-hidden flex-col grow")}>
                  <div className="overflow-hidden max-w-full text-ellipsis whitespace-nowrap flex items-center">
                    <div className="grow overflow-hidden max-w-full text-ellipsis whitespace-nowrap ">
                      Account ID
                    </div>
                  </div>
                  <div className="font-mono text-zinc-500">
                    On-chain identity
                  </div>
                </div>
              </button>
              <button
                onClick={disconnect}
                className="flex gap-3 items-center p-3 py-2 text-sm font-bold text-left hover:bg-zinc-800 rounded-md sm:text-base"
              >
                <div className="flex flex-col justify-center relative min-w-fit">
                  <XMarkIcon className="h-8 text-zinc-300" />
                </div>
                <div className={clsx("flex overflow-hidden flex-col grow")}>
                  <div className="overflow-hidden max-w-full text-ellipsis whitespace-nowrap flex items-center">
                    <div className="grow overflow-hidden max-w-full text-ellipsis whitespace-nowrap ">
                      Disconnect
                    </div>
                  </div>
                  <div className="font-mono text-zinc-500">GN!</div>
                </div>
              </button>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export const AccountButton = () => {
  const { account, isReady } = useWallet();

  if (!isReady) return null;

  return account ? <AccountSwitchButton /> : <ConnectButton />;
};
