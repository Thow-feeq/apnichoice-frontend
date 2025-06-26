import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ ensures `expect` and `test` are global
    environment: 'jsdom', // ✅ simulates browser
    setupFiles: './src/setupTests.js',
  },
});
