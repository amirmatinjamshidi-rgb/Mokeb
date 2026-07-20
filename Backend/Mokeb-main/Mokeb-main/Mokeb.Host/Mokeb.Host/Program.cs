using Mokeb.DI;
using Mokeb.Infrastructure;
using Mokeb.Infrastructure.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // ۱. تنظیم پیش‌فرض برای تمام پورت‌ها (فقط HTTP1)
    serverOptions.ConfigureEndpointDefaults(listenOptions =>
    {
        listenOptions.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1;
    });
}).UseKestrel();

builder.Services.AddControllers();
builder.Services.MokebDependencyInjection(builder.Configuration);
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true));
});
var app = builder.Build();

// Ensure default admin (username: admin, password: admin) exists.
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<MokebDbContext>();
        await AdminSeed.EnsureAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[AdminSeed] Skipped: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.

app.UseCors();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI();

app.Run();
