using Api.DTOs.Common;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

/// <summary>
/// Example controller demonstrating organization API standards.
/// Route uses v1/ prefix without /api/.
/// </summary>
[Route("v1/[controller]")]
[ApiController]
[Produces("application/json")]
public class ExampleResourceController : ControllerBase
{
    private readonly IExampleService _exampleService;

    public ExampleResourceController(IExampleService exampleService)
    {
        _exampleService = exampleService;
    }

    /// <summary>
    /// Retrieves all resources with pagination support.
    /// </summary>
    /// <param name="offset">Number of items to skip (default: 0).</param>
    /// <param name="limit">Maximum items to return (default: 20, max: 100).</param>
    /// <param name="cancellationToken">Cancellation token for the operation.</param>
    /// <returns>Collection of resources wrapped in envelope.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(CollectionResponseDto<ExampleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CollectionResponseDto<ExampleDto>>> GetAllAsync(
        [FromQuery] int offset = 0,
        [FromQuery] int limit = 20,
        CancellationToken cancellationToken = default)
    {
        var queryParams = new ExampleQuery { Offset = offset, Limit = limit };
        var envelopeResult = await _exampleService.GetAllAsync(queryParams, cancellationToken);
        return Ok(envelopeResult);
    }

    /// <summary>
    /// Retrieves a single resource by unique identifier.
    /// </summary>
    /// <param name="resourceId">The unique identifier of the resource.</param>
    /// <param name="cancellationToken">Cancellation token for the operation.</param>
    /// <returns>Single resource wrapped in envelope or 404 if not found.</returns>
    [HttpGet("{resourceId:int}")]
    [ProducesResponseType(typeof(ItemResponseDto<ExampleDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponseDto), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemResponseDto<ExampleDto>>> GetByIdAsync(
        int resourceId,
        CancellationToken cancellationToken)
    {
        var envelopeResult = await _exampleService.GetByIdAsync(resourceId, cancellationToken);
        
        if (envelopeResult is null)
        {
            return NotFound(new ErrorResponseDto
            {
                Code = "ORG-NTF-001",
                Message = $"Resource with ID {resourceId} was not found"
            });
        }
        
        return Ok(envelopeResult);
    }
}

// Placeholder interfaces and classes for compilation
public interface IExampleService
{
    Task<CollectionResponseDto<ExampleDto>> GetAllAsync(ExampleQuery query, CancellationToken cancellationToken);
    Task<ItemResponseDto<ExampleDto>?> GetByIdAsync(int id, CancellationToken cancellationToken);
}

public class ExampleQuery
{
    public int Offset { get; set; }
    public int Limit { get; set; }
}

public class ExampleDto
{
    public int ExampleId { get; set; }
}
