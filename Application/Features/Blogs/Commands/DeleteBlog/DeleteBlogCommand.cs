using MediatR;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Features.Blogs.Commands.DeleteBlog
{
    public record DeleteBlogCommand(int Id, User Author) : IRequest<bool>;
}
