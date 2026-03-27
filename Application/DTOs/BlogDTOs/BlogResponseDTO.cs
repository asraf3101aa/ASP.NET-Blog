using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class BlogResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string CategoryName { get; set; }
        public List<BlogImageResponseDTO> Images { get; set; }
        public List<CommentResponseDTO> Comments { get; set; }
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
        public int CommentCount { get; set; }
        public int PopularityScore { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class BlogImageResponseDTO
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public BlogImageType ImageType { get; set; }
    }

    public class CommentResponseDTO
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public DateTime CreatedAt { get; set; }
        public int Upvotes { get; set; }
        public int Downvotes { get; set; }
    }
}
