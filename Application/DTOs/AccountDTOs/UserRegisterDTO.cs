using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class UserRegisterDTO : AccountRegisterBaseDTO
    {
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
