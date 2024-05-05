using System;
using System.ComponentModel.DataAnnotations;


namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class ResetPassword : TokenEmailDTO
    {
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
