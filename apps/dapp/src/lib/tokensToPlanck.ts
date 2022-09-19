import { BN, BN_ZERO } from "@polkadot/util";

type BNish = string | number | BN | Uint8Array | number[] | Buffer;

// decimals are not supported
export const tokensToPlanck = (tokens: BNish, decimals: number) => {
  const tokenAmount = new BN(tokens);
  const tokenDecimals = new BN(decimals);
  const base = BN_ZERO;
  const planck = tokenAmount.mul(base.pow(tokenDecimals));

  return planck;
};
