import { Spinner } from '@repo/ui';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanstackQueryDevtools } from '@web/components/utils/tanstack-query-devtools';
import { TanstackRouterDevtools } from '@web/components/utils/tanstack-router-devtools';
import { Suspense } from 'react';

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Suspense fallback={<Spinner size="large" />}>
        <TanstackRouterDevtools position="bottom-left" />
        <TanstackQueryDevtools
          buttonPosition="bottom-right"
          position="bottom"
        />
      </Suspense>
    </>
  );
}
