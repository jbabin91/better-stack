import { TextDecoder } from 'node:util';

import { apiReference } from '@scalar/hono-api-reference';
import { type Swagger } from 'atlassian-openapi';
import { isErrorResult, merge } from 'openapi-merge';

import packageJSON from '../../package.json' with { type: 'json' };
import { env } from '../configs/env';
import { type AppOpenAPI } from '../types';
import { auth } from './auth';

const isProduction = env.NODE_ENV === 'production';

type Module = {
  description: string;
  name: string;
};

const appModulesList: Module[] = [];

const commonModulesList: Module[] = [
  { description: 'Tasks API', name: 'Tasks' },
  { description: 'Auth API', name: 'Default' },
];

function configureOpenAPI(app: AppOpenAPI) {
  const tags = [...commonModulesList, ...appModulesList];

  app.doc31('/openapi', {
    info: {
      title: 'Tasks API',
      version: packageJSON.version,
    },
    openapi: '3.1.0',
    tags,
  });

  app.get('/openapi.json', async (c) => {
    const nonAuthRef = await fetch(`${env.BASE_URL}/openapi`).then(
      (res) => res.body,
    );
    let result = '';

    if (nonAuthRef) {
      const reader = nonAuthRef.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: isDone } = await reader.read();
        if (value) {
          result += decoder.decode(value, { stream: true });
        }
        done = isDone;
      }
    }

    const authRef =
      (await auth.api.generateOpenAPISchema()) as Swagger.SwaggerV3;

    const mergeResult = merge([
      {
        oas: JSON.parse(result),
      },
      {
        oas: authRef,
        pathModification: {
          prepend: '/auth',
        },
      },
    ]);

    if (isErrorResult(mergeResult)) return c.body(JSON.stringify(c.error));

    return c.body(JSON.stringify(mergeResult.output), 200);
  });

  app.get(
    '/reference',
    apiReference({
      defaultHttpClient: {
        clientKey: 'fetch',
        targetKey: 'js',
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
