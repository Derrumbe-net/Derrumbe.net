const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',

    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: true,
      json: true,
      embeddedScreenshots: true,
      inlineAssets: true
    },

    setupNodeEvents(on, config) {

      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });

      // IMPORTANT — return config
      return config;
    }
  },
});
