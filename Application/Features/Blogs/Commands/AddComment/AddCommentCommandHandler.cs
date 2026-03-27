using Bislerium.Application.Interfaces;
using Bislerium.Domain.Entities;
using MediatR;

namespace Bislerium.Application.Features.Blogs.Commands.AddComment
{
    public class AddCommentCommandHandler : IRequestHandler<AddCommentCommand>
    {
        private readonly IApplicationDbContext _context;

        public AddCommentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(AddCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = new Comment
            {
                Text = request.CommentDto.Text,
                UserId = request.UserId,
                BlogId = request.BlogId
            };

            _context.Add(comment);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
