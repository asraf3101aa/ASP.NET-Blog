using MediatR;
using Bislerium.Application.DTOs.BlogDTOs;

namespace Bislerium.Application.Features.Blogs.Commands.AddComment
{
    public record AddCommentCommand(int BlogId, string UserId, CommentDTO CommentDto) : IRequest;
}
