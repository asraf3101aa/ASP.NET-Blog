using System.ComponentModel.DataAnnotations;

namespace BlogApplication.DTOs
{
    public class UserRegistration
    {
        [Required]
        public string FirstName { get; set; }
        public string ? LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "Password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
