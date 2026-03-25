using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Bislerium.Domain.Common;

namespace Bislerium.Domain.Entities;

public class UserNotificationPreference : BaseEntity
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [Required]
    public string EventType { get; set; } = string.Empty; // e.g., "NewBlog", "BlogUpvote", "CommentUpvote"

    public bool EmailNotification { get; set; } = true;
}
