import { ErrorBoundary } from "./components/ErrorBoundary";
import { IdentityPaneProvider } from "./features/identity/context";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { WalletProvider } from "./lib/WalletContext";
import { Pages } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

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
