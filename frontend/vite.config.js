import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backems-production.up.railway.app', // Use https
        changeOrigin: true,
        secure: false, // Ignore self-signed certificate issues (if any)
      },
    },
  },
});