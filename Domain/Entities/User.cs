using Microsoft.AspNetCore.Identity;

namespace Bislerium.Domain.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Avatar { get; set; } = "app/images/avatar.png";
    }
}
