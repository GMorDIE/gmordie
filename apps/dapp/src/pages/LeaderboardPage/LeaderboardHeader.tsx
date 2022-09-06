import { useHolders } from "./useHolders";
import clsx from "clsx";
import { useEffect } from "react";

export const LeaderboardHeader = () => {
  const { data, error } = useHolders();

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  return (
    <div className="text-center mb-4 text-white">
      <h1 className="text-3xl font-medium uppercase">Leaderboard</h1>
      <p
        className={clsx(
          "text-lg opacity-0 transition-opacity text-zinc-300",
          data && "opacity-100"
        )}
      >
        {data?.accountsConnection.totalCount} frens GMing hard!
      </p>
    </div>
  );
};
