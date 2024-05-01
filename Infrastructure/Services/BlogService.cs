using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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
                .Include(b => b.Comments)
                    .ThenInclude(c => c.User)
                .Include(b => b.Comments)
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
            return GetQueryableBlogs()
                .OrderBy(b => Guid.NewGuid())
                .AsQueryable();
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
        public async Task<Blog> CreateAsync(BlogCreateDTO newBlog, User author, List<BlogImage> blogImages)
        {
            var blog = new Blog
            {
                Title = newBlog.Title,
                Body = newBlog.Body,
                CategoryId = newBlog.CategoryId,
                CreatedAt = DateTime.UtcNow,
                Author = author,
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
    }
}
