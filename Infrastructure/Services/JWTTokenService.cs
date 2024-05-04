using Bislerium.Application.Common.Interfaces;
using Bislerium.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Bislerium.Infrastructure.Services
{
    public class JWTTokenService : IJWTTokenService
    {
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;
        private readonly IAccountService _accountService;

        public JWTTokenService(IConfiguration configuration, IAccountService accountService)
        {
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JWTConfig");
            _accountService = accountService;
        }

        public async Task<string> GenerateTokenAsync(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var roles = await _accountService.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTConfig:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var tokenLifetime = int.Parse(_configuration["JWTConfig:LifeTime"] ); // Add this line

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["JWTConfig:Issuer"],
                audience: _configuration["JWTConfig:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(tokenLifetime),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
