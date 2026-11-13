---
name: dotnet-api-standards
description: Organization API standards for .NET 8 Web API development
---

# .NET API Standards Skill

This skill provides standards for building APIs in this organization.

## Key Rules

1. **Route prefix:** `/v1/` (never `/api/`)
2. **All responses** use envelope pattern (ItemResponseDto or CollectionResponseDto)
3. **Boolean properties** end with `Indicator` suffix
4. **Pagination** uses `offset`/`limit` parameters
5. **All async methods** have `CancellationToken` as last parameter
6. **DTOs** require `[JsonPropertyName]` and XML documentation

## Envelope Pattern

Single item responses use `ItemResponseDto<T>`:
- `item` - The payload
- `metadata` - Timestamp, transactionId
- `links` - Self, next, prev URLs

Collection responses use `CollectionResponseDto<T>`:
- `items` - Array of payloads
- `metadata` - Includes totalCount
- `links` - Pagination URLs

## Error Codes

- `ORG-VAL-001` - Validation error
- `ORG-NTF-001` - Not found
- `ORG-AUT-001` - Authentication error
- `ORG-INT-001` - Internal error

## See Also

Check `examples/` folder for reference implementations.
