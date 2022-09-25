import clsx from "clsx";
import React, { FC, useMemo } from "react";

export interface ButtonProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "color"
  > {
  color?: "salmon";
  compact?: boolean;
  checked?: boolean;
}

const getColorClass = (
  color: string,
  disabled = false,
  checked = false
): string => {
  switch (color) {
    case "salmon":
      return clsx(
        "text-white border-salmon",
        !checked && !disabled && "hover:border-white/70",
        checked && "!border-salmon-400 !cursor-default"
      );
    default:
      throw new Error("Unsupported color " + color);
  }
};

export const IconButton: FC<ButtonProps> = ({
  color = "salmon",
  compact = false,
  className,
  disabled,
  checked,
  children,
  ...props
}) => {
  const colorClassName = useMemo(
    () => getColorClass(color, disabled, checked),
    [checked, color, disabled]
  );

  return (
    <button
      disabled={disabled}
      className={clsx(
        colorClassName,
        "p-2 border border-white/50 rounded disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-default focus-visible:outline-zinc-300 focus-visible:outline",
        compact ? "py-1" : "py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
