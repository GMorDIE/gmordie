import { Layout } from "../../components/Layout";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";

export const LeaderboardPage = () => {
  return (
    <Layout title="Leaderboard">
      <div className="container py-2 mx-auto max-w-3xl md:py-4">
        <LeaderboardHeader />
        <LeaderboardTable />
      </div>
    </Layout>
  );
};
