using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Features.Blogs.Commands.UpdateBlog
{
    public record UpdateBlogCommand(int Id, BlogDTO BlogDto, User Author, List<BlogImage> Images) : IRequest<BlogResponseDTO?>;
}
