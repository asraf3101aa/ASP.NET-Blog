using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.UpdateBlog
{
    public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand, BlogResponseDTO?>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UpdateBlogCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BlogResponseDTO?> Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = await _context.Blogs
                .Include(b => b.Images)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (blog == null || blog.AuthorId != request.Author.Id)
                return null;

            blog.Title = request.BlogDto.Title;
            blog.Body = request.BlogDto.Body;
            blog.CategoryId = request.BlogDto.CategoryId;

            if (request.Images.Any())
            {
                blog.Images.Clear();
                foreach (var img in request.Images)
                {
                    blog.Images.Add(img);
                }
            }

            _context.Update(blog);
            await _context.SaveChangesAsync(cancellationToken);

            // Reload to get all includes for the final mapping
            var updatedBlog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .FirstOrDefaultAsync(b => b.Id == blog.Id, cancellationToken);

            return _mapper.Map<BlogResponseDTO>(updatedBlog);
        }
    }
}
