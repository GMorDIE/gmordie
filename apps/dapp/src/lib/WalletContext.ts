import { isWeb3Injected } from "@polkadot/extension-dapp";
import {
  Injected,
  InjectedAccount,
  InjectedWindow,
} from "@polkadot/extension-inject/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "react-use";

import { useApi } from "./ApiContext";
import { provideContext } from "./provideContext";
import { APP_NAME } from "./settings";
import { useOpenClose } from "./useOpenClose";

const downloadTalisman = () => {
  let store =
    "https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld";

  if (navigator.userAgent.indexOf("Firefox") != -1) {
    store =
      "https://addons.mozilla.org/en-GB/firefox/addon/talisman-wallet-extension/";
  }

  window.open(store, "_blank", "noopener,noreferrer");
};

const injectedWindow = window as Window & InjectedWindow;

type SignerAccount = {
  walletKey: string;
  address: string;
};

const useWalletProvider = () => {
  // keys of wallets to enable
  const [connectedWallets = [], setConnectedWallets, clearConnectedWallets] =
    useLocalStorage<string[]>("gmordie.wallets", []);

  // main account used to sign transactions
  const [signerAccount, setSignerAccount, clearSignerAccount] =
    useLocalStorage<SignerAccount | null>("gmordie.account");

  const {
    isOpen: isConnectModalOpen,
    open: openConnectModal,
    close: closeConnectModal,
  } = useOpenClose();

  const [enabledWallets, setEnabledWallets] =
    useState<Record<string, Injected>>();

  const [connectedAccounts = {}, setConnectedAccounts] =
    useState<Record<string, InjectedAccount[]>>();

  // assign signer account to api
  const api = useApi();
  useEffect(() => {
    if (!enabledWallets || !signerAccount) return;
    const injectedWallet = enabledWallets[signerAccount.walletKey];
    if (!injectedWallet) clearSignerAccount();
    else api.setSigner(injectedWallet.signer);
  }, [api, clearSignerAccount, enabledWallets, signerAccount]);

  const select = useCallback(
    (account: InjectedAccount) => {
      if (!account) clearSignerAccount();
      else {
        const { address } = account;
        const [walletKey] =
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          Object.entries(connectedAccounts ?? {}).find(([_, accounts]) =>
            accounts.includes(account)
          ) ?? [];
        if (!walletKey) clearSignerAccount();
        else setSignerAccount({ walletKey, address });
      }
    },
    [clearSignerAccount, connectedAccounts, setSignerAccount]
  );

  const connect = useCallback(
    async (key: string) => {
      if (!isWeb3Injected) downloadTalisman();
      else {
        const wallet = injectedWindow.injectedWeb3[key];
        if (!wallet && key === "talisman") downloadTalisman();
        else {
          const enabledWallet = await wallet.enable(APP_NAME);
          setConnectedWallets((prev = []) => [
            ...prev.filter((k) => k !== key),
            key,
          ]);
          setEnabledWallets((prev = {}) => ({ ...prev, [key]: enabledWallet }));
          const accounts = await enabledWallet.accounts.get();
          const validAccounts = accounts.filter(
            ({ type }) => type !== "ethereum"
          );
          if (validAccounts.length)
            setSignerAccount({
              walletKey: key,
              address: validAccounts[0].address,
            });
          closeConnectModal();
        }
      }
    },
    [closeConnectModal, setConnectedWallets, setSignerAccount]
  );

  const [isReady, setIsReady] = useState(false);
  const initialize = useCallback(async () => {
    if (isReady) return;
    if (connectedWallets.length)
      await Promise.all(connectedWallets.map(connect));
    setIsReady(true);
  }, [connect, connectedWallets, isReady]);

  // auto connect (only once)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // maintain connected accounts object
  useEffect(() => {
    if (!enabledWallets) return;

    // remove accounts from wallets that are not enbaled
    const validKeys = Object.keys(enabledWallets);
    setConnectedAccounts((prev = {}) => {
      for (const key of Object.keys(prev))
        if (!validKeys.includes(key)) delete prev[key];
      return prev;
    });

    // subscribe to accounts of each connected wallet
    const unsubscribes = Object.entries(enabledWallets).map(([key, wallet]) =>
      wallet.accounts.subscribe((accounts) => {
        setConnectedAccounts((prev = {}) => ({
          ...prev,
          [key]: accounts.filter(({ type }) => type !== "ethereum"),
        }));
      })
    );

    // clear subscriptions
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [enabledWallets]);

  // currently selected account
  const account = useMemo(() => {
    if (!signerAccount || !connectedAccounts) return null;
    const acc = connectedAccounts?.[signerAccount.walletKey]?.find(
      (acc) => acc.address === signerAccount.address
    );
    return acc ? { ...acc, source: signerAccount.walletKey } : null;
  }, [connectedAccounts, signerAccount]);

  const disconnect = useCallback(() => {
    setSignerAccount(null);
    clearConnectedWallets();
  }, [clearConnectedWallets, setSignerAccount]);

  return {
    connect,
    disconnect,
    account,
    connectedAccounts,
    select,
    isConnectModalOpen,
    closeConnectModal,
    openConnectModal,
    isReady,
  };
};

export const [WalletProvider, useWallet] = provideContext(useWalletProvider);
