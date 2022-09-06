import { Layout } from "../../components/Layout";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const LeaderboardPage = () => {
  return (
    <Layout title="Leaderboard">
      <div className="container py-2 mx-auto max-w-3xl md:py-4">
        <QueryClientProvider client={queryClient}>
          <LeaderboardHeader />
          <LeaderboardTable />
        </QueryClientProvider>
      </div>
    </Layout>
  );
};
