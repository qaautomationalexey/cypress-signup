import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "jx44zg",
  e2e: {
    setupNodeEvents(on, config) {
      return config;
    }
  }
});
