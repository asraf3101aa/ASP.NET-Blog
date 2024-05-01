
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IJWTTokenService
    {
        public Task<string> GenerateTokenAsync(User user);

    }
}
