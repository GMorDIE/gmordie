import { IconTransfers, IconTrophy } from "../assets/icons";
import { useNavigationMenu } from "../lib/NavigationMenuContext";
import { HomeIcon, ShieldCheckIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { FC, SVGProps, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

type NavigationItemProps = {
  to: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
};

const getNavigationItemClassName = ({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) => {
  return clsx(
    "flex items-center p-2 gap-3 rounded hover:bg-zinc-600 hover:text-zinc-100",
    (isActive || isPending) &&
      "text-zinc-100 !bg-zinc-700 font-bold cursor-default"
  );
};

const NavigationItem = ({ to, label, icon: Icon }: NavigationItemProps) => {
  return (
    <li className="font-medium">
      <NavLink to={to} end className={getNavigationItemClassName}>
        <Icon className="w-6 h-6" />
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

type NavigationProps = {
  className?: string;
};

export const Navigation = ({ className }: NavigationProps) => {
  const { close } = useNavigationMenu();
  const location = useLocation();

  useEffect(close, [close, location]);

  return (
    <div className={clsx("bg-zinc-800 p-2 py-4", className)}>
      <ul className="space-y-2">
        <NavigationItem to="/" label="Home" icon={HomeIcon} />
        <NavigationItem
          to="/leaderboard"
          label="Leaderboard"
          icon={IconTrophy}
        />
        <NavigationItem
          to="/transactions"
          label="Transaction History"
          icon={IconTransfers}
        />
        <NavigationItem
          to="/id-verification"
          label="ID Verification"
          icon={ShieldCheckIcon}
        />
      </ul>
    </div>
  );
};
