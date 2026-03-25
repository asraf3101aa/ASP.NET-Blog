using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Bislerium.Domain.Common;

namespace Bislerium.Domain.Entities;

public class User : IdentityUser, ISoftDelete, IAuditEntity
{
    [Required]
    [MaxLength(20)]
    public required string FirstName { get; set; }
    public string? LastName { get; set; }
    public string? AvatarPath { get; set; }

    public virtual ICollection<UserNotificationPreference> NotificationPreferences { get; set; } = new HashSet<UserNotificationPreference>();

    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
