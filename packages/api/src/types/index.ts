import {
  type OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
} from '@hono/zod-openapi';

import { type Env } from '../lib/context';

export type AppOpenAPI = OpenAPIHono<Env>;

export type AppRouteHandler<T extends RouteConfig> = RouteHandler<T, Env>;
