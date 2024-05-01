using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class UserUpdate
    {
        [Required]
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public IFormFile? Image { get; set; }
        public string? Avatar { get; set; }
    }
}
