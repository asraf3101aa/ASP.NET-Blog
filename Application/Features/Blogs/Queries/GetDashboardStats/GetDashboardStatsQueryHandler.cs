using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.AdminDTOs;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Features.Blogs.Queries.GetDashboardStats
{
    public class GetDashboardStatsQueryHandler : IRequestHandler<GetDashboardStatsQuery, AdminDashboardResponseDTO>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetDashboardStatsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<AdminDashboardResponseDTO> Handle(GetDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var blogsQuery = _context.Blogs.AsQueryable();

            if (request.Duration?.ToLower() == "monthly")
            {
                var now = DateTime.UtcNow;
                var year = now.Year;
                var m = request.Month ?? now.Month;
                var monthStart = new DateTime(year, m, 1, 0, 0, 0, DateTimeKind.Utc);
                var monthEnd = monthStart.AddMonths(1).AddTicks(-1);
                blogsQuery = blogsQuery.Where(b => b.CreatedAt >= monthStart && b.CreatedAt <= monthEnd);
            }

            var blogs = await blogsQuery
                .Include(b => b.Author)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .Include(b => b.Category)
                .Include(b => b.Images)
                .ToListAsync(cancellationToken);

            var blogStats = new BlogStatsDTO
            {
                BlogCount = blogs.Count,
                UpvoteCount = blogs.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote)),
                DownvoteCount = blogs.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Downvote)),
                CommentCount = blogs.Sum(b => b.Comments.Count)
            };

            var popularBlogs = blogs
                .Select(b => new
                {
                    Blog = b,
                    Score = b.Reactions.Count(r => r.Type == ReactionType.Upvote) * 2
                            - b.Reactions.Count(r => r.Type == ReactionType.Downvote)
                            + b.Comments.Count
                })
                .OrderByDescending(x => x.Score)
                .Take(10)
                .Select(x => _mapper.Map<BlogResponseDTO>(x.Blog))
                .ToList();

            var popularBloggers = blogs
                .GroupBy(b => b.Author)
                .Select(g => new PopularBloggerDTO
                {
                    FirstName = g.Key.FirstName,
                    LastName = g.Key.LastName,
                    Email = g.Key.Email,
                    TotalBlogs = g.Count(),
                    TotalUpvote = g.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote)),
                    TotalDownvote = g.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Downvote)),
                    TotalComments = g.Sum(b => b.Comments.Count),
                    TotalPopularityScore = g.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote) * 2
                                               - b.Reactions.Count(r => r.Type == ReactionType.Downvote)
                                               + b.Comments.Count)
                })
                .OrderByDescending(b => b.TotalPopularityScore)
                .Take(10)
                .ToList();

            return new AdminDashboardResponseDTO
            {
                Duration = request.Duration,
                Month = request.Month,
                BlogStats = blogStats,
                PopularBloggers = popularBloggers,
                PopularBlogs = popularBlogs
            };
        }
    }
}
