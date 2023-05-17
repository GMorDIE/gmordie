import { useApi } from "./ApiContext";
import { SS58_PREFIX } from "./constants";
import { provideContext } from "./provideContext";
import { APP_NAME } from "./settings";
import { useOpenClose } from "./useOpenClose";
import { web3Enable, web3AccountsSubscribe } from "@polkadot/extension-dapp";
import {
  InjectedExtension,
  InjectedAccountWithMeta, //Injected, InjectedAccount
} from "@polkadot/extension-inject/types";
import { encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";

type SignerAccount = {
  source: string;
  address: string;
};

const useWalletProvider = () => {
  // main account used to sign transactions
  const [signerAccount, setSignerAccount, clearSignerAccount] =
    useLocalStorage<SignerAccount | null>("gmordie.account");

  const {
    isOpen: isConnectModalOpen,
    open: openConnectModal,
    close: closeConnectModal,
  } = useOpenClose();

  const [enabledExtensions, setEnabledExtensions] =
    useState<InjectedExtension[]>();

  const [connectedAccounts, setConnectedAccounts] =
    useState<InjectedAccountWithMeta[]>();

  // assign signer account to api
  const api = useApi();

  const select = useCallback(
    (account: InjectedAccountWithMeta) => {
      if (!account) clearSignerAccount();
      else {
        const { address, meta } = account;
        if (meta.source) {
          setSignerAccount({ address, source: meta.source });
        } else clearSignerAccount();
      }
    },
    [clearSignerAccount, setSignerAccount]
  );

  const connect = useCallback(async () => {
    const extensions = await web3Enable(APP_NAME);
    setEnabledExtensions(extensions);
    closeConnectModal();
  }, [closeConnectModal]);

  // auto connect (only once)
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (isReady || !api) return;
    if (signerAccount) connect().then(() => setIsReady(true));
    setIsReady(true);
  }, [isReady, api, connect, signerAccount]);

  // maintain connected accounts object
  useEffect(() => {
    // web3Enable(originName) needs to be called before web3AccountsSubscribe
    if (!enabledExtensions?.length)
      return () => {
        // user didn't enable any extension
      };

    const promUnsubscribe = web3AccountsSubscribe(
      (accounts) => {
        setConnectedAccounts(accounts);
      },
      {
        accountType: ["sr25519"],
        genesisHash: api?.genesisHash.toHex(),
      }
    );

    // clear subscriptions
    return () => {
      promUnsubscribe.then((unsub) => unsub());
    };
  }, [api?.genesisHash, enabledExtensions?.length]);

  // currently selected account
  const account = useMemo(() => {
    if (!signerAccount || !connectedAccounts) return null;
    const acc = connectedAccounts?.find(
      (acc) =>
        acc.address === signerAccount.address &&
        acc.meta.source === signerAccount.source
    );
    return acc ?? null;
  }, [connectedAccounts, signerAccount]);

  const disconnect = useCallback(() => {
    setSignerAccount(null);
    setEnabledExtensions([]);
  }, [setSignerAccount]);

  useEffect(() => {
    if (!enabledExtensions || !signerAccount || !api) return;
    const injectedWallet = enabledExtensions.find(
      (ext) => ext.name === signerAccount.source
    );
    if (!injectedWallet) clearSignerAccount();
    else api.setSigner(injectedWallet.signer);
  }, [api, clearSignerAccount, enabledExtensions, signerAccount]);

  // auto connect first account
  useEffect(() => {
    if (
      !signerAccount &&
      enabledExtensions?.length &&
      connectedAccounts?.length
    ) {
      setSignerAccount({
        address: connectedAccounts[0].address,
        source: connectedAccounts[0].meta.source,
      });
    }
  });

  // accounts obtained with web3AccountsSubscribe don't have avatar :(
  const avatar = useMemo(
    () => (account ? (account as { avatar?: string })?.avatar : undefined),
    [account]
  );

  const address = useMemo(
    () => (account ? encodeAddress(account.address, SS58_PREFIX) : undefined),
    [account]
  );

  return {
    connect,
    disconnect,
    account,
    address,
    avatar,
    connectedAccounts,
    select,
    isConnectModalOpen,
    closeConnectModal,
    openConnectModal,
    isReady: true,
  };
};

export const [WalletProvider, useWallet] = provideContext(useWalletProvider);
