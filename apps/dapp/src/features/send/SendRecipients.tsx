import { Button } from "../../components/Button";
import { SendFormData } from "./shared";
import { PlusIcon, TrashIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { useCallback } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const SendRecipients = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray<SendFormData>({
    name: "recipients",
  });

  const handleAddRecipient = useCallback(() => {
    append({ address: "", name: "" }, { shouldFocus: true });
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => () => {
      remove(index);
    },
    [remove]
  );

  console.log({ errors });

  console.log("field 0", (errors.recipients as any)?.[0]);
  console.log("field 1", (errors.recipients as any)?.[1]);

  return (
    <div className="flex flex-col w-full gap-2 mb-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={clsx(
            "flex w-full border focus-within:border-zinc-100 rounded",
            (errors.recipients as any)?.[index] && "!border-red-500"
          )}
        >
          <input
            type="text"
            className={clsx(
              "grow my-1 p-1 px-2 rounded bg-transparent text-white outline-none"
            )}
            placeholder="GM address"
            data-lpignore
            spellCheck={false}
            autoComplete="off"
            {...register(`recipients[${index}].address`)}
          />
          <button
            className="px-2 outline-none opacity-80 focus:opacity-100"
            onClick={handleRemove(index)}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
      <button className="flex items-center gap-1" onClick={handleAddRecipient}>
        <PlusIcon className="w-5 h-5" />
        <span>Add fren</span>
      </button>
    </div>
  );
};
