import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
   base: '/DustbinStatusMonitoring/', // 
  build: {
    outDir: 'dist', // Ensure build goes to 'dist'
  },
  plugins: [react()],
  resolve: {
    alias: {
      'react-bootstrap': 'react-bootstrap/dist/react-bootstrap.js',
    },
  },
});