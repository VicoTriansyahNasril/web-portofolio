//Data/AnalyticsDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace PortfolioAnalyticsAPI.Data;

public class AnalyticsDbContext : DbContext
{
    public AnalyticsDbContext(DbContextOptions<AnalyticsDbContext> options) : base(options)
    {
    }

    public DbSet<PageVisit> PageVisits { get; set; }
}