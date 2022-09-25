import { SS58_PREFIX } from "./constants";
import { isAddress } from "@polkadot/util-crypto";

export const isValidAddress = (address?: string) =>
  isAddress(address, false, SS58_PREFIX);
