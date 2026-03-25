using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Queries.GetBlogs
{
    public class GetBlogsQueryHandler : IRequestHandler<GetBlogsQuery, PaginatedBlogsDTO>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBlogsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedBlogsDTO> Handle(GetBlogsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .AsQueryable();

            query = request.SortBy.ToLower() switch
            {
                "popularity" => query.OrderByDescending(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote) * 2
                                                          - b.Reactions.Count(r => r.Type == ReactionType.Downvote)
                                                          + b.Comments.Count),
                "recency" => query.OrderByDescending(b => b.CreatedAt),
                _ => query.OrderByDescending(b => b.CreatedAt)
            };

            var pagedBlogs = await _context.PaginateAsync(query, request.PageNumber, request.PageSize);

            return new PaginatedBlogsDTO
            {
                PaginationMetaData = new PaginationMetaData
                {
                    SortBy = request.SortBy,
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
