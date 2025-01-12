import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'f9y2xo',
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
})
