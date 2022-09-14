import { Button } from "../../components/Button";
import { useApi } from "../../lib/ApiContext";
import { useWallet } from "../../lib/WalletContext";
import { SS58_PREFIX } from "../../lib/constants";
import { getSignAndSendCallback } from "../../lib/getSignAndSendCallback";
import { getTokenBalance } from "../../lib/getTokenBalance";
import { tokensToPlanck } from "../../lib/tokensToPlanck";
import { SendRecipients } from "./SendRecipients";
import { TokenButton } from "./TokenButton";
import { useSendModal } from "./context";
import { DEFAULT_FORM_DATA, SendFormData, SendSymbol } from "./shared";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAddress, encodeAddress } from "@polkadot/util-crypto";
import { useCallback, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const isValidAddress = (address?: string) =>
  isAddress(address, false, SS58_PREFIX);

const schema = yup
  .object({
    coin: yup.string().required("").oneOf(["GM", "GN"], ""),
    recipients: yup.array().of(
      yup.object({
        address: yup
          .string()
          .test(
            "address",
            "invalid address",
            (address) => address === "" || isValidAddress(address)
          ),
        name: yup.string(),
      })
    ),
  })
  .test(
    "min 1 address",
    "Requires 1 valid address minimum",
    ({ recipients }) =>
      !!recipients?.filter(({ address }) => isValidAddress(address)).length
  )
  .required();

export const SendForm = () => {
  const { close } = useSendModal();
  const methods = useForm<SendFormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: DEFAULT_FORM_DATA,
  });

  const { address } = useWallet();
  const api = useApi();

  const {
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = methods;

  const handleSelectCoin = useCallback(
    (symbol: SendSymbol) => () => {
      setValue("coin", symbol, { shouldValidate: true });
    },
    [setValue]
  );

  const submit = useCallback(
    async (data: SendFormData) => {
      try {
        const recipients = data.recipients.filter(({ address }) =>
          isValidAddress(address)
        );
        if (!api) throw new Error("API isn't ready");
        if (!address) throw new Error("From account is not defined");
        if (!data.coin || !recipients?.length)
          throw new Error("Invalid form data");

        const { free } = await getTokenBalance(api, data.coin, address);
        if (free.toNumber() < recipients.length)
          throw new Error(`Insufficient ${data.coin} balance`);

        // if more than 1 address, batch calls
        const tx =
          recipients.length === 1
            ? api.tx.currencies.transfer(
                recipients[0].address,
                data.coin,
                tokensToPlanck("1", 0).toString()
              )
            : api.tx.utility.batch(
                recipients.map(({ address }) =>
                  api.tx.currencies.transfer(
                    address,
                    data.coin,
                    tokensToPlanck("1", 0).toString()
                  )
                )
              );

        await tx.signAndSend(
          encodeAddress(address, SS58_PREFIX),
          getSignAndSendCallback()
        );

        close();
      } catch (err) {
        console.error(err);
        // using coin as target field removed the need to manually clear errors later on
        setError("coin", { message: (err as Error).message });
      }
    },
    [address, api, close, setError]
  );

  const [coin, recipients] = watch(["coin", "recipients"]);
  const btnSendSuffix = useMemo(() => {
    const count = recipients.filter(({ address }) =>
      isValidAddress(address)
    ).length;
    return count ? ` (${count})` : null;
  }, [recipients]);

  return (
    <form className="flex flex-col h-full" onSubmit={handleSubmit(submit)}>
      <FormProvider {...methods}>
        <div className="p-4 ">
          <div>Coin to send :</div>
          <div className="mt-2 flex w-full justify-between flex-col sm:flex-row gap-2 text-lg">
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
        </div>
        <div className="grow p-4 overflow-y-auto">
          <SendRecipients />
        </div>
        <div className="p-4">
          <div className="text-red-500 my-2">{errors.coin?.message}</div>
          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            Spread love{btnSendSuffix}
          </Button>
        </div>
      </FormProvider>
    </form>
  );
};
