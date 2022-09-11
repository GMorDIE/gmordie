import { AccountIcon } from "../../components/AccountButton";
import { Address } from "../../components/Address";
import { Button } from "../../components/Button";
import { Spinner } from "../../components/Spinner";
import { useApi } from "../../lib/ApiContext";
import { useWallet } from "../../lib/WalletContext";
import { SS58_PREFIX } from "../../lib/constants";
import { getSignAndSendCallback } from "../../lib/getSignAndSendCallback";
import { readRawValue } from "../../lib/readRawValue";
import { useBalance } from "../../lib/useBalance";
import { useIdentityPane } from "./context";
import { useIdentityRegistration } from "./useIdentityRegistration";
import { yupResolver } from "@hookform/resolvers/yup";
import { BN } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type IdentityFormData = {
  display?: string;
  discord?: string;
  twitter?: string;
};

const schema = yup
  .object({
    display: yup.string().trim(),
    discord: yup
      .string()
      .trim()
      // empty or valid discord username
      .matches(/(^$|^.{3,32}#[0-9]{4}$)/gi, "Expected format : username#1234"),
    twitter: yup
      .string()
      .trim()
      // empty or valid twitter username
      .matches(/(^$|^@?(\w){1,15}$)/gi, "Expected format : @username"),
  })
  .test(
    "data",
    "At least one field must be set",
    // at least one field must not be empty
    (val) =>
      !!val.display?.trim() || !!val.discord?.trim() || !!val.twitter?.trim()
  )
  .required();

export const IdentityForm = () => {
  const api = useApi();
  const { close } = useIdentityPane();
  const { account } = useWallet();
  const [error, setError] = useState<string>();
  const { free, locked } = useBalance("FREN", account?.address);
  const { data: registration, isFetched } = useIdentityRegistration(
    account?.address
  );

  const { insufficientBalance, balanceChecked } = useMemo(() => {
    if (locked === undefined || free === undefined)
      return { insufficientBalance: false, balanceChecked: false };
    if (!registration?.isSome)
      return {
        balanceChecked: true,
        insufficientBalance: new BN(free) <= new BN(150_000_000_000_000), //150 FREN
      };
    return { balanceChecked: true, insufficientBalance: false };
  }, [free, locked, registration?.isSome]);

  const defaultValues: IdentityFormData = useMemo(() => {
    const [, discordValue] = registration?.value?.info?.additional?.find(
      ([key]) => readRawValue(key) === "discord"
    ) ?? [undefined, undefined];

    return {
      display: readRawValue(registration?.value?.info?.display),
      discord: readRawValue(discordValue),
      twitter: readRawValue(registration?.value?.info?.twitter),
    };
  }, [registration]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<IdentityFormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues,
  });

  const submit = useCallback(
    async (data: IdentityFormData) => {
      setError(undefined);

      try {
        if (!api) throw new Error("API isn't ready");
        if (!account) throw new Error("Account is not defined");

        await api.tx.identity
          .setIdentity({
            // keep existing values, if any
            ...(registration?.value?.info?.toPrimitive() ?? {}),
            // update our fields
            additional: [[{ raw: "discord" }, { raw: data.discord }]],
            display: { raw: data.display },
            twitter: { raw: data.twitter },
          })
          .signAndSend(
            encodeAddress(account.address, SS58_PREFIX),
            getSignAndSendCallback()
          );

        close();
      } catch (err) {
        console.error(err);
        // using coin as target field removed the need to manually clear errors later on
        setError((err as Error).message);
      }
    },
    [account, api, close, registration]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleClearIdentity = useCallback(async () => {
    setError(undefined);

    try {
      if (!api) throw new Error("API isn't ready");
      if (!account) throw new Error("Account is not defined");

      await api.tx.identity
        .clearIdentity()
        .signAndSend(
          encodeAddress(account.address, SS58_PREFIX),
          getSignAndSendCallback()
        );

      close();
    } catch (err) {
      console.error(err);
      // using coin as target field removed the need to manually clear errors later on
      setError((err as Error).message);
    }
  }, [account, api, close]);

  const errorMessage = useMemo(() => {
    if (balanceChecked && insufficientBalance)
      return "You need 150 FREN to set identity";
    return error;
  }, [balanceChecked, error, insufficientBalance]);

  if (!account || !isFetched)
    return (
      <div className="flex w-full justify-center mt-20">
        <Spinner className="h-12 w-12" />
      </div>
    );

  return (
    <form
      className="h-full max-h-full flex flex-col"
      onSubmit={handleSubmit(submit)}
    >
      <div className="grow p-4 ">
        <div className="flex items-center gap-3 font-bold">
          <AccountIcon account={account} size={48} />
          <div>
            <div>{account.name}</div>
            <div className="opacity-50">
              <Address address={account?.address as string} />
            </div>
          </div>
        </div>

        <div className="py-8 flex flex-col gap-4">
          <p className="text-zinc-400">
            Kindly note that creating your on chain identity requires a deposit
            of 150 FREN, which may be reclaimed when clearing the identity.
          </p>
          <div>
            <div>Name</div>
            <input
              autoComplete="off"
              className={clsx(
                "p-2 w-full outline-none bg-transparent rounded border border-zinc-500 hover:border-zinc-400 focus:border-salmon",
                errors.display && "!border-red-500"
              )}
              {...register("display")}
            />
          </div>
          <div>
            <div>Discord</div>
            <input
              autoComplete="off"
              className={clsx(
                "p-2 w-full outline-none bg-transparent rounded border border-zinc-500 hover:border-zinc-400 focus:border-salmon",
                errors.discord && "!border-red-500"
              )}
              {...register("discord")}
            />
            <div className="text-xs text-zinc-400">
              GMs will be notified on{" "}
              <a
                href="https://discord.gg/ceGUmRhNhw"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-200"
              >
                Discord
              </a>
            </div>
          </div>
          <div>
            <div>Twitter</div>
            <input
              autoComplete="off"
              className={clsx(
                "p-2 w-full outline-none bg-transparent rounded border border-zinc-500 hover:border-zinc-400 focus:border-salmon",
                errors.twitter && "!border-red-500"
              )}
              {...register("twitter")}
            />
            <div className="text-xs text-zinc-400">
              GMs will be notified on Twitter (coming soon)
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="text-red-500">{errorMessage}</div>
        {registration?.isSome && (
          <Button
            type="button"
            className="w-full"
            onClick={handleClearIdentity}
            disabled={!isValid || isSubmitting}
          >
            Clear Identity
          </Button>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={
            !isValid || isSubmitting || !balanceChecked || insufficientBalance
          }
        >
          Set Identity
        </Button>
      </div>
    </form>
  );
};
