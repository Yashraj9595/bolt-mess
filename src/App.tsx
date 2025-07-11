import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";

// Theme and Auth providers
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

// PWA Components
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { PWAStatus } from "@/components/pwa/status";
import { OfflineContent } from "@/components/pwa/offline-content";

// App Components
import { RootClientWrapper } from "./components/wrappers/root-client-wrapper";
import { routes } from "@/routes/config";

// Lazy load DevTools to avoid bundling in production
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RootClientWrapper>
              <AppRoutes />
            </RootClientWrapper>
            <InstallPrompt />
            <PWAStatus isOnline={navigator.onLine} />
            <Toaster position="top-center" />
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'development' && (
          <Suspense>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </BrowserRouter>
  );
}
