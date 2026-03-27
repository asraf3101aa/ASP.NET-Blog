namespace Bislerium.Application.DTOs.AccountDTOs;

public class ResetPassword : TokenEmailDTO
{
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
}
