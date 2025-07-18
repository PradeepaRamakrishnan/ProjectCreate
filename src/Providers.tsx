import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { Helmet, HelmetProvider } from "react-helmet-async";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      })
  );

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Helmet>
          <title>Project</title>
          <meta
            name="description"
            content="create project with uploaded files"
          />
        </Helmet>
        {children}
        <Toaster
          position="bottom-right"
          richColors={true}
          toastOptions={{ duration: 5000 }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default Providers;
