using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.Extensions
{
    public class EmailBaseDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
