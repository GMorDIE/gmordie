import { HomePage } from "./HomePage/HomePage";
import { IdentityVerificationPage } from "./IdentityVerificationPage/IdentityVerificationPage";
import { LeaderboardPage } from "./LeaderboardPage/LeaderboardPage";
import { TransactionsPage } from "./TransactionsPage/TransactionsPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

export const Pages = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/id-verification" element={<IdentityVerificationPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
