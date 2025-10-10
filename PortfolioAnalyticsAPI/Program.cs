using Microsoft.EntityFrameworkCore;
using PortfolioAnalyticsAPI.Data;
using PortfolioAnalyticsAPI.Features.Analytics;

var builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:5084",
                           "http://localhost:5173",
                           "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AnalyticsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors(MyAllowSpecificOrigins);

TrackVisit.MapEndpoint(app);
GetVisitorsSummary.MapEndpoint(app);
GetVisitorDetail.MapEndpoint(app);

app.Run();