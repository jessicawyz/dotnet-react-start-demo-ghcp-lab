using Api.DTOs.Common;
using Api.DTOs.Health;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Health monitoring endpoint for load balancers and orchestrators.
/// Provides status information about the API service.
/// </summary>
[Route("v1/[controller]")]
[ApiController]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    private readonly IWebHostEnvironment _hostEnvironment;

    /// <summary>
    /// Initializes a new instance of the health controller.
    /// </summary>
    /// <param name="hostEnvironment">Web host environment for runtime information.</param>
    public HealthController(IWebHostEnvironment hostEnvironment)
    {
        _hostEnvironment = hostEnvironment;
    }

    /// <summary>
    /// Performs a health check and returns the current API status.
    /// Used by load balancers, container orchestrators, and monitoring systems.
    /// </summary>
    /// <returns>Health status wrapped in standard envelope format.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ItemResponseDto<HealthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status500InternalServerError)]
    public ActionResult<ItemResponseDto<HealthResponseDto>> GetHealth()
    {
        var currentTimestamp = DateTime.UtcNow;
        var correlationId = HttpContext.Items["TransactionId"]?.ToString() ?? Guid.NewGuid().ToString();
        var assemblyVersion = typeof(HealthController).Assembly.GetName().Version?.ToString() ?? "1.0.0";

        var healthPayload = new HealthResponseDto
        {
            Status = "healthy",
            Version = assemblyVersion,
            CheckedAtDate = currentTimestamp,
            Environment = _hostEnvironment.EnvironmentName
        };

        var envelopeResponse = new ItemResponseDto<HealthResponseDto>
        {
            Item = healthPayload,
            Metadata = new MetadataDto
            {
                Timestamp = currentTimestamp,
                TransactionId = correlationId,
                TotalCount = null
            },
            Links = new LinksDto
            {
                Self = $"{Request.Scheme}://{Request.Host}{Request.PathBase}{Request.Path}",
                Next = null,
                Prev = null
            }
        };

        return Ok(envelopeResponse);
    }
}
