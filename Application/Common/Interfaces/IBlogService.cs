using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IBlogService
    {
        public IQueryable<Blog> GetQueryableRandomBlogAsync();
        public IQueryable<Blog> GetQueryablePopularBlogAsync();
        public IQueryable<Blog> GetQueryableRecentBlogAsync();
        public Task<Blog> FindByIdAsync(int id);
        public Task<IEnumerable<Category>> GetBlogCategoriesAsync();
        public Task<Blog> CreateAsync(BlogCreateDTO newBlog, User author, List<BlogImage> blogImages);
        public Task DeleteBlogAsync(Blog blog);
        public IQueryable<Blog> GetQueryableAuthorBlogsAsync(User user);
        public IQueryable<Blog> GetQueryableBlogs();
        public int CalculatePopularity(Blog blog);


    }
}
