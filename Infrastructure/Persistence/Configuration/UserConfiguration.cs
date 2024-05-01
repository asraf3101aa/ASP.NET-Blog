using Bislerium.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bislerium.Infrastructure.Persistence.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasData(
            new User
            {
                FirstName = "Blog Admin",
                Email = "asraf3101aa@gmail.com",
                UserName = "asraf3101aa@gmail.com",
                EmailConfirmed = true
            });

        }
    }
}
