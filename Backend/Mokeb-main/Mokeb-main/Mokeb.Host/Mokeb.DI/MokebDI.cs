using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mokeb.Application.CommandHandler.CaravanCommands.CaravanPrincipalSignIn;
using Mokeb.Application.Contracts;
using Mokeb.Application.Services;
using Mokeb.Common.Utils;
using Mokeb.Infrastructure.Context;
using Mokeb.Infrastructure.Repositories;
using Mokeb.Infrastructure.unitOfWork;
using StackExchange.Redis;

namespace Mokeb.DI
{
    public static class MokebDI
    {
        public static IServiceCollection MokebDependencyInjection(this IServiceCollection service, IConfiguration configuration)
        {
            service.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var redisConfiguration = configuration.GetConnectionString("Redis");
                return ConnectionMultiplexer.Connect(redisConfiguration);
            });

            service.AddDbContext<MokebDbContext>(opt =>
            {
                opt.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            service.Configure<JwsInformationOptions>(configuration.GetSection("Jws"));

            service.AddSingleton<IRedisCache, RedisCache>();
            service.AddScoped<IJwsService, JwsService>();
            service.AddScoped<IIndividualRepository, IndividualRepository>();
            service.AddScoped<ICaravanPrincipalRepository, CaravanRepository>();
            service.AddScoped<IAdminRepository, AdminRepository>();
            service.AddScoped<IUnitOfWork, UnitOfWork>();
            service.AddScoped<IRoomRepository, RoomRepository>();
            service.AddScoped<IFAQRepository, FAQRepository>();
            service.AddScoped<IOfficialsRepository, OffiacialsRepository>();
            service.AddScoped<IPdfCreator, PdfCreator>();

            service.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(CaravanPrincipalSignInCommand).Assembly);
            });

            return service;
        }
    }
}
