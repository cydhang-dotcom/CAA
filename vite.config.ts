import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: '/CAA',
    define: {
      // Polyfill for code accessing process.env.API_KEY
      'process.env': {
        API_KEY: env.API_KEY,
      },
      // Ensure 'process' is defined for the safety checks in gemini.ts
      'process': {
        env: {
          API_KEY: env.API_KEY
        }
      }
    },
    server: {
      port: 3000,
    }
  };
});