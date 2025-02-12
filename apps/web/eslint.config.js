import { config } from '@repo/eslint-config/base';
import reactCompiler from 'eslint-plugin-react-compiler';

/** @type {import("eslint").Linter.Config} */
export default [
  ...Object.values(config),
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
];
