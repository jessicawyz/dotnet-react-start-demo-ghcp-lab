# Services

Business logic layer following organization standards.

## Pattern

- Interface: `I{Name}Service.cs`
- Implementation: `{Name}Service.cs`
- Register in `Extensions/ServiceCollectionExtensions.cs`

## Example

```csharp
public interface IEmployeeService
{
    Task<ItemResponseDto<EmployeeDto>?> GetByIdAsync(int id, CancellationToken cancellationToken);
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task<ItemResponseDto<EmployeeDto>?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken)
    {
        var employee = await _repository.GetByIdAsync(id, cancellationToken);
        // Map to DTO and return envelope response
    }
}
```
