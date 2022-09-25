import { Layout } from "../../components/Layout";
import { useForceDocumentScroll } from "../../lib/useForceDocumentScroll";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";

export const LeaderboardPage = () => {
  useForceDocumentScroll();

  return (
    <Layout title="Leaderboard" noPadding>
      <div className="container py-4 mx-auto max-w-3xl">
        <LeaderboardHeader />
        <LeaderboardTable />
      </div>
    </Layout>
  );
};
