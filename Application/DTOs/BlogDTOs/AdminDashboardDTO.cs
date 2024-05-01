using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class AdminDashboardDTO
    {
        public BlogStats? BlogStats { get; set; }
        public ICollection<Blog>? PopularBlogs { get; set; }
        public ICollection<PopularBlogger>? PopularBlogger { get; set; }

    }
}
