namespace Api.Middleware;

/// <summary>
/// Middleware that generates and propagates a unique transaction identifier for each request.
/// The transaction ID is added to response headers and stored in HttpContext for logging.
/// </summary>
public sealed class TransactionIdMiddleware
{
    private readonly RequestDelegate _nextHandler;
    private const string TransactionHeaderName = "X-Transaction-Id";
    private const string ContextItemKey = "TransactionId";

    /// <summary>
    /// Creates a new instance of the transaction ID middleware.
    /// </summary>
    /// <param name="nextHandler">The next middleware in the request pipeline.</param>
    public TransactionIdMiddleware(RequestDelegate nextHandler)
    {
        _nextHandler = nextHandler;
    }

    /// <summary>
    /// Processes the request by generating a transaction ID and adding it to the response.
    /// </summary>
    /// <param name="httpContext">The HTTP context for the current request.</param>
    public async Task InvokeAsync(HttpContext httpContext)
    {
        // Generate a new GUID for this request's transaction tracking
        var generatedTransactionId = Guid.NewGuid().ToString("D");

        // Store in HttpContext.Items for access by controllers and services
        httpContext.Items[ContextItemKey] = generatedTransactionId;

        // Add to response headers before the response starts
        httpContext.Response.OnStarting(() =>
        {
            httpContext.Response.Headers[TransactionHeaderName] = generatedTransactionId;
            return Task.CompletedTask;
        });

        // Continue processing the request pipeline
        await _nextHandler(httpContext);
    }
}

/// <summary>
/// Extension methods for registering TransactionIdMiddleware in the application pipeline.
/// </summary>
public static class TransactionIdMiddlewareExtensions
{
    /// <summary>
    /// Adds the transaction ID middleware to the application request pipeline.
    /// </summary>
    /// <param name="applicationBuilder">The application builder instance.</param>
    /// <returns>The application builder for method chaining.</returns>
    public static IApplicationBuilder UseTransactionId(this IApplicationBuilder applicationBuilder)
    {
        return applicationBuilder.UseMiddleware<TransactionIdMiddleware>();
    }
}
