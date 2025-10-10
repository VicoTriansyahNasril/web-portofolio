//Data/PageVisit.cs
namespace PortfolioAnalyticsAPI.Data;

public class PageVisit
{
    public long Id { get; set; }
    public required string Path { get; set; }
    public required string VisitorHash { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}