import { env } from '@backend/lib/env';
import { app } from '@repo/api';

const port = Number(env.PORT);

export default {
  fetch: app.fetch,
  port,
};
