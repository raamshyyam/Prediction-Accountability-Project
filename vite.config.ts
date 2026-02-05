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
  // Ensure process and global are available to libraries that expect them
  define: {
    'process.env': JSON.stringify(process.env || {}),
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'global': 'window',
  },
  server: {
    port: 3000,
    strictPort: true
  }
});