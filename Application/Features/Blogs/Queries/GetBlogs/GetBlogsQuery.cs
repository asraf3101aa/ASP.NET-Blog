using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;

namespace Bislerium.Application.Features.Blogs.Queries.GetBlogs
{
    public record GetBlogsQuery(string SortBy = "recency", int PageNumber = 1, int PageSize = 10) : IRequest<PaginatedBlogsDTO>;
}
