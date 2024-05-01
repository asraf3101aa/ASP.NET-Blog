using System.ComponentModel.DataAnnotations;


namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class AccountRegisterBaseDTO
    {
        [Required]
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

    }
}
