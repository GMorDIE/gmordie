import { ErrorBoundary } from "./components/ErrorBoundary";
import { IdentityPane } from "./features/identity/IdentityPane";
import { IdentityPaneProvider } from "./features/identity/context";
import { SendPane } from "./features/send/SendPane";
import { SendPaneProvider } from "./features/send/context";
import { ApiProvider } from "./lib/ApiContext";
import { GmTimeProvider } from "./lib/GmTimeContext";
import { NavigationMenuProvider } from "./lib/NavigationMenuContext";
import { SettingsProvider } from "./lib/SettingsContext";
import { WalletProvider } from "./lib/WalletContext";
import { Pages } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <WalletProvider>
            <GmTimeProvider>
              <NavigationMenuProvider>
                <SendPaneProvider>
                  <IdentityPaneProvider>{children}</IdentityPaneProvider>
                </SendPaneProvider>
              </NavigationMenuProvider>
            </GmTimeProvider>
          </WalletProvider>
        </ApiProvider>
        <Toaster />
      </QueryClientProvider>
    </SettingsProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Pages />
        <IdentityPane />
        <SendPane />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
