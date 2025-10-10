//Analytics/GetVisitorDetail.cs
using Microsoft.EntityFrameworkCore;
using PortfolioAnalyticsAPI.Data;

namespace PortfolioAnalyticsAPI.Features.Analytics;

public static class GetVisitorDetail
{
    public static void MapEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/analytics/visitors/{visitorHash}", HandleAsync)
            .WithTags("Analytics")
            .WithName("GetVisitorDetail");
    }

    public record PageFrequency
    {
        public required string Path { get; set; }
        public int Count { get; set; }
    }

    public record VisitorDetailResponse
    {
        public required string VisitorHash { get; set; }
        public DateTime FirstVisit { get; set; }
        public DateTime LastVisit { get; set; }
        public int TotalPageViews { get; set; }
        public required List<PageFrequency> PageFrequencies { get; set; }
        public required List<PageVisit> VisitLog { get; set; }
    }

    private static async Task<IResult> HandleAsync(string visitorHash, AnalyticsDbContext dbContext)
    {
        var visits = await dbContext.PageVisits
            .AsNoTracking()
            .Where(pv => pv.VisitorHash == visitorHash)
            .OrderByDescending(pv => pv.Timestamp)
            .ToListAsync();

        if (visits.Count == 0)
        {
            return Results.NotFound();
        }

        var pageFrequencies = visits
            .GroupBy(v => v.Path)
            .Select(g => new PageFrequency { Path = g.Key, Count = g.Count() })
            .OrderByDescending(pf => pf.Count)
            .ToList();

        var response = new VisitorDetailResponse
        {
            VisitorHash = visitorHash,
            FirstVisit = visits.Min(v => v.Timestamp),
            LastVisit = visits.Max(v => v.Timestamp),
            TotalPageViews = visits.Count,
            PageFrequencies = pageFrequencies,
            VisitLog = visits
        };

        return Results.Ok(response);
    }
}