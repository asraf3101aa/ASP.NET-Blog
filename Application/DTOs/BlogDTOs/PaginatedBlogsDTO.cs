namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class PaginationMetaData
    {
        public string SortBy { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public bool HasPreviousPage { get; set; }
        public bool HasNextPage { get; set; }
    }
    public class PaginatedBlogsDTO
    {
        public PaginationMetaData PaginationMetaData { get; set; }
        public IEnumerable<BlogResponseDTO> Blogs { get; set; }
    }
}
