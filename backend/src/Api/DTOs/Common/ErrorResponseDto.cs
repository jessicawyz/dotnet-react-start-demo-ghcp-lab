using System.Text.Json.Serialization;

namespace Api.DTOs.Common;

/// <summary>
/// Standard error response format for API failures.
/// Provides structured error information for client consumption.
/// </summary>
public sealed class ErrorResponseDto
{
    /// <summary>
    /// Organization-specific error code in format "ORG-XXX-YYY".
    /// Examples: ORG-VAL-001 (validation), ORG-NTF-001 (not found).
    /// </summary>
    [JsonPropertyName("code")]
    public required string Code { get; set; }

    /// <summary>
    /// Human-readable error description for debugging purposes.
    /// </summary>
    [JsonPropertyName("message")]
    public required string Message { get; set; }

    /// <summary>
    /// Optional collection of field-level validation errors.
    /// </summary>
    [JsonPropertyName("details")]
    public IEnumerable<ErrorDetailDto>? Details { get; set; }
}

/// <summary>
/// Individual field-level error detail for validation failures.
/// </summary>
public sealed class ErrorDetailDto
{
    /// <summary>
    /// Name of the field that caused the validation error (null for general errors).
    /// </summary>
    [JsonPropertyName("field")]
    public string? Field { get; set; }

    /// <summary>
    /// Description of the validation failure for this field.
    /// </summary>
    [JsonPropertyName("message")]
    public required string Message { get; set; }
}
