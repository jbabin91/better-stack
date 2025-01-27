import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'cz-git';

const apps = fs.readdirSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'apps'),
);
const packages = fs.readdirSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'packages'),
);

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
  prompt: {
    alias: {
      b: 'chore(repo): bump dependencies',
    },
    allowBreakingChanges: ['feat', 'fix'],
    allowCustomIssuePrefix: false,
    allowEmptyIssuePrefix: false,
    enableMultipleScopes: true,
    maxSubjectLength: 100,
    scopeEnumSeparator: ',',
    skipQuestions: [],
    useEmoji: false,
  },
  rules: {
    'scope-enum': [2, 'always', ['repo', ...apps, ...packages]],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 2],
  },
});
