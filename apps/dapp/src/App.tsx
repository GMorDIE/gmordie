import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader } from "./components/Loader";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <ApiProvider>
          <WalletProvider>
            <GmTimeProvider>
              <HomePage />
            </GmTimeProvider>
          </WalletProvider>
        </ApiProvider>
        <Toaster />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
