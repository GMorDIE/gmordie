import { useGmTime } from "../lib/GmTimeContext";
import { useIsMounted } from "../lib/useIsMounted";
import { AccountButton } from "./AccountButton";
import { ConnectModal } from "./ConnectModal";
import clsx from "clsx";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTitle } from "react-use";

type LayoutProps = {
  title: string;
  children: ReactNode;
  requiresTime?: boolean;
};

export const Layout = ({ requiresTime, children, title }: LayoutProps) => {
  useTitle(`GM - ${title}`);
  const { blockNumber, time } = useGmTime();
  const isMounted = useIsMounted();

  return (
    <div className="flex flex-col pt-12 min-h-screen">
      <header
        className={clsx(
          "flex fixed top-0 left-0 z-10 items-center w-full h-12 text-xl font-extrabold text-white shadow-xl bg-salmon opacity-0 transition-opacity",
          (!requiresTime || time) && "opacity-100"
        )}
      >
        <div className="grow px-4">
          <Link to="/">GM</Link>
        </div>
        <AccountButton />
      </header>
      <main
        className={clsx(
          "grow p-4 opacity-0 transition-opacity",
          isMounted && "opacity-100"
        )}
      >
        {children}
      </main>
      <footer
        className={clsx(
          "flex items-center px-4 h-12 text-white shadow-xl bg-salmon opacity-0 transition-opacity",
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
