using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// Envelope wrapper for single item API responses.
/// All API endpoints returning a single resource use this wrapper.
/// </summary>
/// <typeparam name="T">The type of the wrapped item.</typeparam>
public sealed class ItemResponseDto<T>
{
    /// <summary>
    /// The primary data payload containing the requested resource.
    /// </summary>
    [JsonPropertyName("item")]
    public required T Item { get; set; }

    /// <summary>
    /// Request metadata including timing and correlation information.
    /// </summary>
    [JsonPropertyName("metadata")]
    public required MetadataDto Metadata { get; set; }

    /// <summary>
    /// HATEOAS links for resource navigation.
    /// </summary>
    [JsonPropertyName("links")]
    public required LinksDto Links { get; set; }
}
