const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'tb88mg',
  e2e: {
    setupNodeEvents(on, config) {
      const envName = config.env.ENV || "local";

      config.baseUrl = getBaseUrl(envName) ?? 'http://localhost:5173';
      config.env.backendUrl = getBackendUrl(envName) ?? 'http://127.0.0.1:8000/api';

      return config;
    },
    // baseUrl: process.env.VITE_FRONTEND_URL ?? 'http://localhost:5173',
    // // baseUrl: 'http://test.mamfachowca.mosioneklukasz.pl/',
    // env: {
    //   backendUrl: process.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:8000/api'
    //   // backendUrl: 'http://test.api.mamfachowca.mosioneklukasz.pl/'
    // },
    defaultCommandTimeout: 10000, // increase timeout globally
    viewportWidth: 1280,
    viewportHeight: 720,
  },
  // video: true, // enable video recording
  // videosFolder: 'cypress/videos', // default folder
});


function getBaseUrl(env) {
  switch (env) {
    case "local":
      return "http://localhost:5173";
    case "test":
      return "http://test.mamfachowca.pl";
    default:
      return "http://localhost:5173";
  }
}

function getBackendUrl(env) {
  switch (env) {
    case "local":
      return "http://127.0.0.1:8000/api";
    case "test":
      return "http://test.mamfachowca-api.pl/api";
    default:
      return "http://127.0.0.1:8000/api";
  }
}


// # Local
// npx cypress run --env ENV=local

// # Staging
// npx cypress run --env ENV=staging

// # Production
// npx cypress run --env ENV=production
