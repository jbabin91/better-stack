import { configureOpenAPI } from '@backend/lib/configure-openapi';
import { createApp } from '@backend/lib/create-app';
import { routes } from '@backend/routes';

const app = createApp();

configureOpenAPI(app);

for (const route of routes) {
  app.route('/', route);
}

export type AppType = (typeof routes)[number];

export { app };
