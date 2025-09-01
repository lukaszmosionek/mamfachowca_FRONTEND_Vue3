import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'tb88mg',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.VITE_FRONTEND_URL ?? 'http://localhost:5173',
    env: {
      backendUrl: process.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8000/api'
    },
    defaultCommandTimeout: 10000, // increase timeout globally
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
