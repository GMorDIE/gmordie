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
} from "@polkadot/types/interfaces/identity";
import { encodeAddress } from "@polkadot/util-crypto";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const DEFAULT_OPTIONS = {
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};

export const useIdentityVerify = (
  address?: string,
  options = DEFAULT_OPTIONS
) => {
  const { address: currentAddress } = useWallet();
  const { index } = useRegistrar(currentAddress);
  // const { data } = useRegistrars();
  // console.log(data);

  // const { registrar, index }: { registrar?: RegistrarInfo; index: number } =
  //   useMemo(() => {
  //     if (!data) return { index: -1 };
  //     const registrar = data.find(
  //       (r) => r.isSome && r.value.account.toString() === address
  //     );

  //     return {
  //       registrar: registrar?.value,
  //       index: registrar ? data.indexOf(registrar) : -1,
  //     };
  //     //const registrar = Array.from(data?.values.).find
  //   }, [address, data]);

  const api = useApi();
  //const test:IdentityJudgement = ""
  const verify = useCallback(async () => {
    if (!api) throw new Error("Api is not defined");
    if (!currentAddress) throw new Error("currentAddress is not defined");
    if (index === -1) throw new Error("index not found");

    await api.isReady;
    await api.tx.identity
      .provideJudgement(index, address, "KnownGood")
      .signAndSend(
        encodeAddress(currentAddress, SS58_PREFIX),
        getSignAndSendCallback()
      );
  }, [address, api, currentAddress, index]);

  return { canVerify: !!api && index !== -1, verify };
};
