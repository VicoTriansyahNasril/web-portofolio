//Features/Analytics/TrackVisit.cs
using Microsoft.AspNetCore.Mvc;
using PortfolioAnalyticsAPI.Data;
using System.Security.Cryptography;
using System.Text;

namespace PortfolioAnalyticsAPI.Features.Analytics;

public static class TrackVisit
{
    public static void MapEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/track", HandleAsync)
            .WithTags("Analytics")
            .WithName("TrackVisit");
    }

    public class TrackRequest
    {
        public string Path { get; set; } = string.Empty;
    }

    private static async Task<IResult> HandleAsync(
        [FromBody] TrackRequest request,
        HttpContext httpContext,
        AnalyticsDbContext dbContext)
    {
        var ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = httpContext.Request.Headers["User-Agent"].ToString();

        if (string.IsNullOrEmpty(ipAddress) || string.IsNullOrEmpty(userAgent))
        {
            return Results.BadRequest("Missing required headers.");
        }

        var newVisit = new PageVisit
        {
            Path = request.Path,
            VisitorHash = CreateVisitorHash(ipAddress, userAgent)
        };

        dbContext.PageVisits.Add(newVisit);
        await dbContext.SaveChangesAsync();

        return Results.Ok();
    }

    private static string CreateVisitorHash(string ipAddress, string userAgent)
    {
        const string salt = "your-very-secret-static-salt-for-hashing-visitors";
        var rawIdentifier = $"{ipAddress}-{userAgent}-{salt}";

        using var sha256 = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(rawIdentifier);
        var hashBytes = sha256.ComputeHash(bytes);

        return Convert.ToBase64String(hashBytes);
    }
}