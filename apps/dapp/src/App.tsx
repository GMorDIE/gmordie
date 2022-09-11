import { ErrorBoundary } from "./components/ErrorBoundary";
import { IdentityPaneProvider } from "./features/identity/context";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage/LeaderboardPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiProvider>
        <WalletProvider>
          <GmTimeProvider>
            <IdentityPaneProvider>{children}</IdentityPaneProvider>
          </GmTimeProvider>
        </WalletProvider>
      </ApiProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

const Pages = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Pages />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
