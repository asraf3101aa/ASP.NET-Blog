using Bislerium.Application.DTOs.Email;
using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.AccountDTOs
{
    public class TokenEmailDTO : EmailBaseDTO
    {
        [Required]
        public string Token { get; set; }
    }
}
