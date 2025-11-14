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
  // force no isolation and keep single-threaded execution
  // @ts-ignore: vitest runtime option
  isolate: false,
  // try disabling the internal pool if available to avoid forks on some Windows hosts
  // @ts-ignore: runtime option that may not exist on all versions
  pool: {
    enabled: false,
  },
  // increase timeouts to accommodate slow Windows environments
  // @ts-ignore: may not exist in types depending on vitest version
  testTimeout: 120000,
  // attempt to cap workers/threads to 1 as a last-resort single-process run
  // @ts-ignore
  maxThreads: 1,
  // @ts-ignore
  maxWorkers: 1,
    // run a setup file to register testing-library matchers (toBeInTheDocument etc.)
    setupFiles: ['./src/setupTests.ts'],
  },
});
