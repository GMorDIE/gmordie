import { Button } from "./Button";
import { useCallback } from "react";
import { ReactNode } from "react";
import { ErrorBoundary as LibErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({ error }: { error: Error }) => {
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <div className="self-center p-8 text-center ">
        <h1 className="text-5xl font-bold text-red-400">Oops !</h1>
        <p className="my-8 text-red-100">
          Something went wrong : {error.message}
        </p>
        <div className="my-16">
          <Button onClick={handleReload}>Refresh Page</Button>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <LibErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </LibErrorBoundary>
  );
};
