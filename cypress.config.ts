import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'tb88mg',
  e2e: {
    setupNodeEvents(on, config) {
      const envName: string = config.env?.ENV || "local";

      config.baseUrl = getBaseUrl(envName) ?? 'http://localhost:5173';
      config.env = {
        ...config.env,
        backendUrl: getBackendUrl(envName) ?? 'http://127.0.0.1:8000/api',
      };

      return config;
    },
    // baseUrl: process.env.VITE_FRONTEND_URL ?? 'http://localhost:5173',
    // env: {
    //   backendUrl: process.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8000/api'
    // },
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  // video: true,
  // videosFolder: 'cypress/videos',
});

function getBaseUrl(env: string): string {
  switch (env) {
    case "local":
      return "http://localhost:5173";
    case "test":
      return "http://test.mamfachowca.pl";
    default:
      return "http://localhost:5173";
  }
}

function getBackendUrl(env: string): string {
  switch (env) {
    case "local":
      return "http://127.0.0.1:8000/api";
    case "test":
      return "http://test.mamfachowca-api.pl/api";
    default:
      return "http://127.0.0.1:8000/api";
  }
}

// Usage examples:
// npx cypress run --env ENV=local
// npx cypress run --env ENV=staging
// npx cypress run --env ENV=production
