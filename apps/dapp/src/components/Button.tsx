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
}

const getColorClass = (color: string, disabled = false): string => {
  switch (color) {
    case "salmon":
      return clsx("text-white bg-salmon", !disabled && "hover:bg-salmon-400");
    default:
      throw new Error("Unsupported color " + color);
  }
};

export const Button: FC<ButtonProps> = ({
  color = "salmon",
  compact = false,
  className,
  disabled,
  children,
  ...props
}) => {
  const colorClassName = useMemo(
    () => getColorClass(color, disabled),
    [color, disabled]
  );

  return (
    <button
      disabled={disabled}
      className={clsx(
        colorClassName,
        "p-2 font-bold uppercase rounded disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-default focus-visible:outline-zinc-300 focus-visible:outline",
        compact ? "py-1" : "py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
