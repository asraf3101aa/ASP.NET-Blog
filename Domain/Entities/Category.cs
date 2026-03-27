using System.ComponentModel.DataAnnotations;
using Bislerium.Domain.Common;

namespace Bislerium.Domain.Entities;

public class Category : BaseEntity
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}
