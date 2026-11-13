using System.Text.Json.Serialization;

namespace Api.DTOs.Health;

/// <summary>
/// Response payload for the health check endpoint.
/// Contains application status and version information.
/// </summary>
public sealed class HealthResponseDto
{
    /// <summary>
    /// Current operational status of the API service.
    /// Values: "healthy", "degraded", "unhealthy"
    /// </summary>
    [JsonPropertyName("status")]
    public required string Status { get; set; }

    /// <summary>
    /// Application version from assembly metadata.
    /// </summary>
    [JsonPropertyName("version")]
    public required string Version { get; set; }

    /// <summary>
    /// UTC timestamp when the health check was performed.
    /// </summary>
    [JsonPropertyName("checkedAtDate")]
    public DateTime CheckedAtDate { get; set; }

    /// <summary>
    /// Runtime environment identifier (Development, Staging, Production).
    /// </summary>
    [JsonPropertyName("environment")]
    public required string Environment { get; set; }
}
