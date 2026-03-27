namespace Bislerium.Application.DTOs.AdminDTOs
{
    public class BlogStatsDTO
    {
        public int BlogCount { get; set; }
        public int UpvoteCount { get; set; }
        public int DownvoteCount { get; set; }
        public int CommentCount { get; set; }
    }

    public class PopularBloggerDTO
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TotalBlogs { get; set; }
        public int TotalUpvote { get; set; }
        public int TotalDownvote { get; set; }
        public int TotalComments { get; set; }
        public int TotalPopularityScore { get; set; }
    }

    public class AdminDashboardResponseDTO
    {
        public string? Duration { get; set; }
        public int? Month { get; set; }
        public BlogStatsDTO BlogStats { get; set; } = null!;
        public List<PopularBloggerDTO> PopularBloggers { get; set; } = new();
        public List<Bislerium.Application.DTOs.BlogDTOs.BlogResponseDTO> PopularBlogs { get; set; } = new();
    }
}
