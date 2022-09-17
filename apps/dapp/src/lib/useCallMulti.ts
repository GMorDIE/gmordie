// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useApi } from "./ApiContext";
import type { Tracker } from "./useCall";
import { handleError, transformIdentity, unsubscribe } from "./useCall";
import { useIsMountedRef } from "./useIsMountedRef";
import type { ApiPromise } from "@polkadot/api";
import type { QueryableStorageMultiArg } from "@polkadot/api/types";
import { isUndefined, nextTick } from "@polkadot/util";
import {
  Dispatch,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface TrackerRef {
  current: Tracker;
}

interface CallOptions<T> {
  defaultValue?: T;
  transform?: (value: any, api: ApiPromise) => T;
}

// subscribe, trying to play nice with the browser threads
function subscribe<T>(
  api: ApiPromise,
  mountedRef: MutableRefObject<boolean>,
  tracker: TrackerRef,
  calls: QueryableStorageMultiArg<"promise">[],
  setValue: (value: T) => void,
  { transform = transformIdentity }: CallOptions<T> = {}
): void {
  unsubscribe(tracker);

  nextTick((): void => {
    if (mountedRef.current) {
      const included = calls.map((c) => !!c && (!Array.isArray(c) || !!c[0]));
      const filtered = calls.filter((_, index) => included[index]);

      if (filtered.length) {
        // swap to active mode
        tracker.current.isActive = true;
        tracker.current.subscriber = api
          .queryMulti(filtered, (value): void => {
            // we use the isActive flag here since .subscriber may not be set on immediate callback)
            if (mountedRef.current && tracker.current.isActive) {
              let valueIndex = -1;

              try {
                setValue(
                  transform(
                    calls.map((_, index) =>
                      included[index] ? value[++valueIndex] : undefined
                    ),
                    api
                  )
                );
              } catch (error) {
                handleError(error as Error, tracker);
              }
            }
          })
          .catch((error) => handleError(error as Error, tracker));
      } else {
        tracker.current.subscriber = null;
      }
    }
  });
}

// very much copied from useCall
// FIXME This is generic, we cannot really use createNamedHook
export function useCallMulti<T>(
  calls?: QueryableStorageMultiArg<"promise">[] | null | false,
  options?: CallOptions<T>
): {
  data: T | undefined;
  isLoading: boolean;
} {
  const api = useApi();
  const mountedRef = useIsMountedRef();
  const tracker = useRef<Tracker>({
    error: null,
    fn: null,
    isActive: false,
    serialized: null,
    subscriber: null,
    type: "useCallMulti",
  });
  const [isLoading, setIsLoading] = useState(!!calls && !!calls?.length);
  const [value, setValue] = useState<T>(
    () =>
      (isUndefined((options || {}).defaultValue)
        ? []
        : (options || {}).defaultValue) as unknown as T
  );

  const setValueFromSubscription: Dispatch<React.SetStateAction<T>> =
    useCallback((action) => {
      setValue(action);
      setIsLoading(false);
    }, []);

  // initial effect, we need an un-subscription
  useEffect((): (() => void) => {
    return () => unsubscribe(tracker);
  }, []);

  // on changes, re-subscribe
  useEffect((): void => {
    // check if we have a function & that we are mounted
    if (mountedRef.current && calls && api) {
      const serialized = JSON.stringify(calls);

      if (serialized !== tracker.current.serialized) {
        tracker.current.serialized = serialized;

        setIsLoading(!!calls.length);

        //if no call, force clear because subscription won't trigger
        if (calls && !calls.length) setValue([] as T);
        subscribe(
          api,
          mountedRef,
          tracker,
          calls,
          setValueFromSubscription,
          options
        );
      }
    }
  }, [api, calls, options, mountedRef, setValueFromSubscription]);

  // throwOnError(tracker.current);

  return { data: value, isLoading };
}
