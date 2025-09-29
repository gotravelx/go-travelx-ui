const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // Path to your Next.js app
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",

  // 👇 this is where the "@/..." alias is resolved
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "!components/ui/**", 
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
  ],

  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

  // ✅ next/jest already handles transforms, so we just ignore these
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/components/landing-page.tsx",
    "<rootDir>/components/flight-search.tsx",
    "<rootDir>/components/unsubscribe-flight-client.tsx",
    "<rootDir>/components/unsubscribe-flight-data-table.tsx",
    "<rootDir>/components/view-flight-data-table.tsx",
    "<rootDir>/components/view-flight.tsx",
    "<rootDir>/components/theme-switcher.tsx", 
    "<rootDir>/components/expandable-flight-table.tsx", 
    "<rootDir>/components/subscribtion-flight-status-view.tsx", 
    "<rootDir>/components/subscribe-card.tsx",
    "<rootDir>/components/flight-status-view.tsx",

    ],
};

module.exports = createJestConfig(customJestConfig);
