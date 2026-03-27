using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Queries.GetBlogById
{
    public class GetBlogByIdQueryHandler : IRequestHandler<GetBlogByIdQuery, BlogResponseDTO?>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBlogByIdQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<BlogResponseDTO?> Handle(GetBlogByIdQuery request, CancellationToken cancellationToken)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments.OrderByDescending(c => c.CreatedAt))
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

            return blog != null ? _mapper.Map<BlogResponseDTO>(blog) : null;
        }
    }
}
