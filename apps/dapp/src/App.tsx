import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { SettingsProvider } from "./lib/SettingsContext";
import { WalletProvider } from "./lib/WalletContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ApiProvider>
          <WalletProvider>
            <GmTimeProvider>
              <HomePage />
            </GmTimeProvider>
          </WalletProvider>
        </ApiProvider>
      </SettingsProvider>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
