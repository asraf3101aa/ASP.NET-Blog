namespace Bislerium.Application.DTOs.AccountDTOs;

public class ChangePassword
{
    public string NewPassword { get; set; }
    public string ConfirmPassword { get; set; }
    public string CurrentPassword { get; set; }
}
