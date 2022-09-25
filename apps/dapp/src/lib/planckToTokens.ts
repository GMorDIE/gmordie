import { BN } from "@polkadot/util";

export const planckToTokens = (planck: BN, decimals: number) => {
  // ensure there are more digits than decimals
  const strPlanck = planck.toString().padStart(128, "0");

  const strDecimals = strPlanck.substring(strPlanck.length - decimals);
  const strInteger =
    strPlanck
      .substring(0, strPlanck.length - decimals) // remove decimals
      .replace(/^0+/, "") || "0"; // remove leading 0s

  return Number(`${strInteger}.${strDecimals}`);
};
