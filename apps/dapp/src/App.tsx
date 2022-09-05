import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { LeaderboardPage } from "./pages/Leaderboard/LeaderboardPage";
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

function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <WalletProvider>
          <GmTimeProvider>
            <Pages />
          </GmTimeProvider>
        </WalletProvider>
      </ApiProvider>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
