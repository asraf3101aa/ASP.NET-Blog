using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Bislerium.Application.Interfaces;
using Bislerium.Domain.Entities;
using Bislerium.Domain.Common;
using Microsoft.EntityFrameworkCore.Storage;
using Bislerium.Application.Common.Models;
using Bislerium.Infrastructure.Persistence.Configurations;

namespace Bislerium.Infrastructure.Persistence.Context;

public class ApplicationDbContext : IdentityDbContext<User>, IApplicationDbContext
{
    // Properties implementing IApplicationDbContext (DbSet is compatible with IQueryable)
    public DbSet<Blog> Blogs { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<BlogImage> BlogImages { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<BlogReaction> BlogReactions { get; set; } = null!;
    public DbSet<CommentReaction> CommentReactions { get; set; } = null!;
    public DbSet<UserNotificationPreference> NotificationPreferences { get; set; } = null!;

    IQueryable<Blog> IApplicationDbContext.Blogs => Blogs;
    IQueryable<Category> IApplicationDbContext.Categories => Categories;
    IQueryable<BlogImage> IApplicationDbContext.BlogImages => BlogImages;
    IQueryable<Comment> IApplicationDbContext.Comments => Comments;
    IQueryable<BlogReaction> IApplicationDbContext.BlogReactions => BlogReactions;
    IQueryable<CommentReaction> IApplicationDbContext.CommentReactions => CommentReactions;
    IQueryable<UserNotificationPreference> IApplicationDbContext.NotificationPreferences => NotificationPreferences;

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.ApplyConfiguration(new BlogCategoryConfiguration());

        // Global Query Filter for Soft Delete
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(ConvertFilterExpression(entityType.ClrType));
            }
        }

        // Blog → Comments: Cascade (deleting a blog deletes its comments)
        modelBuilder.Entity<Blog>()
            .HasMany(b => b.Comments)
            .WithOne(c => c.Blog)
            .HasForeignKey(c => c.BlogId)
            .OnDelete(DeleteBehavior.Cascade);

        // Comment → User: Restrict (don't cascade-delete comments when user is soft-deleted)
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // BlogReaction → Blog: Cascade
        modelBuilder.Entity<BlogReaction>()
            .HasOne(r => r.Blog)
            .WithMany(b => b.Reactions)
            .HasForeignKey(r => r.BlogId)
            .OnDelete(DeleteBehavior.Cascade);

        // BlogReaction → User: Restrict
        modelBuilder.Entity<BlogReaction>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // One reaction per user per blog
        modelBuilder.Entity<BlogReaction>()
            .HasIndex(r => new { r.UserId, r.BlogId })
            .IsUnique();

        // CommentReaction → Comment: Cascade
        modelBuilder.Entity<CommentReaction>()
            .HasOne(r => r.Comment)
            .WithMany()
            .HasForeignKey(r => r.CommentId)
            .OnDelete(DeleteBehavior.Cascade);

        // CommentReaction → User: Restrict
        modelBuilder.Entity<CommentReaction>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // One reaction per user per comment
        modelBuilder.Entity<CommentReaction>()
            .HasIndex(r => new { r.UserId, r.CommentId })
            .IsUnique();

        // Blog → Author: Restrict
        modelBuilder.Entity<Blog>()
            .HasOne(b => b.Author)
            .WithMany()
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        // UserNotificationPreference → User: Cascade
        modelBuilder.Entity<UserNotificationPreference>()
            .HasOne(np => np.User)
            .WithMany(u => u.NotificationPreferences)
            .HasForeignKey(np => np.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // One preference per user per event type
        modelBuilder.Entity<UserNotificationPreference>()
            .HasIndex(np => new { np.UserId, np.EventType })
            .IsUnique();
    }

    private static System.Linq.Expressions.LambdaExpression ConvertFilterExpression(Type type)
    {
        var parameter = System.Linq.Expressions.Expression.Parameter(type, "e");
        var property = System.Linq.Expressions.Expression.Property(parameter, nameof(ISoftDelete.IsDeleted));
        var falseConstant = System.Linq.Expressions.Expression.Constant(false);
        var comparison = System.Linq.Expressions.Expression.Equal(property, falseConstant);
        return System.Linq.Expressions.Expression.Lambda(comparison, parameter);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is IAuditEntity auditable)
            {
                if (entry.State == EntityState.Added)
                {
                    auditable.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    auditable.UpdatedAt = DateTime.UtcNow;
                }
            }

            if (entry.Entity is ISoftDelete softDelete && entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                softDelete.IsDeleted = true;

                if (entry.Entity is IAuditEntity auditableSoftDelete)
                {
                    auditableSoftDelete.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    public new void Add<TEntity>(TEntity entity) where TEntity : class => base.Add(entity);
    public new void Remove<TEntity>(TEntity entity) where TEntity : class => base.Remove(entity);
    public new void Update<TEntity>(TEntity entity) where TEntity : class => base.Update(entity);

    public async Task<PaginatedList<T>> PaginateAsync<T>(IQueryable<T> query, int pageNumber, int pageSize) where T : class
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedList<T>(items, count, pageNumber, pageSize);
    }

    public async Task<int> CountAsync<T>(IQueryable<T> query) where T : class
    {
        return await query.CountAsync();
    }

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return Database.BeginTransactionAsync(cancellationToken);
    }
}
