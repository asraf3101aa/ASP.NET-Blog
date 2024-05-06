using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace Bislerium.Infrastructure.Services
{
    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;
        public BlogService(ApplicationDbContext context)
        {
            _context = context;
        }
        public int CalculatePopularity(Blog blog)
        {
            int upvoteWeightage = 2;
            int downvoteWeightage = -1;
            int commentWeightage = 1;

            int upvotes = blog.Reactions.Count(r => r.Type == ReactionType.Upvote);
            int downvotes = blog.Reactions.Count(r => r.Type == ReactionType.Downvote);
            int comments = blog.Comments.Count;

            return upvoteWeightage * upvotes + downvoteWeightage * downvotes + commentWeightage * comments;
        }
        public IQueryable<Blog> GetQueryableBlogs()
        {
            return _context.Blogs
                .Include(b => b.Category)
                .Include(b => b.Author)
                .Include(b => b.Images)
                .Include(b => b.Reactions)
                    .ThenInclude(r => r.User)
                .Include(b => b.Comments.OrderByDescending(c => c.CreatedAt))
                    .ThenInclude(c => c.User)
                .Include(b => b.Comments.OrderByDescending(c => c.CreatedAt))
                    .ThenInclude(c => c.Reactions)
                        .ThenInclude(r => r.User);

        }
        public IQueryable<Blog> GetQueryablePopularBlogAsync()
        {
            var blogs = GetQueryableBlogs()
                .AsEnumerable() // Switch to client evaluation
                .OrderByDescending(b => CalculatePopularity(b))
                .AsQueryable(); // Convert back to IQueryable
            return blogs;
        }
        public IQueryable<Blog> GetQueryableRecentBlogAsync()
        {
            return GetQueryableBlogs()
                .OrderByDescending(b => b.CreatedAt)
                .AsQueryable();
        }
        public IQueryable<Blog> GetQueryableRandomBlogAsync()
        {
            var blogs = GetQueryableBlogs().ToList();
            var random = new Random();
            return blogs.OrderBy(b => random.Next()).AsQueryable();
        }
        public async Task<Blog> FindByIdAsync(int id)
        {
            return await GetQueryableBlogs().FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Category>> GetBlogCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
        public async Task DeleteBlogAsync(Blog blog)
        {
            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
        }
        public async Task<Blog> CreateAsync(BlogDTO newBlog, User author, List<BlogImage> blogImages)
        {
            var blog = new Blog
            {
                Title = newBlog.Title,
                Body = newBlog.Body,
                CategoryId = newBlog.CategoryId,
                CreatedAt = DateTime.UtcNow,
                AuthorId = author.Id,
                Images = blogImages
            };
            await _context.Blogs.AddAsync(blog);
            await _context.SaveChangesAsync();
            return blog;
        }
        public IQueryable<Blog> GetQueryableAuthorBlogsAsync(User author)
        {
            return GetQueryableBlogs().OrderByDescending(b => b.CreatedAt).Where(b => b.AuthorId == author.Id);
        }

        public async Task<Blog> UpdateAsync(BlogDTO updateBlog, Blog existingBlog, List<BlogImage> blogImages)
        {
            existingBlog.Title = updateBlog.Title;
            existingBlog.Body = updateBlog.Body;
            existingBlog.CategoryId = updateBlog.CategoryId;
            existingBlog.Images = blogImages;

            _context.Blogs.Update(existingBlog);
            await _context.SaveChangesAsync();
            return existingBlog;
        }

        public async Task ReactAsync(Blog ? blog, Comment ? comment, string userId, ReactionType reactionType)
        {
            if (blog != null)
            {
                var existingReaction = blog.Reactions.FirstOrDefault(r => r.UserId == userId);

                if (existingReaction != null)
                {
                    if (existingReaction.Type == reactionType)
                        _context.Reactions.Remove(existingReaction);
                    else
                        existingReaction.Type = reactionType;
                }
                else
                {
                    var reaction = new Reaction
                    {
                        Type = reactionType,
                        UserId = userId,
                        BlogId = blog.Id,
                    };

                    _context.Reactions.Add(reaction);
                }
                await _context.SaveChangesAsync();
            }
            if (comment != null)
            {
                var existingReaction = comment.Reactions.FirstOrDefault(r => r.UserId == userId);

                if (existingReaction != null)
                {
                    if (existingReaction.Type == reactionType)
                        _context.Reactions.Remove(existingReaction);
                    else
                        existingReaction.Type = reactionType;
                }
                else
                {
                    var reaction = new Reaction
                    {
                        Type = reactionType,
                        UserId = userId,
                        CommentId = comment.Id,
                    };

                    _context.Reactions.Add(reaction);
                }
                await _context.SaveChangesAsync();
            }

        }

        public async Task<Comment> GetCommentByIdAsync(int id)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(r => r.Id == id);
            return comment;
        }

        public async Task DeleteCommentAsync(Comment comment)
        {
            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCommentAsync(Comment comment, CommentDTO updateComment)
        {
            comment.Text = updateComment.Text;
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }

        public async Task AddCommentAsync(CommentDTO commentDto, int blogId, string userId)
        {
            var comment = new Comment
            {
                Text = commentDto.Text,
                UserId = userId,
                BlogId = blogId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }
    }
}
