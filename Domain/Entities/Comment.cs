using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Bislerium.Domain.Common;

namespace Bislerium.Domain.Entities;

public class Comment : BaseEntity
{
    public int Id { get; set; }

    [Required]
    public string Text { get; set; } = string.Empty;

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = string.Empty;
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(Blog))]
    public int BlogId { get; set; }
    public virtual Blog Blog { get; set; } = null!;
}
