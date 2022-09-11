import { useApi } from "../../lib/ApiContext";
import { readRawValue } from "../../lib/readRawValue";
import { Option } from "@polkadot/types-codec";
import { Registration } from "@polkadot/types/interfaces/identity";
import { useQuery } from "@tanstack/react-query";

type Identity = {
  display: string;
  verified: true;
};

const cache = new Map<string, Identity | null>();

export const useIdentityDisplayName = (address?: string) => {
  const api = useApi();

  return useQuery(["identity", address, Boolean(api)], async () => {
    if (!address) return null;
    if (!api) return null;

    if (cache.has(address)) return cache.get(address);

    await api.isReady;
    const registration = await api.query.identity.identityOf<
      Option<Registration>
    >(address);

    const display = readRawValue(registration?.value?.info?.display) ?? null;
    const verified = (
      registration?.value?.judgements?.toPrimitive?.() as [
        number,
        { knownGood?: null | boolean }
      ][]
    )?.some(([, judgement]) => judgement?.knownGood === null);

    cache.set(address, display ? ({ display, verified } as Identity) : null);

    return cache.get(address);
  });
};
