import { Button } from "../../components/Button";
import { ToastContent } from "../../components/ToastContent";
import { useApi } from "../../lib/ApiContext";
import { useWallet } from "../../lib/WalletContext";
import { tokensToPlanck } from "../../lib/tokensToPlanck";
import { SendRecipients } from "./SendRecipients";
import { TokenButton } from "./TokenButton";
import { useSendModal } from "./context";
import { DEFAULT_FORM_DATA, SendFormData, SendSymbol } from "./shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAddress, encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup
  .object({
    coin: yup.string().required("").oneOf(["GM", "GN"], ""),
    recipients: yup.array().of(
      yup.object({
        address: yup
          .string()
          .required("address is required")
          .test("address", "invalid address", (address) => isAddress(address)),
        name: yup.string(),
      })
    ),
  })
  .required();

export const SendForm = () => {
  const { close } = useSendModal();
  const [error, setError] = useState<string>();
  const methods = useForm<SendFormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_FORM_DATA,
  });

  const { address } = useWallet();
  const api = useApi();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, isSubmitting },
  } = methods;

  const handleSelectCoin = useCallback(
    (symbol: SendSymbol) => () => {
      setValue("coin", symbol, { shouldValidate: true });
    },
    [setValue]
  );

  const submit = useCallback(
    async ({ coin, recipients }: SendFormData) => {
      try {
        if (!api) throw new Error("API isn't ready");
        if (!address) throw new Error("From account is not defined");
        if (!coin || !recipients?.length) throw new Error("Invalid form data");

        // if more than 1 address, batch calls
        const tx =
          recipients.length === 1
            ? api.tx.currencies.transfer(
                recipients[0].address,
                coin,
                tokensToPlanck("1", 0).toString()
              )
            : api.tx.utility.batch(
                recipients.map(({ address }) =>
                  api.tx.currencies.transfer(
                    address,
                    coin,
                    tokensToPlanck("1", 0).toString()
                  )
                )
              );

        const unsubscribe = await tx.signAndSend(
          encodeAddress(address, 7013),
          (result) => {
            const fail = result.findRecord("system", "ExtrinsicFailed");
            if (fail || result.dispatchError || result.isError) {
              toast.custom((t) => (
                <ToastContent
                  t={t}
                  title="Doh !"
                  description="Transaction failed 😭"
                  type="error"
                />
              ));
              unsubscribe();
              return;
            }

            if (result.status.isInBlock) {
              toast.custom((t) => (
                <ToastContent
                  t={t}
                  title="Success"
                  description="Nailed it! 🤘"
                  type="success"
                />
              ));
              unsubscribe();
            }
          }
        );
        close();
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    },
    [address, api, close]
  );

  const coin = watch("coin");

  return (
    <form onSubmit={handleSubmit(submit)}>
      <FormProvider {...methods}>
        <div className="py-4 text-lg flex w-full justify-between">
          <TokenButton
            symbol="GM"
            selected={coin === "GM"}
            onClick={handleSelectCoin("GM")}
          />
          <TokenButton
            symbol="GN"
            selected={coin === "GN"}
            onClick={handleSelectCoin("GN")}
          />
        </div>
        <div>Target fren(s)</div>
        <SendRecipients />
        <div className="text-red-500 my-2 py-2">{error}</div>
        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          Spread love
        </Button>
      </FormProvider>
    </form>
  );
};
