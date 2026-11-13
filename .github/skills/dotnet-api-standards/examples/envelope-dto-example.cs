using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// Example envelope DTO demonstrating organization standards.
/// All properties require JsonPropertyName and XML documentation.
/// </summary>
public sealed class EnvelopeExampleDto<TPayload>
{
    /// <summary>
    /// The primary data payload for single-item responses.
    /// </summary>
    [JsonPropertyName("item")]
    public required TPayload Item { get; set; }

    /// <summary>
    /// Request correlation and timing metadata.
    /// </summary>
    [JsonPropertyName("metadata")]
    public required EnvelopeMetadataExample Metadata { get; set; }

    /// <summary>
    /// HATEOAS navigation links.
    /// </summary>
    [JsonPropertyName("links")]
    public required EnvelopeLinksExample Links { get; set; }
}

/// <summary>
/// Metadata portion of the envelope response.
/// </summary>
public sealed class EnvelopeMetadataExample
{
    /// <summary>
    /// UTC timestamp when response was generated.
    /// </summary>
    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; set; }

    /// <summary>
    /// Unique correlation ID for request tracing.
    /// </summary>
    [JsonPropertyName("transactionId")]
    public required string TransactionId { get; set; }

    /// <summary>
    /// Total available items (collections only).
    /// </summary>
    [JsonPropertyName("totalCount")]
    public int? TotalCount { get; set; }
}

/// <summary>
/// HATEOAS links for resource navigation.
/// </summary>
public sealed class EnvelopeLinksExample
{
    /// <summary>
    /// Canonical URL of current resource.
    /// </summary>
    [JsonPropertyName("self")]
    public required string Self { get; set; }

    /// <summary>
    /// Next page URL (null if last page).
    /// </summary>
    [JsonPropertyName("next")]
    public string? Next { get; set; }

    /// <summary>
    /// Previous page URL (null if first page).
    /// </summary>
    [JsonPropertyName("prev")]
    public string? Prev { get; set; }
}

/// <summary>
/// Example domain DTO with proper naming conventions.
/// Boolean properties use Indicator suffix, not is/has prefix.
/// </summary>
public sealed class EmployeeExampleDto
{
    /// <summary>
    /// Unique employee identifier.
    /// </summary>
    [JsonPropertyName("employeeId")]
    public int EmployeeId { get; set; }

    /// <summary>
    /// Employee full name.
    /// </summary>
    [JsonPropertyName("fullName")]
    public required string FullName { get; set; }

    /// <summary>
    /// Whether employee is currently active.
    /// NOTE: Uses Indicator suffix, NOT isActive.
    /// </summary>
    [JsonPropertyName("activeIndicator")]
    public bool ActiveIndicator { get; set; }

    /// <summary>
    /// Date employee was hired.
    /// NOTE: Uses Date suffix for date properties.
    /// </summary>
    [JsonPropertyName("hireDate")]
    public DateTime? HireDate { get; set; }
}
