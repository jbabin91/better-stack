import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' })
    .notNull()
    .default(false),
  id: text('id').primaryKey(),
  image: text('image'),
  lastKeyGeneratedAt: integer('lastKeyGeneratedAt', { mode: 'timestamp' }),
  name: text('name').notNull(),
  subscriptionId: text('subscriptionId'),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const session = sqliteTable('session', {
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  id: text('id').primaryKey(),
  ipAddress: text('ipAddress'),
  token: text('token').notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable('account', {
  accessToken: text('accessToken'),
  accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
  accountId: text('accountId').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  id: text('id').primaryKey(),
  idToken: text('idToken'),
  password: text('password'),
  providerId: text('providerId').notNull(),
  refreshToken: text('refreshToken'),
  refreshTokenExpiresAt: integer('refreshTokenExpiresAt', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
});

export const verification = sqliteTable('verification', {
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  value: text('value').notNull(),
});

export const rateLimit = sqliteTable('rateLimit', {
  count: integer('count').notNull().default(0),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  endpoint: text('endpoint').notNull(),
  id: text('id').primaryKey(),
  resetAt: integer('resetAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type RateLimit = typeof rateLimit.$inferSelect;
