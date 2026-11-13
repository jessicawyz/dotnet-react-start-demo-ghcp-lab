# Copilot instructions

## Tech stack
- Backend: C# / .NET 8 ASP.NET Core Web API, EF Core InMemory, Swagger.
- Frontend: React 18, strict TypeScript, Vite 5, React Router 6, Tailwind CSS 3.
- Tests: xUnit, Moq, ASP.NET Core WebApplicationFactory, EF Core InMemory, Coverlet.
- Frontend testing: Jest + React Testing Library with jsdom; configuration in `frontend/jest.config.cjs` and shared setup in `frontend/src/test/setup.ts`.

## Commands
Run each command from the directory shown; use .NET 8 SDK and Node.js 20+.
| Directory | Restore/install | Build | Test | Lint/format check |
| --- | --- | --- | --- | --- |
| `backend/` | `dotnet restore` | `dotnet build` | `dotnet test` | `dotnet format --verify-no-changes` |
| `frontend/` | `npm ci` | `npm run build` | `npm test -- --runInBand` | `npm run lint` |
Frontend build runs `tsc && vite build`; lint runs `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`.

## Folder layout
- `backend/Api.sln`: solution; `backend/src/Api/`: Web API.
- API layers: `Controllers/`, `DTOs/`, `Domain/`, `Services/`, `Repositories/`, `Extensions/`, `Middleware/`, `Swagger/`.
- `backend/tests/Api.Tests/`: `Controllers/`, `Services/`, `Repositories/`, `Integration/`, `Utils/`.
- `frontend/src/`: `components/` (UI), `routes/` (pages), `lib/` (API client and shared types); `frontend/public/`: assets.
- `legacy/`: Classic ASP migration examples; `docs/`: standards and build guidance.
- `.github/`: Copilot instructions, agents, prompts, skills; `.devcontainer/`: development environment.

## Essential conventions
1. Use `/v1/[resource]` routes, plural lowercase resource names, no `/api/` prefix or trailing slash.
2. Wrap success responses in `item`/`items`, `metadata`, `links`; use common error DTOs with `ORG-XXX-YYY` codes. Paginate with `offset=0`, `limit=20`, maximum 100.
3. Give DTO properties explicit camelCase `[JsonPropertyName]` and XML docs; use `Indicator` for booleans (not `is`/`has`), `Date` for dates, `Id` for identifiers.
4. Suffix async methods with `Async`; put `CancellationToken` last and forward it downstream.
5. Keep business logic in services and data access in repositories; use interfaces, scoped DI in `Extensions/ServiceCollectionExtensions.cs`, LINQ and `AsNoTracking()` for reads; no stored procedures.
6. Name tests `{MethodName}_{Scenario}_{ExpectedResult}` with Arrange/Act/Assert comments; use EF Core InMemory (never SQLite), unique database names per test, and dispose contexts.
7. Use strict TypeScript, interfaces for object shapes, types for unions/primitives, shared types in `lib/types.ts`, and the existing `lib/api.ts` client.
8. Style with Tailwind utilities and brand CSS variables; keep user-facing strings in constants or translation files, not hardcoded in components.

For all other rules and detailed examples, follow [development standards](../docs/development-standards.md), including Git workflow, coverage requirements, and migration type mappings.
