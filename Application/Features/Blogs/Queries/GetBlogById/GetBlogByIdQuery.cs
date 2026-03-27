using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;

namespace Bislerium.Application.Features.Blogs.Queries.GetBlogById
{
    public record GetBlogByIdQuery(int Id) : IRequest<BlogResponseDTO?>;
}
