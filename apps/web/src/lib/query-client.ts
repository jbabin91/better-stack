import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 2, // Number of times to retry failed mutations
    },
    queries: {
      // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30,
      // Number of times to retry failed queries
      refetchOnWindowFocus: false,
      // Unused data is garbage collected after 30 minutes
      retry: 2,
      staleTime: 1000 * 60 * 5, // Disable automatic refetching when window regains focus
    },
  },
});
