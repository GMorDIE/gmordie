import { useIdentityRegistration } from "../../features/identity/useIdentityRegistration";
import { isValidAddress } from "../../lib/isValidAddress";
import { IdentityDisplay } from "./IdentityDisplay";
import { XIcon } from "@heroicons/react/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = {
  address: string;
};

const schema = yup.object({
  address: yup
    .string()
    .required("")
    .test(
      "address",
      "invalid address",
      (address) => address === "" || isValidAddress(address)
    ),
});

export const IdentityVerificationForm = () => {
  const {
    register,
    setFocus,
    setValue,
    formState: { isValid, errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleClearClick = useCallback(() => {
    setValue("address", "");
    setFocus("address");
  }, [setFocus, setValue]);

  useEffect(() => {
    if (isValid) console.log("Valid form");
  }, [isValid]);

  const submit = useCallback(() => {
    // nothing, we use the form only for validation
  }, []);

  const address = watch("address");

  return (
    <div className=" flex flex-col gap-4">
      <form onSubmit={handleSubmit(submit)}>
        <div
          className={clsx(
            "flex w-full border rounded",
            "border-zinc-500 hover:border-zinc-400 focus-within:border-salmon-500 hover:focus-within:border-salmon-500 ",
            errors.address &&
              errors.address?.type !== "required" &&
              "!border-red-500"
          )}
        >
          <input
            {...register("address")}
            type="text"
            className={clsx(
              "grow my-1 p-1 px-2 rounded bg-transparent text-white font-mono border-none outline-none focus:ring-0 focus:shadow-none focus:outline-none active:outline-none focus:border-none"
            )}
            placeholder="GM address"
            data-lpignore
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            className="px-2 outline-none opacity-80 focus:opacity-100 hover:opacity-100 disabled:opacity-50"
            onClick={handleClearClick}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      <IdentityDisplay address={isValid ? address : ""} />
    </div>
  );
};
