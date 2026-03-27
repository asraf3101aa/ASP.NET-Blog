using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Features.Blogs.Commands.CreateBlog
{
    public record CreateBlogCommand(BlogDTO BlogDto, User Author, List<BlogImage> Images) : IRequest<BlogResponseDTO>;
}
