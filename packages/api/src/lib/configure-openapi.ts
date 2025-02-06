import { apiReference } from '@scalar/hono-api-reference';

import packageJSON from '../../package.json' with { type: 'json' };
import { type AppOpenAPI } from '../types';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

function configureOpenAPI(app: AppOpenAPI) {
  app.doc31('/openapi.json', {
    info: {
      title: 'Tasks API',
      version: packageJSON.version,
    },
    openapi: '3.1.0',
  });

  app.get(
    '/reference',
    apiReference({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'javascript',
      },
      layout: 'classic',
      servers: [
        {
          description: isProduction
            ? 'Production server'
            : 'Development server',
          url: env.BASE_URL,
        },
      ],
      spec: {
        url: isProduction ? '/api/openapi.json' : '/openapi.json',
      },
      theme: 'kepler',
    }),
  );
}

export { configureOpenAPI };
