import '@web/styles/globals.css';
import '@repo/ui/styles.css';

import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@web/lib/router';
import { Providers } from '@web/providers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

enableReactTracking({
  warnMissingUse: true,
});

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
