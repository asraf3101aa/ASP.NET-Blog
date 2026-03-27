using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;

namespace Bislerium.Application.Features.Blogs.Queries.GetAuthorBlogs
{
    public record GetAuthorBlogsQuery(string AuthorId, int PageNumber = 1, int PageSize = 10) : IRequest<PaginatedBlogsDTO>;
}
