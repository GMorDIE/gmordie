import { BN } from "@polkadot/util";

type BNish = string | number | BN | Uint8Array | number[] | Buffer;

export const tokensToPlanck = (tokens: BNish, decimals: BNish) => {
  const tokenAmount = new BN(tokens);
  const tokenDecimals = new BN(decimals);
  const base = new BN("10");
  const planck = tokenAmount.mul(base.pow(tokenDecimals));

  return planck;
};
