import { app } from '@backend/app';
import { env } from '@backend/lib/env';

const port = Number(env.PORT);

export default {
  fetch: app.fetch,
  port,
};
