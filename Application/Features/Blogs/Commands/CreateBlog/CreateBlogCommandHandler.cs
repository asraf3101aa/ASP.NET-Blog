using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Commands.CreateBlog
{
    public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogResponseDTO>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateBlogCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BlogResponseDTO> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = new Blog
            {
                Title = request.BlogDto.Title,
                Body = request.BlogDto.Body,
                CategoryId = request.BlogDto.CategoryId,
                AuthorId = request.Author.Id,
                Images = request.Images
            };

            _context.Add(blog);
            await _context.SaveChangesAsync(cancellationToken);

            // Reload to get includes for mapping
            var createdBlog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .FirstOrDefaultAsync(b => b.Id == blog.Id, cancellationToken);

            return _mapper.Map<BlogResponseDTO>(createdBlog ?? blog);
        }
    }
}
