# Service Tests

Unit tests for business logic services.

## Pattern

- Test file: `{Name}ServiceTests.cs`
- Naming: `{Method}_{Scenario}_{Expected}`
- Use Moq for repository mocking
- Use AAA comments: `// Arrange`, `// Act`, `// Assert`
- Organize with `#region` blocks
