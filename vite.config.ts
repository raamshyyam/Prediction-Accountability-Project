import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  // We define specific variables to be replaced at build time.
  // This ensures libraries like the Gemini SDK can access the API key in the browser.
  define: {
    'process.env': {},
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'global': 'window',
  },
  server: {
    port: 3000,
    strictPort: true
  }
});