using MediatR;

namespace Bislerium.Application.Features.Blogs.Commands.DeleteComment
{
    public record DeleteCommentCommand(int CommentId, string UserId) : IRequest<bool>;
}
