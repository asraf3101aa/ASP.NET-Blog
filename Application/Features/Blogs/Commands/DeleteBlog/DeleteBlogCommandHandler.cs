using Bislerium.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.DeleteBlog
{
    public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public DeleteBlogCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);
            if (blog == null || blog.AuthorId != request.Author.Id)
                return false;

            _context.Remove(blog);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
