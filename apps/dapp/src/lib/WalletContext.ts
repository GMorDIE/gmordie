import { useApi } from "./ApiContext";
import { injectedWindow } from "./injectedWindow";
import { provideContext } from "./provideContext";
import { APP_NAME } from "./settings";
import { useOpenClose } from "./useOpenClose";
import { Injected, InjectedAccount } from "@polkadot/extension-inject/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";

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
    if (!enabledWallets || !signerAccount || !api) return;
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
          Object.entries(connectedAccounts ?? {}).find(([, accounts]) =>
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
      const injectedWallet = injectedWindow.injectedWeb3[key];
      if (!injectedWallet) {
        console.error("Wallet not found", key);
      } else {
        const enabledWallet = await injectedWallet.enable(APP_NAME);
        setConnectedWallets((prev = []) => [
          ...prev.filter((k) => k !== key),
          key,
        ]);
        setEnabledWallets((prev = {}) => ({ ...prev, [key]: enabledWallet }));
        const accounts = await enabledWallet.accounts.get();
        const validAccounts = accounts.filter(
          ({ type }) => type !== "ethereum"
        );
        // select first account if none is selected
        if (
          validAccounts.length &&
          !validAccounts.some((va) => va.address === signerAccount?.address)
        )
          setSignerAccount({
            walletKey: key,
            address: validAccounts[0].address,
          });
        closeConnectModal();
      }
    },
    [
      closeConnectModal,
      setConnectedWallets,
      setSignerAccount,
      signerAccount?.address,
    ]
  );

  const [isReady, setIsReady] = useState(false);
  const initialize = useCallback(async () => {
    if (isReady || !api) return;
    if (connectedWallets.length)
      await Promise.all(connectedWallets.map(connect));
    setIsReady(true);
  }, [api, connect, connectedWallets, isReady]);

  // auto connect (only once)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // maintain connected accounts object
  useEffect(() => {
    if (!enabledWallets) return;

    // remove accounts from wallets that are not enabled
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
    setEnabledWallets({});
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
