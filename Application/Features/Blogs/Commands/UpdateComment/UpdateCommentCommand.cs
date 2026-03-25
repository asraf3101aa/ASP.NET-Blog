using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;

namespace Bislerium.Application.Features.Blogs.Commands.UpdateComment
{
    public record UpdateCommentCommand(int CommentId, string UserId, CommentDTO CommentDto) : IRequest<bool>;
}
