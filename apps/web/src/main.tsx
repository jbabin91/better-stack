import '@web/index.css';
import '@repo/ui/styles.css';

import App from '@web/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Providers } from './providers';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
