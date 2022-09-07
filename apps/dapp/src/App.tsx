import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const Pages = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <WalletProvider>
            <GmTimeProvider>
              <Pages />
            </GmTimeProvider>
          </WalletProvider>
        </ApiProvider>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
