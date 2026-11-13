using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// Envelope wrapper for collection API responses.
/// All API endpoints returning multiple resources use this wrapper.
/// </summary>
/// <typeparam name="T">The type of items in the collection.</typeparam>
public sealed class CollectionResponseDto<T>
{
    /// <summary>
    /// The array of resources matching the request criteria.
    /// </summary>
    [JsonPropertyName("items")]
    public required IEnumerable<T> Items { get; set; }

    /// <summary>
    /// Request metadata including pagination and correlation information.
    /// </summary>
    [JsonPropertyName("metadata")]
    public required MetadataDto Metadata { get; set; }

    /// <summary>
    /// HATEOAS links for collection navigation and pagination.
    /// </summary>
    [JsonPropertyName("links")]
    public required LinksDto Links { get; set; }
}
