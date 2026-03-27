using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Queries.GetAuthorBlogs
{
    public class GetAuthorBlogsQueryHandler : IRequestHandler<GetAuthorBlogsQuery, PaginatedBlogsDTO>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetAuthorBlogsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedBlogsDTO> Handle(GetAuthorBlogsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Blogs
                .Where(b => b.AuthorId == request.AuthorId)
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .OrderByDescending(b => b.CreatedAt);

            var pagedBlogs = await _context.PaginateAsync(query, request.PageNumber, request.PageSize);

            return new PaginatedBlogsDTO
            {
                PaginationMetaData = new PaginationMetaData
                {
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = request.PageSize,
                    TotalPages = pagedBlogs.TotalPages,
                    TotalItems = pagedBlogs.TotalCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                },
                Blogs = _mapper.Map<IEnumerable<BlogResponseDTO>>(pagedBlogs.Items)
            };
        }
    }
}
