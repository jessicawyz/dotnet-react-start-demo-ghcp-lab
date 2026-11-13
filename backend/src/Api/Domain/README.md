# Domain

Domain entities and business rules.

## Pattern

- Entity classes represent database tables
- Use nullable reference types appropriately
- Follow naming conventions from organization standards

## Example

```csharp
public class Employee
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }
    public int DepartmentId { get; set; }
    public DateTime? HireDate { get; set; }
    public bool ActiveIndicator { get; set; }
    public decimal Salary { get; set; }

    // Navigation properties
    public Department? Department { get; set; }
}
```
