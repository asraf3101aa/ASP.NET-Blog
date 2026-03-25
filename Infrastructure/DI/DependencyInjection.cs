using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.Email;
using Bislerium.Application.Services;
using Bislerium.Domain.Entities;
using Bislerium.Infrastructure.Persistence.Context;
using Bislerium.Infrastructure.Services;
using Bislerium.Infrastructure.Identity;
using Bislerium.Infrastructure.Communication.Email;
using Bislerium.Infrastructure.Communication.RabbitMQ;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

namespace Bislerium.Infrastructure.DI;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services,
       IConfiguration configuration)
    {
        var dbUrl = configuration["DATABASE_URL"] ?? configuration.GetConnectionString("DATABASE_URL");

        if (string.IsNullOrEmpty(dbUrl))
        {
            throw new ArgumentNullException("DATABASE_URL", "The DATABASE_URL configuration is missing.");
        }

        string connectionString;
        if (dbUrl.Contains("://"))
        {
            // Parse postgres://user:pass@host:port/database
            var uri = new Uri(dbUrl);
            var userInfo = uri.UserInfo.Split(':');
            connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.Trim('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Prefer;Trust Server Certificate=True;";
        }
        else
        {
            connectionString = dbUrl;
        }

        services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(connectionString));

        services.AddIdentity<User, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = false)
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Remove below block later
        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        });

        services.Configure<EmailSettings>(opt =>
        {
            opt.From = configuration["EmailSettings:From"] ?? string.Empty;
            opt.SmtpServer = configuration["EmailSettings:SmtpServer"] ?? string.Empty;
            opt.UserName = configuration["EmailSettings:UserName"] ?? string.Empty;
            opt.Password = configuration["EmailSettings:Password"] ?? string.Empty;
            opt.Port = int.TryParse(configuration["EmailSettings:Port"], out int port) ? port : 587;
        });

        services.Configure<Bislerium.Infrastructure.Common.RabbitMQSettings>(opt =>
        {
            opt.HostName = configuration["RabbitMQSettings:HostName"] ?? "localhost";
            opt.UserName = configuration["RabbitMQSettings:UserName"] ?? "guest";
            opt.Password = configuration["RabbitMQSettings:Password"] ?? "guest";
            opt.QueueName = configuration["RabbitMQSettings:QueueName"] ?? "EmailQueue";
        });

        services.AddTransient<IEmailService, EmailService>();
        services.AddTransient<IRabbitMQBus, RabbitMQBus>();
        services.AddHostedService<EmailBackgroundWorker>();
        services.AddTransient<IAccountService, AccountService>();
        services.AddTransient<IBlogService, BlogService>();
        services.AddTransient<IFileService, FileService>();
        services.AddTransient<IJWTTokenService, JWTTokenService>();
        services.AddTransient<IResponseService, ResponseService>();

        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var responseService = context.HttpContext.RequestServices.GetRequiredService<IResponseService>();
                var errors = context.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => JsonNamingPolicy.CamelCase.ConvertName(kvp.Key),
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                return new BadRequestObjectResult(responseService.ValidationFailResponse(errors));
            };
        });

        return services;
    }

    public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
    {
        var secretKey = configuration["JWTConfig:SecretKey"];
        var issuer = configuration["JWTConfig:Issuer"];
        var audience = configuration["JWTConfig:Audience"];

        services.AddAuthentication(opt =>
        {
            opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.MapInboundClaims = false;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/notifications")))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        });
    }
}
