import { IconTokenFren, IconTokenGM, IconTokenGN } from "../assets/tokens";

type TokenIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string;
  symbol: "FREN" | "GM" | "GN";
};

export const TokenIcon = ({ symbol, ...props }: TokenIconProps) => {
  switch (symbol) {
    case "FREN":
      return <IconTokenFren {...props} />;
    case "GM":
      return <IconTokenGM {...props} />;
    case "GN":
      return <IconTokenGN {...props} />;
  }
  return null;
};
