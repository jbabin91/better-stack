import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.ts',
    schema: 'src/schema/index.ts',
  },
  external: [],
  format: ['esm'],
  minify: !options.watch,
  sourcemap: true,
  splitting: true,
  treeshake: true,
}));
