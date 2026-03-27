using Bislerium.Domain.Entities;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class UserProfileDTO
    {
        public User User { get; set; }
        public ICollection<Blog> Blogs { get; set; }
    }
}
