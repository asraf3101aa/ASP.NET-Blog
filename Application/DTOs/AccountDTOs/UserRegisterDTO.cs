namespace Bislerium.Application.DTOs.AccountDTOs;

public class UserRegisterDTO : AccountRegisterBaseDTO
{
    public string Password { get; set; }
    public string ConfirmPassword { get; set; }
}
