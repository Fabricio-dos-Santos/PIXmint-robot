# Services architecture

This document explains the small services layer added to the project and how to extend it.

## Purpose

- Separate business logic from HTTP concerns (controllers). Controllers should be thin: parse input, call services, return HTTP responses.
- Services encapsulate validation, domain rules and interact with the data layer (`models`).

## Current implementation

- `src/services/employeeService.ts` - handles employee creation, listing, retrieval, update and deletion. It uses `employeeModel` for persistence and throws domain errors (`NotFoundError`, `ValidationError`) when appropriate.

## Contracts

- Inputs/outputs are defined in `src/types/employee.ts` and reused by services.

Service functions (summary):

- `createEmployee(input: CreateEmployeeInput): Promise<Employee>`
- `listEmployees(): Promise<Employee[]>`
- `getEmployee(id: string): Promise<Employee>`
- `updateEmployee(id: string, input: Partial<CreateEmployeeInput>): Promise<Employee>`
- `deleteEmployee(id: string): Promise<void>`

Errors thrown by services:

- `ValidationError` (400) — input validation failed; contains `errors: string[]`.
- `NotFoundError` (404) — requested resource not found.

## How to add a new service

1. Create `src/services/myEntityService.ts`.
2. Reuse types in `src/types/*.ts` or add new ones there.
3. Keep controllers thin — controllers should only call services and map thrown errors to HTTP responses via the centralized `errorHandler`.
4. Write unit tests for the service (mock models). Add integration tests that exercise the full stack when needed.

## Testing

- Unit tests for services should mock underlying `models` (see `src/services/employeeService.test.ts`).
