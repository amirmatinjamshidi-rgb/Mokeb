using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Mokeb.Application.Contracts;
using Mokeb.Common.Utils;
using Mokeb.Domain.Model.Base;
using Mokeb.Domain.Model.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Mokeb.Application.Services
{
    public class JwsService : IJwsService
    {

        private readonly JwsInformationOptions _jwsOptions;
        private readonly IRedisCache _redisCache;

        public JwsService(IOptions<JwsInformationOptions> jwsOptions, IRedisCache redisCache)
        {
            _jwsOptions = jwsOptions.Value;
            _redisCache = redisCache;
        }

        public async Task<string> CreateJwsToken(Principal individualPrincipal, CancellationToken cancellationToken)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwsOptions.Key));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Name , individualPrincipal.IdentityInformation.Username),
                new Claim(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, individualPrincipal.Id.ToString()),
                new Claim(ClaimTypes.Role , individualPrincipal.IdentityInformation.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwsOptions.Issuer,
                audience: _jwsOptions.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(int.Parse(_jwsOptions.Expires)),
                signingCredentials: signingCredentials
                );


            var jwsToken = new JwtSecurityTokenHandler().WriteToken(token);
            await _redisCache.AddToRedis($"Jws:{individualPrincipal.Id}:{jwsToken}", "", TimeSpan.FromHours(int.Parse(_jwsOptions.Expires)));

            return jwsToken;

        }


        public async Task DeleteJwsTokenAsync(Guid Id, string jwsToken)
        {
            await _redisCache.RemoveFromRedis($"Jws:{Id}:{jwsToken}");
        }
        public async Task<string> CreateJwsTokenForAdmin(Admin admin, CancellationToken cancellationToken)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwsOptions.Key));
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Name , admin.Username),
                new Claim(JwtRegisteredClaimNames.Jti , Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                new Claim(ClaimTypes.Role , admin.Role.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _jwsOptions.Issuer,
                audience: _jwsOptions.Audience,
                claims: claims,
                expires: DateTime.Now.AddHours(int.Parse(_jwsOptions.Expires)),
                signingCredentials: signingCredentials
                );


            var jwsToken = new JwtSecurityTokenHandler().WriteToken(token);
            await _redisCache.AddToRedis($"Jws:{admin.Id}:{jwsToken}", "", TimeSpan.FromHours(int.Parse(_jwsOptions.Expires)));

            return jwsToken;
        }
    }
}
