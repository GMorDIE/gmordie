import { useWallet } from "../lib/WalletContext";
import { formatAddressShort } from "../lib/formatAddressShort";
import { useIsMounted } from "../lib/useIsMounted";
import { Button } from "./Button";
import { Popover, Transition } from "@headlessui/react";
import { LogoutIcon } from "@heroicons/react/solid";
import { InjectedAccount } from "@polkadot/extension-inject/types";
import Identicon from "@polkadot/react-identicon";
import clsx from "clsx";
import { CSSProperties, useMemo } from "react";
import { Fragment } from "react";
import { useCallback } from "react";

const identiconStyle: CSSProperties = { cursor: "inherit" };

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

const AccountIcon = ({ account }: { account: InjectedAccount }) => {
  const acc = account as InjectedAccount & { avatar?: string };
  return acc?.avatar ? (
    <img
      width={32}
      height={32}
      src={acc.avatar}
      alt={acc.name ?? acc.address}
    />
  ) : (
    <Identicon
      value={acc.address}
      size={32}
      theme="polkadot"
      style={identiconStyle}
    />
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

  const handleSelectAccount = useCallback(
    (account: InjectedAccount, closePopover: () => void) => () => {
      select(account);
      closePopover();
    },
    [select]
  );

  const walletAccounts = useMemo(() => {
    if (!connectedAccounts) return [];
    return Object.entries(connectedAccounts)
      .map(([wallet, accounts]) =>
        accounts.map((account) => ({
          key: `${account.name}-${wallet}-${account.address}`,
          wallet,
          account,
        }))
      )
      .flat()
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [connectedAccounts]);

  // this won't happen, this is only for ts
  if (!currentAccount) return null;

  return (
    <Popover className="h-full">
      {({ close }) => (
        <>
          <Popover.Button
            className={clsx(
              "flex items-center p-2 py-0 px-3 h-full outline-none hover:bg-salmon-400 opacity-0 transition-opacity",
              isMounted && "opacity-100"
            )}
          >
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
            <Popover.Panel className="flex fixed top-14 right-1 z-10 flex-col max-w-[250px] bg-zinc-900 rounded-md sm:max-w-[300px]">
              {walletAccounts?.map(({ key, wallet, account }) => (
                <button
                  key={key}
                  className={clsx(
                    "flex overflow-hidden gap-3 items-center p-3 text-sm font-bold  text-left hover:bg-zinc-800 rounded-md sm:text-base",
                    account.address === currentAccount?.address &&
                      wallet === currentAccount.source &&
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
                        {account.name}
                      </div>
                    </div>
                    <div className="font-mono text-zinc-500">
                      {formatAddressShort(account.address, 6)}
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={disconnect}
                className="flex overflow-hidden gap-3 items-center p-3 text-sm font-bold  text-left hover:bg-zinc-800 rounded-md sm:text-base"
              >
                <LogoutIcon className="h-8 text-zinc-300" /> Disconnect
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
