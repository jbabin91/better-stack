import { getContext } from 'hono/context-storage';
import { type PinoLogger } from 'hono-pino';

import { type auth } from './auth';

/**
 * Define the context environment.
 *
 * @link https://hono.dev/docs/middleware/builtin/context-storage#usage
 */
export type Env = {
  Variables: {
    logger: PinoLogger;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

/**
 * Access the current logger from the request context.
 */
export function getContextLogger() {
  return getContext<Env>().var.logger;
}

/**
 * Access the current user from the request context.
 *
 * @returns The `User` object of the currently authenticated user.
 */
export function getContextUser() {
  return getContext<Env>().var.user;
}

/**
 * Access the current session from the request context.
 *
 * @returns The `Session` object of the currently authenticated user.
 */
export function getContextSession() {
  return getContext<Env>().var.session;
}
