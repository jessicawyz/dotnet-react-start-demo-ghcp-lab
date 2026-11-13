using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// HATEOAS links for API resource navigation.
/// Enables clients to discover related resources and pagination endpoints.
/// </summary>
public sealed class LinksDto
{
    /// <summary>
    /// Canonical URL of the current resource or collection.
    /// </summary>
    [JsonPropertyName("self")]
    public required string Self { get; set; }

    /// <summary>
    /// URL for the next page of results (null if on last page or single item).
    /// </summary>
    [JsonPropertyName("next")]
    public string? Next { get; set; }

    /// <summary>
    /// URL for the previous page of results (null if on first page or single item).
    /// </summary>
    [JsonPropertyName("prev")]
    public string? Prev { get; set; }
}
