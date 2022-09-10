import { formatBalance as formatBalancePjs } from "@polkadot/util";

export const formatBalance = (planck: string, decimals: number) => {
  const formatted = formatBalancePjs(planck, {
    decimals,
    withSi: false,
    withUnit: false,
    forceUnit: "unit",
  });
  return formatted.replace(/(\.|,)0+$/, "");
};
