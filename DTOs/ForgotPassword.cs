using System.ComponentModel.DataAnnotations;

namespace BlogApplication.DTOs
{
    public class ForgotPassword
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
