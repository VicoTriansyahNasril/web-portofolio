//Features/Analytics/GetVisitorsSummary.cs
using Microsoft.EntityFrameworkCore;
using PortfolioAnalyticsAPI.Data;

namespace PortfolioAnalyticsAPI.Features.Analytics;

public static class GetVisitorsSummary
{
    public static void MapEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/analytics/visitors", HandleAsync)
            .WithTags("Analytics")
            .WithName("GetVisitorsSummary");
    }

    public record VisitorSummaryResponse
    {
        public required string VisitorHash { get; set; }
        public int VisitorNumber { get; set; }
        public DateTime FirstVisit { get; set; }
        public DateTime LastVisit { get; set; }
        public int TotalPageViews { get; set; }
    }

    private static async Task<IResult> HandleAsync(AnalyticsDbContext dbContext)
    {
        var rawSummaries = await dbContext.PageVisits
            .AsNoTracking()
            .GroupBy(pv => pv.VisitorHash)
            .Select(g => new
            {
                VisitorHash = g.Key,
                FirstVisit = g.Min(pv => pv.Timestamp),
                LastVisit = g.Max(pv => pv.Timestamp),
                TotalPageViews = g.Count()
            })
            .ToListAsync();

        var numberedSummaries = rawSummaries
            .OrderBy(s => s.FirstVisit)
            .Select((s, index) => new VisitorSummaryResponse
            {
                VisitorHash = s.VisitorHash,
                VisitorNumber = index + 1,
                FirstVisit = s.FirstVisit,
                LastVisit = s.LastVisit,
                TotalPageViews = s.TotalPageViews
            })
            .ToList();

        var finalResponse = numberedSummaries
            .OrderByDescending(s => s.LastVisit)
            .ToList();

        return Results.Ok(finalResponse);
    }
}