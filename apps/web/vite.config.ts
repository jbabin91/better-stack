import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          query: ['@tanstack/react-query'],
          react: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@repo/ui'],
        },
      },
    },
  },
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      semicolons: true,
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tsconfigPaths(),
  ],
  preview: {
    port: 5173,
  },
});
