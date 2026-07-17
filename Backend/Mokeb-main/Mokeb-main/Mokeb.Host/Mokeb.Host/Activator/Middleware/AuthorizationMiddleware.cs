using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Mokeb.Application.Contracts;
using Mokeb.Common.Utils;
using Mokeb.Host.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Mokeb.Host.Activator.Middleware
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRedisCache _redis;
        private readonly JwsInformationOptions _jwsOptions;
        public AuthorizationMiddleware(RequestDelegate next, IRedisCache redis, IOptions<JwsInformationOptions> jwsOptions)
        {
            _next = next;
            _redis = redis;
            _jwsOptions = jwsOptions.Value;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].First()?.Split(" ").Last();


            if (string.IsNullOrWhiteSpace(token))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("You Are Not Logged In");
                return;
            }

            try
            {
                var principal = await ValidateJwsToken(token!);
                context.User = principal;
                await _next(context);
            }
            catch
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Your Jws is Expired");
            }
        }



        #region Private Methods
        private async Task<ClaimsPrincipal> ValidateJwsToken(string token)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwsOptions.Key));
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = _jwsOptions.Issuer,
                ValidAudience = _jwsOptions.Audience,
                IssuerSigningKey = key
            }, out _);

            await ValidateJwsInRedis(token, principal);
            return principal;


        }

        private async Task ValidateJwsInRedis(string token, ClaimsPrincipal principal)
        {
            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var redisKey = $"Jws:{userId}:{token}";
            var existance = await _redis.CheckKeyExistanceInRedis(redisKey);
            if (!existance)
                throw new TokenNotFoundException();

        }
        #endregion

    }
}
