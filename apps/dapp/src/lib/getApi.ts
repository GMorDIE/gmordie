import { types } from "@open-web3/orml-type-definitions";
import { ApiPromise, WsProvider } from "@polkadot/api";

import { WS_RPC_URL } from "./settings";

import {
    ScProvider,
    WellKnownChain,
} from "@polkadot/rpc-provider/substrate-connect";
import jsonParachainSpec from '../assets/gm-noleemo.json';

export const getApi = async () => {

  const gmSpec = JSON.stringify(jsonParachainSpec);

  const relayProvider = new ScProvider(WellKnownChain.ksmcc3);
  const lightProvider = new ScProvider(gmSpec, relayProvider);
  await lightProvider.connect();

  const api = await ApiPromise.create({ provider: lightProvider });

  //const wsProvider = new WsProvider(WS_RPC_URL);
  //const api = await ApiPromise.create({ provider: wsProvider });
  // need the OrmlAccountData type
  api.registerTypes(types);
  return api;
};
