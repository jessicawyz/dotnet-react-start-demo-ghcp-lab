---
name: add-unit-tests
description: Generates unit tests for existing code following organization standards
---

# Add Unit Tests

Generate comprehensive unit tests for the specified code.

## Input Required

- Target class/method to test
- Test type (unit, integration, or both)

## Test Standards

### Naming Convention
`{MethodName}_{Scenario}_{ExpectedResult}`

Examples:
- `GetByIdAsync_WhenExists_ReturnsEmployee`
- `GetAllAsync_WithInvalidOffset_ThrowsArgumentException`

### Structure Requirements

1. **File Location**
   - Controllers: `tests/Api.Tests/Controllers/`
   - Services: `tests/Api.Tests/Services/`
   - Repositories: `tests/Api.Tests/Repositories/`

2. **AAA Pattern** (mandatory comments)
   ```csharp
   // Arrange
   // Act
   // Assert
   ```

3. **Organization**
   - Group related tests with `#region` blocks
   - One test class per source class

4. **Mocking**
   - Use Moq for dependencies
   - Use TestDataBuilders for test data
   - Use InMemory database for repository tests

## Output Checklist

- [ ] Test file in correct location
- [ ] Naming follows convention
- [ ] AAA comments present
- [ ] #region blocks used
- [ ] TestDataBuilders utilized
- [ ] All edge cases covered
