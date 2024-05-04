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
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            string adminRoleName = "Admin";
            string email = configuration["AdminUser:Email"];
            string password = configuration["AdminUser:Password"];

            var admins = await userManager.GetUsersInRoleAsync(adminRoleName);
            if (!admins.Any())
            {
                // No admin user exists, create a new admin user
                var user = new User { UserName = email, Email = email, EmailConfirmed = true, FirstName = "Admin", LastName = "First" };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, adminRoleName);
                }
            }
        }
    }
}
