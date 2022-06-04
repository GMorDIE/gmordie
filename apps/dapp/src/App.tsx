import { Toaster } from "react-hot-toast";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";

function App() {
  return (
    <ErrorBoundary>
      <ApiProvider>
        <WalletProvider>
          <GmTimeProvider>
            <HomePage />
          </GmTimeProvider>
        </WalletProvider>
      </ApiProvider>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
