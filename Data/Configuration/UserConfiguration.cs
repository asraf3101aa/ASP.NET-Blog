using BlogApplication.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BlogApplication.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasData(
            new User
            {
                FirstName = "Blog Admin",
                Email = "admin@example.com",
                EmailConfirmed = true
            });
        }
    }
}
