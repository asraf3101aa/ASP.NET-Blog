using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class EmailModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
