using Bislerium.Domain.Entities;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class PopularBlogger : User
    {
        public int TotalBlogs { get; set; }
        public int TotalUpvote { get; set; }
        public int TotalDownvote { get; set; }
        public int TotalComments { get; set; }
        public int TotalPopularityScore { get; set; }
    }
}
