import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // when the query failed the the tanstack will retrt one more time before the error
      refetchOnWindowFocus: false, // when the user goes from a tab to another tab tanstack will not refetch
      staleTime: 1000 * 60 * 2, // After 2 minutes: if a refetch trigger occurs, such as the component mounting again, TanStack Query may fetch fresh data.
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
