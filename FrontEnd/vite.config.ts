import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [
    angular({
      tsconfig: './tsconfig.app.json',
    }),
  ],
  server: {
    port: 4200,
    open: true,
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@core': '/src/app/core',
      '@features': '/src/app/features',
      '@shared': '/src/app/shared',
      '@assets': '/src/assets',
    },
  },
});
