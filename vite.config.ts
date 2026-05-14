/// <reference types="vite/client" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
});
