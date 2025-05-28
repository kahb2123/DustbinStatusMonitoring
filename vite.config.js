import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DustbinStatusMonitoring',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Clears the dist folder before building
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  resolve: {
    alias: {
      'react-bootstrap': 'react-bootstrap/dist/react-bootstrap.js',
    },
  },
});