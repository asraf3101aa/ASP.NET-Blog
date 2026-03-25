using System;

namespace Bislerium.Domain.Common;

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}

public interface IAuditEntity
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}

public abstract class BaseEntity : ISoftDelete, IAuditEntity
{
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
