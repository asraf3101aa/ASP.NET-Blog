using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.Email
{
    public class EmailBaseDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
