using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Application.DTOs.AdminDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;
using Bislerium.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace Bislerium.Application.Services
{
    public class BlogService : IBlogService
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BlogService(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PaginatedBlogsDTO> GetBlogsAsync(int pageNumber, int pageSize, string sortBy)
        {
            var query = _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .AsQueryable();

            query = sortBy.ToLower() switch
            {
                "popularity" => query.OrderByDescending(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote) * 2
                                                          - b.Reactions.Count(r => r.Type == ReactionType.Downvote)
                                                          + b.Comments.Count),
                "recency" => query.OrderByDescending(b => b.CreatedAt),
                _ => query.OrderByDescending(b => b.CreatedAt)
            };

            var pagedBlogs = await _context.PaginateAsync(query, pageNumber, pageSize);

            return new PaginatedBlogsDTO
            {
                PaginationMetaData = new PaginationMetaData
                {
                    SortBy = sortBy,
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = pageSize,
                    TotalPages = pagedBlogs.TotalPages,
                    TotalItems = pagedBlogs.TotalCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                },
                Blogs = _mapper.Map<IEnumerable<BlogResponseDTO>>(pagedBlogs.Items)
            };
        }

        public async Task<BlogResponseDTO?> GetByIdAsync(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments.OrderByDescending(c => c.CreatedAt))
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(m => m.Id == id);

            return blog != null ? _mapper.Map<BlogResponseDTO>(blog) : null;
        }

        public async Task<BlogResponseDTO> CreateAsync(BlogDTO blogDto, User author, List<BlogImage> images)
        {
            var blog = new Blog
            {
                Title = blogDto.Title,
                Body = blogDto.Body,
                CategoryId = blogDto.CategoryId,
                AuthorId = author.Id,
                Images = images
            };

            _context.Add(blog);
            await _context.SaveChangesAsync();

            // Reload to get includes for mapping
            return await GetByIdAsync(blog.Id) ?? _mapper.Map<BlogResponseDTO>(blog);
        }

        public async Task<BlogResponseDTO?> UpdateAsync(int id, BlogDTO blogDto, User author, List<BlogImage> images)
        {
            var blog = await _context.Blogs
                .Include(b => b.Images)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null || blog.AuthorId != author.Id)
                return null;

            blog.Title = blogDto.Title;
            blog.Body = blogDto.Body;
            blog.CategoryId = blogDto.CategoryId;

            if (images.Any())
            {
                blog.Images.Clear();
                foreach (var img in images)
                {
                    blog.Images.Add(img);
                }
            }

            _context.Update(blog);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(blog.Id);
        }

        public async Task<bool> DeleteAsync(int id, User author)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.Id == id);
            if (blog == null || blog.AuthorId != author.Id)
                return false;

            _context.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedBlogsDTO> GetAuthorBlogsAsync(string authorId, int pageNumber, int pageSize)
        {
            var query = _context.Blogs
                .Where(b => b.AuthorId == authorId)
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                .Include(b => b.Comments)
                .OrderByDescending(b => b.CreatedAt);

            var pagedBlogs = await _context.PaginateAsync(query, pageNumber, pageSize);

            return new PaginatedBlogsDTO
            {
                PaginationMetaData = new PaginationMetaData
                {
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = pageSize,
                    TotalPages = pagedBlogs.TotalPages,
                    TotalItems = pagedBlogs.TotalCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                },
                Blogs = _mapper.Map<IEnumerable<BlogResponseDTO>>(pagedBlogs.Items)
            };
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task ReactToBlogAsync(int blogId, string userId, ReactionType reactionType)
        {
            var existingReaction = await _context.BlogReactions.FirstOrDefaultAsync(r => r.UserId == userId && r.BlogId == blogId);

            if (existingReaction != null)
            {
                if (existingReaction.Type == reactionType)
                    _context.Remove(existingReaction);
                else
                {
                    existingReaction.Type = reactionType;
                    _context.Update(existingReaction);
                }
            }
            else
            {
                var reaction = new BlogReaction
                {
                    Type = reactionType,
                    UserId = userId,
                    BlogId = blogId,
                };
                _context.Add(reaction);
            }
            await _context.SaveChangesAsync();
        }

        public async Task ReactToCommentAsync(int commentId, string userId, ReactionType reactionType)
        {
            var existingReaction = await _context.CommentReactions
                .FirstOrDefaultAsync(r => r.CommentId == commentId && r.UserId == userId);

            if (existingReaction != null)
            {
                if (existingReaction.Type == reactionType)
                    _context.Remove(existingReaction);
                else
                {
                    existingReaction.Type = reactionType;
                    _context.Update(existingReaction);
                }
            }
            else
            {
                var reaction = new CommentReaction
                {
                    Type = reactionType,
                    UserId = userId,
                    CommentId = commentId,
                };
                _context.Add(reaction);
            }
            await _context.SaveChangesAsync();
        }

        public async Task AddCommentAsync(int blogId, string userId, CommentDTO commentDto)
        {
            var comment = new Comment
            {
                Text = commentDto.Text,
                UserId = userId,
                BlogId = blogId
            };
            _context.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateCommentAsync(int commentId, string userId, CommentDTO commentDto)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
            if (comment == null || comment.UserId != userId)
                return false;

            comment.Text = commentDto.Text;
            _context.Update(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCommentAsync(int commentId, string userId)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);
            if (comment == null || (comment.UserId != userId)) // Note: Admin might need delete rights too
                return false;

            _context.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<AdminDashboardResponseDTO> GetDashboardStatsAsync(string? duration, int? month)
        {
            var blogsQuery = _context.Blogs.AsQueryable();

            if (duration?.ToLower() == "monthly")
            {
                var now = DateTime.UtcNow;
                var year = now.Year;
                var m = month ?? now.Month;
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
                .ToListAsync();

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
                Duration = duration,
                Month = month,
                BlogStats = blogStats,
                PopularBloggers = popularBloggers,
                PopularBlogs = popularBlogs ?? new List<BlogResponseDTO>()
            };
        }
    }
}
