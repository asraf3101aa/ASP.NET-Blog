using Bislerium.Domain.Entities;
using Bislerium.Application.Common.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Bislerium.Application.Interfaces;

public interface IApplicationDbContext
{
    IQueryable<Blog> Blogs { get; }
    IQueryable<Category> Categories { get; }
    IQueryable<BlogImage> BlogImages { get; }
    IQueryable<Comment> Comments { get; }
    IQueryable<BlogReaction> BlogReactions { get; }
    IQueryable<CommentReaction> CommentReactions { get; }
    IQueryable<UserNotificationPreference> NotificationPreferences { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    void Add<TEntity>(TEntity entity) where TEntity : class;
    void Remove<TEntity>(TEntity entity) where TEntity : class;
    void Update<TEntity>(TEntity entity) where TEntity : class;

    Task<PaginatedList<T>> PaginateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize) where T : class;
    Task<int> CountAsync<T>(IQueryable<T> query) where T : class;

    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}
