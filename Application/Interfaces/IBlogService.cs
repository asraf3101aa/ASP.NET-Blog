using Bislerium.Application.DTOs.AdminDTOs;
using Bislerium.Application.DTOs.BlogDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Enums;

namespace Bislerium.Application.Interfaces;

public interface IBlogService
{
    Task<PaginatedBlogsDTO> GetBlogsAsync(int pageNumber, int pageSize, string sortBy);
    Task<BlogResponseDTO?> GetByIdAsync(int id);
    Task<BlogResponseDTO> CreateAsync(BlogDTO blogDto, User author, List<BlogImage> images);
    Task<BlogResponseDTO?> UpdateAsync(int id, BlogDTO blogDto, User author, List<BlogImage> images);
    Task<bool> DeleteAsync(int id, User author);
    Task<PaginatedBlogsDTO> GetAuthorBlogsAsync(string authorId, int pageNumber, int pageSize);
    Task<AdminDashboardResponseDTO> GetDashboardStatsAsync(string? duration, int? month);

    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task ReactToBlogAsync(int blogId, string userId, ReactionType reactionType);
    Task ReactToCommentAsync(int commentId, string userId, ReactionType reactionType);
    Task AddCommentAsync(int blogId, string userId, CommentDTO commentDto);
    Task<bool> UpdateCommentAsync(int commentId, string userId, CommentDTO commentDto);
    Task<bool> DeleteCommentAsync(int commentId, string userId);
}
