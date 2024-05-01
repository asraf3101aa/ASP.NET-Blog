using Bislerium.Domain.Entities;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class PaginationMetaData
    {
        public string SortBy { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
    }
    public class PaginatedBlogsDTO
    {
        public PaginationMetaData PaginationMetaData { get; set; }
        public ICollection<Blog> Blogs { get; set; }
    }
}
