using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

/// <summary>
/// Example repository demonstrating organization data access patterns.
/// Uses EF Core with AsNoTracking for read operations.
/// NEVER calls stored procedures - implements logic in LINQ.
/// </summary>
public sealed class ExampleEmployeeRepository : IExampleEmployeeRepository
{
    private readonly AppDbContext _databaseContext;

    public ExampleEmployeeRepository(AppDbContext databaseContext)
    {
        _databaseContext = databaseContext;
    }

    /// <summary>
    /// Retrieves employee by ID using AsNoTracking for read performance.
    /// </summary>
    public async Task<EmployeeEntity?> GetByIdAsync(
        int employeeId,
        CancellationToken cancellationToken)
    {
        return await _databaseContext.Employees
            .AsNoTracking()
            .FirstOrDefaultAsync(emp => emp.Id == employeeId, cancellationToken);
    }

    /// <summary>
    /// Retrieves employees with filtering and pagination.
    /// Implements SP logic in LINQ rather than calling stored procedures.
    /// </summary>
    public async Task<IReadOnlyList<EmployeeEntity>> GetAllAsync(
        EmployeeQueryParams queryParams,
        CancellationToken cancellationToken)
    {
        var queryBuilder = _databaseContext.Employees.AsNoTracking();

        // Apply department filter if specified (0 means no filter)
        if (queryParams.DepartmentId > 0)
        {
            queryBuilder = queryBuilder.Where(emp => emp.DepartmentId == queryParams.DepartmentId);
        }

        // Apply active filter if specified
        if (queryParams.ActiveOnlyIndicator)
        {
            queryBuilder = queryBuilder.Where(emp => emp.ActiveIndicator);
        }

        // Apply pagination using offset/limit (not page/pageSize)
        var pagedResults = await queryBuilder
            .OrderBy(emp => emp.FullName)
            .Skip(queryParams.Offset)
            .Take(queryParams.Limit)
            .ToListAsync(cancellationToken);

        return pagedResults;
    }

    /// <summary>
    /// Counts total matching employees for pagination metadata.
    /// </summary>
    public async Task<int> CountAsync(
        EmployeeQueryParams queryParams,
        CancellationToken cancellationToken)
    {
        var queryBuilder = _databaseContext.Employees.AsQueryable();

        if (queryParams.DepartmentId > 0)
        {
            queryBuilder = queryBuilder.Where(emp => emp.DepartmentId == queryParams.DepartmentId);
        }

        if (queryParams.ActiveOnlyIndicator)
        {
            queryBuilder = queryBuilder.Where(emp => emp.ActiveIndicator);
        }

        return await queryBuilder.CountAsync(cancellationToken);
    }
}

// Supporting interfaces and classes
public interface IExampleEmployeeRepository
{
    Task<EmployeeEntity?> GetByIdAsync(int employeeId, CancellationToken cancellationToken);
    Task<IReadOnlyList<EmployeeEntity>> GetAllAsync(EmployeeQueryParams queryParams, CancellationToken cancellationToken);
    Task<int> CountAsync(EmployeeQueryParams queryParams, CancellationToken cancellationToken);
}

public class EmployeeQueryParams
{
    public int DepartmentId { get; set; }
    public bool ActiveOnlyIndicator { get; set; }
    public int Offset { get; set; }
    public int Limit { get; set; } = 20;
}

public class EmployeeEntity
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public int DepartmentId { get; set; }
    public bool ActiveIndicator { get; set; }
}

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<EmployeeEntity> Employees => Set<EmployeeEntity>();
}
