import { execSync } from 'node:child_process';

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { testClient } from 'hono/testing';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZodIssueCode } from 'zod';

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '../../lib/constants';
import { createApp } from '../../lib/create-app';
import { env } from '../../lib/env';
import { tasksRouter } from './tasks.index';

if (env.NODE_ENV !== 'test') {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route('/', tasksRouter));

describe('tasks routes', () => {
  beforeAll(() => {
    execSync('pnpm test:db:up');
    execSync('pnpm db:push');
  });

  afterAll(() => {
    execSync('pnpm test:db:down');
  });

  it('post /tasks validates the body when creating', async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error - we're testing validation
      json: {
        done: false,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.path[0]).toBe('name');
      expect(json.error.issues[0]?.message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const id = crypto.randomUUID();
  const name = 'Learn vitest';

  it('post /tasks creates a task', async () => {
    const response = await client.tasks.$post({
      json: {
        id,
        name,
        done: false,
      },
    });
    expect(response.status).toBe(201);
    if (response.status === 201) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it('get /tasks lists all tasks', async () => {
    const response = await client.tasks.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(Array.isArray(json)).toBe(true);
      expect(json.length).toBe(1);
    }
  });

  it('get /tasks/{id} validates the id param', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        // @ts-expect-error - we're testing validation
        id: 1,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.path[0]).toBe('id');
      expect(json.error.issues[0]?.message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_UUID,
      );
    }
  });

  it('get /tasks/{id} returns 404 when task not found', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        id: '00000000-0000-0000-0000-000000000000',
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it('get /tasks/{id} gets a single task', async () => {
    const response = await client.tasks[':id'].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it('patch /tasks/{id} validates the body when updating', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        id,
      },
      json: {
        name: '',
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.path[0]).toBe('name');
      expect(json.error.issues[0]?.code).toBe(ZodIssueCode.too_small);
    }
  });

  it('patch /tasks/{id} validates the id param', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        // @ts-expect-error - we're testing validation
        id: 1,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.path[0]).toBe('id');
      expect(json.error.issues[0]?.message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_UUID,
      );
    }
  });

  it('patch /tasks/{id} validates empty body', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        id,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0]?.message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it('patch /tasks/{id} updates a single property of a task', async () => {
    const response = await client.tasks[':id'].$patch({
      param: {
        id,
      },
      json: {
        done: true,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.done).toBe(true);
    }
  });

  it('delete /tasks/{id} validates the id when deleting', async () => {
    const response = await client.tasks[':id'].$delete({
      param: {
        // @ts-expect-error - we're testing validation
        id: 1,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0]?.path[0]).toBe('id');
      expect(json.error.issues[0]?.message).toBe(
        ZOD_ERROR_MESSAGES.EXPECTED_UUID,
      );
    }
  });

  it('delete /tasks/{id} removes a task', async () => {
    const response = await client.tasks[':id'].$delete({
      param: {
        id,
      },
    });
    expect(response.status).toBe(204);
  });
});
