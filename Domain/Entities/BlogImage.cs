using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Bislerium.Domain.Common;
using Bislerium.Domain.Enums;

namespace Bislerium.Domain.Entities;

public class BlogImage : BaseEntity
{
    public int Id { get; set; }

    [Required]
    public string Path { get; set; } = string.Empty;

    public BlogImageType ImageType { get; set; }

    [ForeignKey(nameof(Blog))]
    public int BlogId { get; set; }
    public virtual Blog Blog { get; set; } = null!;
}
