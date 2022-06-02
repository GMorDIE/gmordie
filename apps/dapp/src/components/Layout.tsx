import { ReactNode } from "react";

import { useGmTime } from "../lib/GmTimeContext";
import { AccountButton } from "./AccountButton";
import { ConnectModal } from "./ConnectModal";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { blockNumber, time } = useGmTime();

  return (
    <div className="flex flex-col pt-12 min-h-screen">
      <header className="flex fixed top-0 left-0 z-10 items-center w-full h-12 text-xl font-extrabold text-white shadow-xl bg-salmon">
        <div className="grow px-4">GM OR DIE</div>
        <AccountButton />
      </header>
      <main className="grow p-4">{children}</main>
      <footer className="flex items-center px-4 h-12 text-white shadow-xl bg-salmon">
        <div className="text-xs">
          <div>Block number : {blockNumber}</div>
          <div>GM Central Time : {time?.toLocaleTimeString()}</div>
        </div>
      </footer>
      <ConnectModal />
    </div>
  );
};
