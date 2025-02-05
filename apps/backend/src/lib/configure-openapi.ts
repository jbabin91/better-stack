import { env } from '@backend/lib/env';
import { type AppOpenAPI } from '@backend/types';
import { apiReference } from '@scalar/hono-api-reference';

import packageJSON from '../../package.json' with { type: 'json' };

function configureOpenAPI(app: AppOpenAPI) {
  const isProduction = env.NODE_ENV === 'production';

  const servers: { description: string; url: string }[] = [];

  servers.push({
    description: isProduction ? 'Production server' : 'Development server',
    url: env.BASE_URL,
  });

  app.doc('/doc', {
    info: {
      title: 'Tasks API',
      version: packageJSON.version,
    },
    openapi: '3.0.0',
  });

  app.get(
    '/reference',
    apiReference({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'javascript',
      },
      layout: 'classic',
      servers: [...servers],
      spec: {
        url: '/doc',
      },
      theme: 'kepler',
    }),
  );
}

export { configureOpenAPI };
