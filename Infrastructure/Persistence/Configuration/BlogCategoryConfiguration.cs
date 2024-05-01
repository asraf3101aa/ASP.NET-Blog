using Bislerium.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Bislerium.Infrastructure.Persistence.Configuration
{
    public class BlogCategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.HasData(
            new Category
            {
                Id = 1,
                Name = "Sports"
            },
            new Category
            {
                Id = 2,
                Name = "Lifestyle"
            },
            new Category
            {
                Id = 3,
                Name = "Technology"
            },
            new Category
            {
                Id = 4,
                Name = "Health"
            },
            new Category
            {
                Id = 5,
                Name = "Finance"
            },
            new Category
            {
                Id = 6,
                Name = "Other"
            });
        }
    }
}
