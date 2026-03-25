using MediatR;
using Bislerium.Domain.Enums;

namespace Bislerium.Application.Features.Blogs.Commands.ReactToBlog
{
    public record ReactToBlogCommand(int BlogId, string UserId, ReactionType ReactionType) : IRequest;
}
