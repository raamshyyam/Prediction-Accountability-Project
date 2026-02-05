import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  // These defines prevent 'ReferenceError: process is not defined' in the browser
  define: {
    'process.env': {},
    'global': 'window',
  },
  server: {
    port: 3000,
    strictPort: true
  }
});