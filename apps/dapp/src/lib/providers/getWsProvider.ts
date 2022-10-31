import { WS_RPC_URLS } from "../settings";
import { WsProvider } from "@polkadot/api";

const TIMEOUT = 10_000;

export const getWsProvider = async () => {
  // use built-in rpc switching
  return new WsProvider(WS_RPC_URLS, TIMEOUT);
};
