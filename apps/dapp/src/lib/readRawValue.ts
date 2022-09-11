import { Data } from "@polkadot/types";

export const readRawValue = (data?: Data) => {
  const { raw } = (data?.toPrimitive() as {
    raw: string;
  }) ?? { raw: "" };
  return raw || undefined;
};
