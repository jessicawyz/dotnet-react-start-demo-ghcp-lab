# Repository Tests

Integration tests for data access repositories.

## Pattern

- Test file: `{Name}RepositoryTests.cs`
- Use EF Core InMemory provider (never SQLite)
- Create unique database per test with `Guid.NewGuid()`
- Implement `IDisposable` for cleanup
- Use AAA comments
