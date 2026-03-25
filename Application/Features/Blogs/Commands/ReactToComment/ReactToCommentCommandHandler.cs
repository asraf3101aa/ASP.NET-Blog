using Bislerium.Application.Interfaces;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.ReactToComment
{
    public class ReactToCommentCommandHandler : IRequestHandler<ReactToCommentCommand>
    {
        private readonly IApplicationDbContext _context;

        public ReactToCommentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ReactToCommentCommand request, CancellationToken cancellationToken)
        {
            var existingReaction = await _context.CommentReactions
                .FirstOrDefaultAsync(r => r.CommentId == request.CommentId && r.UserId == request.UserId, cancellationToken);

            if (existingReaction != null)
            {
                if (existingReaction.Type == request.ReactionType)
                {
                    _context.Remove(existingReaction);
                }
                else
                {
                    existingReaction.Type = request.ReactionType;
                    _context.Update(existingReaction);
                }
            }
            else
            {
                var reaction = new CommentReaction
                {
                    Type = request.ReactionType,
                    UserId = request.UserId,
                    CommentId = request.CommentId,
                };
                _context.Add(reaction);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
