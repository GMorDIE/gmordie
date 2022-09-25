import { planckToTokens } from "./planckToTokens";
import { BN } from "@polkadot/util";

export const formatBalance = (planck: BN, decimals: number) => {
  const tokens = planckToTokens(planck, decimals);

  return Intl.NumberFormat("en-US", {
    notation: tokens >= 10000 ? "compact" : "standard",
    maximumSignificantDigits: 4,
  }).format(tokens);
};
