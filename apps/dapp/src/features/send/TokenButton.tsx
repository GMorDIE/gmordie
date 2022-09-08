// export interface ButtonProps
//   extends Omit<
//     React.DetailedHTMLProps<
//       React.ButtonHTMLAttributes<HTMLButtonElement>,
//       HTMLButtonElement
//     >,
//     "color"
//   > {
//   color?: "salmon";
//   compact?: boolean;
// }
import { TokenIcon } from "../../components/TokenIcon";
import { useWallet } from "../../lib/WalletContext";
import { useBalance } from "../../lib/useBalance";
import clsx from "clsx";

type TokenButtonProps = {
  symbol: "GM" | "GN";
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export const TokenButton = ({
  symbol,
  disabled,
  selected,
  onClick,
}: TokenButtonProps) => {
  const { address } = useWallet();
  const { free, locked } = useBalance(symbol, address);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "text-zinc-200 flex items-center p-2 px-3 border border-zinc-600 rounded gap-2 text-base outline-salmon/50  disabled:opacity-50",
        !selected && "hover:text-white hover:border-zinc-500",
        selected && "text-white  border-salmon outline-salmon"
      )}
    >
      <div>
        <TokenIcon symbol={symbol} className="w-10 h-10" />
      </div>
      <div className="flex flex-col justify-center text-left">
        <div>
          <span className="font-bold">{free}</span> Available
        </div>
        <div>
          <span className="font-bold">{locked}</span> Locked
        </div>
      </div>
    </button>
  );
};
