using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Bislerium.Infrastructure.Persistence.Configuration
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            string email = configuration["AdminUser:Email"];
            string password = configuration["AdminUser:Password"];

            if (userManager.Users.All(u => u.Email != email))
            {
                var user = new User { UserName = email, Email = email, EmailConfirmed = true, FirstName = "Admin", LastName = "First" };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                    await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
}