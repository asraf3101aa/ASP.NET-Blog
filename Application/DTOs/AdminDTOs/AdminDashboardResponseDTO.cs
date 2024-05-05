using Bislerium.Domain.Entities;

namespace Bislerium.Application.DTOs.AdminDTOs
{
    public class BlogStatsDTO
    {
        public int BlogCount { get; set; }
        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int CommentCount { get; set; }
    }
    public class PopularBlogger : User
    {
        public int TotalBlogs { get; set; }
        public int TotalUpvote { get; set; }
        public int TotalDownvote { get; set; }
        public int TotalComments { get; set; }
        public int TotalPopularityScore { get; set; }
    }
}
