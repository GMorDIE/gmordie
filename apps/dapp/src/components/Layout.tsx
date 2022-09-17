import { SendButton } from "../features/send/SendButton";
import { useGmTime } from "../lib/GmTimeContext";
import { useNavigationMenu } from "../lib/NavigationMenuContext";
import { useIsMounted } from "../lib/useIsMounted";
import { AccountButton } from "./AccountButton";
import { Button } from "./Button";
import { ConnectModal } from "./ConnectModal";
import { CopyAddressButton } from "./CopyAddressButton";
import { Navigation } from "./Navigation";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTitle } from "react-use";

type LayoutProps = {
  title: string;
  children: ReactNode;
  requiresTime?: boolean;
  noPadding?: boolean;
};

export const Layout = ({
  requiresTime,
  children,
  title,
  noPadding,
}: LayoutProps) => {
  useTitle(`GM - ${title}`);
  const { blockNumber, time } = useGmTime();
  const isMounted = useIsMounted();
  const { isOpen, toggle } = useNavigationMenu();

  return (
    <div className="flex flex-col pt-12 min-h-screen">
      <header
        className={clsx(
          "overflow-hidden flex fixed top-0 left-0 z-10 items-center w-full h-12 text-xl font-extrabold text-white shadow-xl bg-salmon opacity-0 transition-opacity",
          (!requiresTime || time) && "opacity-100"
        )}
      >
        <div>
          <Button className="2xl:hidden" onClick={toggle}>
            {isOpen ? <XIcon className="w-8" /> : <MenuIcon className="w-8" />}
          </Button>
        </div>
        <div className="grow px-1 2xl:px-4">
          <Link to="/">GM</Link>
        </div>
        <div className="flex gap-2 items-center">
          <div>
            <CopyAddressButton />
          </div>
          <div>
            <SendButton />
          </div>
          <div>
            <AccountButton />
          </div>
        </div>
      </header>
      <div className="grow flex relative">
        <Navigation
          className={clsx(
            "w-full w-max-full sm:w-72 z-[15] 2xl:z-10 transition-opacity duration-300 2xl:block fixed top-12 bottom-0 left-0 drop-shadow-lg opacity-0",
            (!requiresTime || time) && "2xl:opacity-100",
            isOpen && "opacity-100"
          )}
        />
        <main
          className={clsx(
            "grow opacity-0 transition-opacity overflow-x-auto overflow-y-hidden",
            !noPadding && "px-4",
            isMounted && "opacity-100",

            // margin if navigation is displayed
            (!requiresTime || time) && "2xl:ml-72"
          )}
        >
          {children}
        </main>
      </div>
      <footer
        className={clsx(
          "flex items-center px-4 h-12 text-white shadow-xl bg-salmon opacity-0 transition-opacity z-10",
          (!requiresTime || time) && "opacity-100"
        )}
      >
        <div className="text-xs">
          <div>Block number : {blockNumber}</div>
          <div>GM Time : {time?.toLocaleTimeString()}</div>
        </div>
      </footer>
      <ConnectModal />
    </div>
  );
};
