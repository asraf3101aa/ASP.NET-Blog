using MediatR;
using Bislerium.Domain.Enums;

namespace Bislerium.Application.Features.Blogs.Commands.ReactToComment
{
    public record ReactToCommentCommand(int CommentId, string UserId, ReactionType ReactionType) : IRequest;
}
