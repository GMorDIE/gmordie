import { InjectedWindow } from "@polkadot/extension-inject/types";

export const injectedWindow = window as Window & InjectedWindow;
