import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  clean: true,
  dts: true,
  entry: {
    hc: 'src/hc.ts',
    index: 'src/index.ts',
  },
  external: [],
  format: ['esm'],
  minify: !options.watch,
  sourcemap: true,
  splitting: true,
  treeshake: true,
}));
