// vite.config.js
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables from the .env file
    const env = loadEnv(mode, '.', '');

    return {
      // The `base` path is no longer needed because Vercel deploys to the root of the domain.
      // Remove or comment out this line: base: '/SE1/',

      // The `define` property injects your API keys as environment variables.
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      // The `resolve` property for aliases is still useful.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
