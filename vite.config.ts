// vite.config.js
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load environment variables from the .env file during the build
    const env = loadEnv(mode, '.', '');

    return {
      // The `base` path is critical for GitHub Pages deployment.
      // It must be set to your repository's name, surrounded by slashes.
      base: '/GenAI/',

      // The `define` property injects your API keys as environment variables
      // during the build process, so they are available in your code.
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      // The `resolve` property allows you to use a '@' alias for cleaner imports.
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
