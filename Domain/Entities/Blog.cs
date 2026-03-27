using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Bislerium.Domain.Common;

namespace Bislerium.Domain.Entities;

public class Blog : BaseEntity
{
    public Blog()
    {
        Images = new HashSet<BlogImage>();
        Comments = new HashSet<Comment>();
        Reactions = new HashSet<BlogReaction>();
    }

    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Body { get; set; } = string.Empty;

    [ForeignKey(nameof(Author))]
    public string AuthorId { get; set; } = string.Empty;
    public virtual User Author { get; set; } = null!;

    public virtual ICollection<BlogImage> Images { get; set; }
    public virtual ICollection<Comment> Comments { get; set; }
    public virtual ICollection<BlogReaction> Reactions { get; set; }

    [Required]
    [ForeignKey(nameof(Category))]
    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
}
