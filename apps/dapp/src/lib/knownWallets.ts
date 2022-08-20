import {
  TalismanWhiteLogo,
  PolkadotJsLogo,
  NovaColorLogo,
  SubWalletLogo,
} from "../assets/wallets";
import { FunctionComponent } from "react";

const isNovaInjected = !!window.walletExtension?.isNovaWallet;

export type KnownWallet = {
  id: string;
  injectedKey: string;
  name: string;
  logo?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  downloadUrl?: string;
  condition?: boolean;
};

export const knownWallets: KnownWallet[] = [
  {
    id: "talisman",
    injectedKey: "talisman",
    name: "Talisman",
    logo: TalismanWhiteLogo,
    downloadUrl: "https://talisman.xyz/download",
  },
  {
    id: "nova",
    injectedKey: "polkadot-js",
    name: "Nova",
    logo: NovaColorLogo,
    downloadUrl: "https://novawallet.io/",
    condition: isNovaInjected,
  },
  {
    id: "subwallet",
    injectedKey: "subwallet-js",
    name: "SubWallet",
    logo: SubWalletLogo,
    downloadUrl: "https://subwallet.app/download.html",
  },
  {
    id: "polkadot.js",
    injectedKey: "polkadot-js",
    name: "Polkadot.js",
    logo: PolkadotJsLogo,
    downloadUrl: "https://polkadot.js.org/extension/",
    condition: !isNovaInjected,
  },
  {
    id: "elon-musk-wallet",
    injectedKey: "elon-musk-wallet",
    name: "✨ Elon Musk Wallet",
    downloadUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];
