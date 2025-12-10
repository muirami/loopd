import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose API_KEY; fallback to empty string to prevent build crashes
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  // Removed explicit rollupOptions.input to let Vite automatically find index.html
});
