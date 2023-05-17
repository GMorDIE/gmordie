import { Button } from "./Button";
import { FC, SVGProps } from "react";

type HeaderButtonProps = {
  text: string;
  icon: FC<Omit<SVGProps<SVGSVGElement>, "ref">>;
  title?: string;
  onClick?: () => void;
};

export const HeaderButton = ({
  text,
  icon: Icon,
  title,
  onClick,
}: HeaderButtonProps) => {
  return (
    <Button
      onClick={onClick}
      title={title}
      className="flex gap-2 text-sm items-center border !py-1"
    >
      <span className="hidden sm:inline">{text}</span>
      {Icon && <Icon className="h-4 w-4" />}
    </Button>
  );
};
