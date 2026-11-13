module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: { module: 'CommonJS', moduleResolution: 'Node' } },
    ],
  },
  clearMocks: true,
  restoreMocks: true,
  coverageReporters: ['text'],
  collectCoverageFrom: [
    'src/lib/preferences.ts',
    'src/routes/preferences/PreferencesPage.tsx',
    'src/App.tsx',
  ],
};
