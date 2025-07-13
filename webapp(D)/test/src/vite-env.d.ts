import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // Alias global to window in browser
  },
  resolve: {
    alias: {
      // Polyfill Node.js core modules for aws-sdk
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'util'],
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
});
