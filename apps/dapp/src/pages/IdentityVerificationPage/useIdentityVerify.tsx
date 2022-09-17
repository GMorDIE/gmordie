import { useApi } from "../../lib/ApiContext";
import { useWallet } from "../../lib/WalletContext";
import { SS58_PREFIX } from "../../lib/constants";
import { getSignAndSendCallback } from "../../lib/getSignAndSendCallback";
import { useRegistrar } from "./useRegistrar";
import { ApiBase } from "@polkadot/api/base";
import { Option } from "@polkadot/types-codec";
import { Vec } from "@polkadot/types/codec";
import {
  RegistrarInfo,
  IdentityJudgement,
  Registration,
} from "@polkadot/types/interfaces/identity";
import { encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useMemo } from "react";

export type JudgementType = "Unknown" | "Reasonable" | "KnownGood";

export const useIdentityVerify = (
  registration: Registration,
  address?: string
) => {
  const api = useApi();
  const { address: currentAddress } = useWallet();
  const { index } = useRegistrar(currentAddress);

  const judgement: JudgementType = useMemo(() => {
    if (index === -1) return "Unknown";
    const j = registration?.judgements?.find(
      ([i]) => i.toNumber() === index
    )?.[1];
    if (j?.isKnownGood) return "KnownGood";
    if (j?.isReasonable) return "Reasonable";
    return "Unknown";
  }, [registration, index]);

  const verify = useCallback(
    async (type: JudgementType) => {
      if (!api) throw new Error("Api is not defined");
      if (!currentAddress) throw new Error("currentAddress is not defined");
      if (index === -1) throw new Error("index not found");

      await api.isReady;
      await api.tx.identity
        .provideJudgement(index, address, type)
        .signAndSend(
          encodeAddress(currentAddress, SS58_PREFIX),
          getSignAndSendCallback()
        );
    },
    [address, api, currentAddress, index]
  );

  return { canVerify: !!api && index !== -1, verify, judgement };
};
