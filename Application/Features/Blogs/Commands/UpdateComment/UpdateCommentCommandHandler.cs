using Bislerium.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.UpdateComment
{
    public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCommentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == request.CommentId, cancellationToken);
            if (comment == null || comment.UserId != request.UserId)
                return false;

            comment.Text = request.CommentDto.Text;
            _context.Update(comment);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
