import { isValidAddress } from "../../lib/isValidAddress";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TransactionsAddressProps = {
  defaultValue?: string;
  onChange?: (address: string) => void;
};

export const TransactionsAddress: FC<TransactionsAddressProps> = ({
  defaultValue,
  onChange,
}) => {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const refInput = useRef<HTMLInputElement>(null);

  const isValid = useMemo(() => !value || isValidAddress(value), [value]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setValue(e.target.value);
    },
    []
  );

  const handleClearClick = useCallback(() => {
    if (!refInput.current) return;
    refInput.current.value = "";
    setValue("");
  }, []);

  useEffect(() => {
    if (isValid) {
      console.log("onChange", value);
      onChange?.(value);
    }
  }, [isValid, onChange, value]);

  console.log(value);

  return (
    <div
      className={clsx(
        "flex w-full border rounded",
        "border-zinc-500 hover:border-zinc-400 focus-within:border-salmon-500 hover:focus-within:border-salmon-500 ",
        value && !isValid && "!border-red-500"
      )}
    >
      <input
        ref={refInput}
        type="text"
        className={clsx(
          "grow my-1 p-1 px-2 rounded bg-transparent text-white font-mono border-none outline-none focus:ring-0 focus:shadow-none focus:outline-none active:outline-none focus:border-none"
        )}
        placeholder="GM address"
        data-lpignore
        spellCheck={false}
        autoComplete="off"
        defaultValue={value}
        onChange={handleChange}
      />
      <button
        type="button"
        className={clsx(
          "hidden px-2 outline-none opacity-80 focus:opacity-100 hover:opacity-100 disabled:opacity-50",
          value && "!block"
        )}
        onClick={handleClearClick}
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
