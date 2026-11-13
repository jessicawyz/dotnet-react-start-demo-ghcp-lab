using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Api.Tests.Integration;

/// <summary>
/// Custom web application factory for integration testing.
/// Configures the test server with testing environment settings.
/// Future: Add in-memory database configuration when DbContext is implemented.
/// </summary>
public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder webHostBuilder)
    {
        webHostBuilder.UseEnvironment("Testing");

        webHostBuilder.ConfigureServices(serviceCollection =>
        {
            // Future: Replace real DbContext with InMemory provider
            // var existingDbDescriptor = serviceCollection.SingleOrDefault(
            //     descriptor => descriptor.ServiceType == typeof(DbContextOptions<AppDbContext>));
            // if (existingDbDescriptor != null)
            //     serviceCollection.Remove(existingDbDescriptor);
            //
            // serviceCollection.AddDbContext<AppDbContext>(dbOptions =>
            //     dbOptions.UseInMemoryDatabase($"TestDb_{Guid.NewGuid()}"));
        });
    }
}
