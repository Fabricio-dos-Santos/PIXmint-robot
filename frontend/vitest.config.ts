import { defineConfig } from 'vitest/config';

// Single-process configuration to avoid worker/fork pool timeouts on some Windows setups.
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  // disable threads/workers in this environment to avoid pool/fork timeouts
  // @ts-ignore: vitest runtime option — types may differ across versions
  threads: false,
  // run tests in-process (do not isolate each file) — helps avoid forks on some environments
  // remove 'isolate' to ensure no per-file worker isolation is attempted
  testTimeout: 20000,
    // run a setup file to register testing-library matchers (toBeInTheDocument etc.)
    setupFiles: ['./src/setupTests.ts'],
  },
});
