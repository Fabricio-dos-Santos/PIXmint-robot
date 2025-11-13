# Implementation status — PIXmint-robot

This file summarizes what is implemented, what is intentionally mocked/placeholder and what remains to be done.

> Note: This doc is a living checklist to help development and onboarding. It is intentionally detailed and points to the files where the implementation lives.

## Current implemented features

- Backend (TypeScript / Express / Prisma)
  - Employee CRUD scaffolding (see `src/`)
  - Prisma client and SQLite dev DB (schema in `prisma/schema.prisma`)
  - Seed script: `prisma/seed.ts` — generates example employees (now 12 entries, 3 per pixKey type)
  - Security middleware (helmet, rate-limit)
  - Swagger/OpenAPI exposed at `/docs`

- Frontend (Vite + React + TypeScript)
  - Employees page at `frontend/src/pages/Employees.tsx` with table view
  - PixKey detection and masking helpers (email/telefone/CPF/random)
  - Copy button for pixKey full value
  - Date formatting to `pt-BR`

- Tests
  - Backend: Jest tests (unit + integration) under `src/` and `tests/seed.test.ts`
  - Frontend: Vitest tests in `frontend/src` (employees UI)

## Placeholders / intentionally no-op UI actions

The UI contains controls that are intentionally left as no-ops (for wiring later):

- `Novo` button on `Employees` page — currently has no form or navigation. File: `frontend/src/pages/Employees.tsx` (line: `Novo` button).
- `Edit` icon/button in the Actions column — click handler is a no-op. Replace with a connected modal or route.
- `Excluir` icon/button in the Actions column — click handler is a no-op. Implement confirmation + delete endpoint call.

These are documented here so reviewers know which interactions still need wiring.

## Validation details and recent decisions

- Email validation: restricted to `.com` and `.com.br` (frontend, backend tests and seed generator use this rule).
- CPF validation: simplified to a length-only check (11 digits). The UI displays masked value with standard mask `999.999.999-99`.
- Phone detection: recognizes 10-digit landlines or 11-digit mobiles where the 3rd digit is `9` (Brazilian mobile convention). This avoids ambiguity with 11-digit CPFs.

Rationale: These choices keep the seed/test/UX consistent and avoid brittle checksum generation during local development.

## Missing / Recommended next implementations

- Implement `Novo` employee flow (form, validation, POST /employees and optimistic UI update).
- Implement Edit flow (modal or page) and hook to PUT/PATCH endpoint.
- Implement Delete flow with confirmation and server-side deletion.
- Add CI check that runs `prisma/seed.ts` and asserts distribution (3 per type) — prevents regressions.
- Optionally re-introduce CPF checksum validation if you want stronger validation in production; keep simplified rule for dev/test.
- Add end-to-end tests for the Employees UI (Cypress or Playwright) to validate visual/interaction flows.

## Where to look in the code

- Frontend UI: `frontend/src/pages/Employees.tsx`
- Seed: `prisma/seed.ts`
- Seed-check helper: `scripts/check-seed.ts`
- Unit tests: `src/**/*.test.ts`, `tests/seed.test.ts`, `frontend/src/**/*.test.tsx`

## How to run the app locally

See `README.md` root for start instructions (backend, frontend, dev:all and dev:all:bg scripts).

---

If you want, I can: (a) wire up `Excluir` to call the backend delete endpoint and show a confirmation, (b) add the `Novo` form, or (c) create a tiny CI check that runs the seed and asserts distribution. Tell me which to implement next.