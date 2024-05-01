using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bislerium.Infrastructure.Persistence.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
    {
        public void Configure(EntityTypeBuilder<IdentityRole> builder)
        {
            builder.HasData(
            new IdentityRole
            {
                Name = "Blogger",
                NormalizedName = "BLOGGER"
            },
            new IdentityRole
            {
                Name = "Admin",
                NormalizedName = "ADMIN"
            });
        }
    }
}
