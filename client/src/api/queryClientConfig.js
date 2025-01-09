import { QueryClient } from "@tanstack/react-query";

// React Query Client for caching and queries
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            cacheTime: 1000 * 60 * 10,
        },
    },
});

export default queryClient;
