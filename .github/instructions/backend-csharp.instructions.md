---
name: "Backend C# conventions"
description: "Conventions for the ASP.NET Core API and its xUnit tests. Use when writing or reviewing C# in backend/."
applyTo: "backend/**/*.cs"
---

# Backend (ASP.NET Core, .NET 8)

## API design
- Routes: `[Route("v1/[controller]")]`, no `/api/` prefix, plural lowercase resources, no trailing slash.
- Wrap responses in `ItemResponseDto<T>` / `CollectionResponseDto<T>` (item/items + metadata + links).
- Paginate with `offset`/`limit` (default 20, max 100).
- Error codes follow `ORG-<AREA>-<NNN>`, for example `ORG-VAL-001`.
- Annotate actions with `[ProducesResponseType]`.

## Naming
- Booleans end in `Indicator` (`activeIndicator`), never `is`/`has` prefixes.
- Dates end in `Date`, identifiers end in `Id`.
- Async methods end in `Async` and take `CancellationToken` as the last parameter.

## Structure
- DTOs live in `DTOs/` with `[JsonPropertyName("camelCase")]` and XML doc comments.
- Data access goes through interfaces in `Repositories/`, business logic in `Services/`.
- Use `AsNoTracking()` for reads. No stored procedures.
- Register services with `AddScoped` in `Extensions/ServiceCollectionExtensions.cs`.

## Tests
- Name tests `{Method}_{Scenario}_{Expected}`, with `// Arrange`, `// Act`, `// Assert` comments.
- Use the EF Core InMemory provider (never SQLite) and the existing test data builders.