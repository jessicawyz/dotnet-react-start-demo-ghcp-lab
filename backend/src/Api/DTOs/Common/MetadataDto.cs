using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// Contains request/response metadata for API envelope pattern.
/// Provides correlation, timing, and pagination information.
/// </summary>
public sealed class MetadataDto
{
    /// <summary>
    /// UTC timestamp when the response was generated.
    /// </summary>
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }

    /// <summary>
    /// Unique correlation identifier for request tracing across services.
    /// </summary>
    [JsonPropertyName("transactionId")]
    public required string TransactionId { get; set; }

    /// <summary>
    /// Total number of items available (used in collection responses for pagination).
    /// Null for single item responses.
    /// </summary>
    [JsonPropertyName("totalCount")]
    public int? TotalCount { get; set; }
}
