import { Layout } from "../../components/Layout";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";
import { useEffect } from "react";

export const LeaderboardPage = () => {
  useEffect(() => {
    //force vertical scrollbar
    document.documentElement.classList.add("overflow-y-scroll");

    return () => {
      document.documentElement.classList.remove("overflow-y-scroll");
    };
  }, []);

  return (
    <Layout title="Leaderboard">
      <div className="container py-2 mx-auto max-w-3xl md:py-4">
        <LeaderboardHeader />
        <LeaderboardTable />
      </div>
    </Layout>
  );
};
