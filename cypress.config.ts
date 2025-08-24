import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'tb88mg',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    env: {
      backendUrl: process.env.VITE_BACKEND_URL
    },
  },
});
