using System.Security.Claims;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Interfaces
{
    public interface IJWTTokenService
    {
        Task<string> GenerateTokenAsync(User user);
        string GenerateRefreshToken(User user);
        ClaimsPrincipal? ValidateRefreshToken(string token);
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
    }
}
