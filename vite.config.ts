import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Use user provided key as fallback if env var is missing to ensure immediate functionality
  const apiKey = env.API_KEY || "sk-073zG8jhonhx4LlOmvim5I8nkZPasQ8VdGOVme8rBAyITT3B";

  return {
    plugins: [react()],
    base: '/CAA',
    define: {
      // Correctly stringify the value so it is replaced as a string literal in the client code
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Polyfill 'process.env' object just in case deeper access is needed
      'process.env': JSON.stringify({
        API_KEY: apiKey,
      }),
    },
    server: {
      port: 3000,
    }
  };
});