import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'mern-state-backend.vercel.app', // your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
