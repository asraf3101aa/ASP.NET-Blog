using System.ComponentModel.DataAnnotations.Schema;
using Bislerium.Domain.Common;
using Bislerium.Domain.Enums;

namespace Bislerium.Domain.Entities;


public class BlogReaction : BaseEntity
{
    public int Id { get; set; }
    public ReactionType Type { get; set; }

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(Blog))]
    public int BlogId { get; set; }
    public virtual Blog Blog { get; set; } = null!;
}

public class CommentReaction : BaseEntity
{
    public int Id { get; set; }
    public ReactionType Type { get; set; }

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(Comment))]
    public int CommentId { get; set; }
    public virtual Comment Comment { get; set; } = null!;
}
