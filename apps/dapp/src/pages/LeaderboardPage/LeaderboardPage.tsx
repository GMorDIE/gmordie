import { Layout } from "../../components/Layout";
import { LeaderboardTable } from "./LeaderboardTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const LeaderboardPage = () => {
  return (
    <Layout>
      <div className="container py-4 mx-auto max-w-3xl md:py-8">
        <QueryClientProvider client={queryClient}>
          <LeaderboardTable />
        </QueryClientProvider>
      </div>
    </Layout>
  );
};
