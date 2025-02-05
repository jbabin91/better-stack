import { env } from '@backend/lib/env';
import { type AppOpenAPI } from '@backend/types';
import { apiReference } from '@scalar/hono-api-reference';

import packageJSON from '../../package.json' with { type: 'json' };

const isProduction = env.NODE_ENV === 'production';

function configureOpenAPI(app: AppOpenAPI) {
  app.doc31('/openapi.json', {
    info: {
      title: 'Tasks API',
      version: packageJSON.version,
    },
    openapi: '3.1.0',
    servers: [
      {
        description: isProduction ? 'Production server' : 'Development server',
        url: env.BASE_URL,
      },
    ],
  });

  app.get(
    '/reference',
    apiReference({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'javascript',
      },
      layout: 'classic',
      spec: {
        url: '/openapi.json',
      },
      theme: 'kepler',
    }),
  );
}

export { configureOpenAPI };
