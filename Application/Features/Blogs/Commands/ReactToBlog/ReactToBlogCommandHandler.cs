using Bislerium.Application.Interfaces;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.ReactToBlog
{
    public class ReactToBlogCommandHandler : IRequestHandler<ReactToBlogCommand>
    {
        private readonly IApplicationDbContext _context;

        public ReactToBlogCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ReactToBlogCommand request, CancellationToken cancellationToken)
        {
            var existingReaction = await _context.BlogReactions
                .FirstOrDefaultAsync(r => r.UserId == request.UserId && r.BlogId == request.BlogId, cancellationToken);

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
                var reaction = new BlogReaction
                {
                    Type = request.ReactionType,
                    UserId = request.UserId,
                    BlogId = request.BlogId,
                };
                _context.Add(reaction);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
