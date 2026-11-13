# Repositories

Data access layer following organization standards.

## Pattern

- Interface: `I{Name}Repository.cs`
- Implementation: `{Name}Repository.cs`
- Use EF Core with `AsNoTracking()` for reads
- Register in `Extensions/ServiceCollectionExtensions.cs`

## Example

```csharp
public interface IEmployeeRepository
{
    Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IEnumerable<Employee>> GetAllAsync(EmployeeQuery query, CancellationToken cancellationToken);
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }
}
```
