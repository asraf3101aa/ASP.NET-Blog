using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

namespace Bislerium.Domain.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        private string? _avatar;
        public string? Avatar
        {
            get
            {
                if (string.IsNullOrEmpty(_avatar))
                    return null;
                var httpContextAccessor = new HttpContextAccessor();
                var request = httpContextAccessor.HttpContext?.Request;
                var baseUrl = $"{request?.Scheme}://{request?.Host.Value}";

                return $"{baseUrl}/{_avatar}";
            }
            set => _avatar = value;
        }
        public bool NotifyUpvote { get; set; }
        public bool NotifyDownvote { get; set; }
        public bool NotifyComment { get; set; }
        public int NotificationFrequency { get; set; }
    }
}
