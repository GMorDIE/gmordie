import { BN, BN_TEN } from "@polkadot/util";

type BNish = string | number | BN | Uint8Array | number[] | Buffer;

// decimals are not supported
export const tokensToPlanck = (tokens: BNish, decimals: number) => {
  const tokenAmount = new BN(tokens);
  const tokenDecimals = new BN(decimals);
  const base = BN_TEN;
  const planck = tokenAmount.mul(base.pow(tokenDecimals));
  return planck;
};
