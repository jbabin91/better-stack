import { createRouter } from '@tanstack/react-router';
import { queryClient } from '@web/lib/query-client';
import { routeTree } from '@web/routeTree.gen';

// Create a new router instance
export const router = createRouter({
  context: { queryClient },
  routeTree,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}
