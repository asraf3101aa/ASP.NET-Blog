using Bislerium.Application.DTOs.Email;

namespace Bislerium.Application.DTOs.AccountDTOs;

public class TokenEmailDTO : EmailBaseDTO
{
    public string Token { get; set; }
}
