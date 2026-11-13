using System.Net;
using System.Net.Http.Json;
using Api.DTOs.Common;
using Api.DTOs.Health;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Api.Tests.Controllers;

/// <summary>
/// Integration tests for the HealthController endpoint.
/// Validates health check responses follow organization envelope standards.
/// </summary>
public sealed class HealthControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _testClient;

    public HealthControllerTests(WebApplicationFactory<Program> applicationFactory)
    {
        _testClient = applicationFactory.CreateClient();
    }

    #region GetHealthAsync Tests

    [Fact]
    public async Task GetHealthAsync_WhenCalled_ReturnsOkStatusCode()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";

        // Act
        var httpResponse = await _testClient.GetAsync(healthEndpointPath);

        // Assert
        Assert.Equal(HttpStatusCode.OK, httpResponse.StatusCode);
    }

    [Fact]
    public async Task GetHealthAsync_WhenCalled_ReturnsEnvelopeWithHealthyStatus()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";

        // Act
        var envelopeResponse = await _testClient.GetFromJsonAsync<ItemResponseDto<HealthResponseDto>>(healthEndpointPath);

        // Assert
        Assert.NotNull(envelopeResponse);
        Assert.NotNull(envelopeResponse.Item);
        Assert.Equal("healthy", envelopeResponse.Item.Status);
    }

    [Fact]
    public async Task GetHealthAsync_WhenCalled_ReturnsMetadataWithTransactionId()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";

        // Act
        var envelopeResponse = await _testClient.GetFromJsonAsync<ItemResponseDto<HealthResponseDto>>(healthEndpointPath);

        // Assert
        Assert.NotNull(envelopeResponse);
        Assert.NotNull(envelopeResponse.Metadata);
        Assert.False(string.IsNullOrWhiteSpace(envelopeResponse.Metadata.TransactionId));
    }

    [Fact]
    public async Task GetHealthAsync_WhenCalled_ReturnsLinksWithSelfUrl()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";

        // Act
        var envelopeResponse = await _testClient.GetFromJsonAsync<ItemResponseDto<HealthResponseDto>>(healthEndpointPath);

        // Assert
        Assert.NotNull(envelopeResponse);
        Assert.NotNull(envelopeResponse.Links);
        Assert.Contains("/v1/health", envelopeResponse.Links.Self);
    }

    [Fact]
    public async Task GetHealthAsync_WhenCalled_IncludesTransactionIdHeader()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";
        var transactionHeaderName = "X-Transaction-Id";

        // Act
        var httpResponse = await _testClient.GetAsync(healthEndpointPath);

        // Assert
        Assert.True(httpResponse.Headers.Contains(transactionHeaderName));
        var headerValues = httpResponse.Headers.GetValues(transactionHeaderName).ToList();
        Assert.Single(headerValues);
        Assert.True(Guid.TryParse(headerValues[0], out _));
    }

    [Fact]
    public async Task GetHealthAsync_WhenCalled_ReturnsVersionInformation()
    {
        // Arrange
        var healthEndpointPath = "/v1/health";

        // Act
        var envelopeResponse = await _testClient.GetFromJsonAsync<ItemResponseDto<HealthResponseDto>>(healthEndpointPath);

        // Assert
        Assert.NotNull(envelopeResponse);
        Assert.NotNull(envelopeResponse.Item);
        Assert.False(string.IsNullOrWhiteSpace(envelopeResponse.Item.Version));
    }

    #endregion
}
