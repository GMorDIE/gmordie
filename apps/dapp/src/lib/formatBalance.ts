import { BN } from "@polkadot/util";

export const formatBalance = (planck: string, decimals: number) => {
  return new BN(planck).div(new BN(10).pow(new BN(decimals))).toString();
};
