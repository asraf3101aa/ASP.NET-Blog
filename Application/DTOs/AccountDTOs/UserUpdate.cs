using Microsoft.AspNetCore.Http;

namespace Bislerium.Application.DTOs.AccountDTOs;

public class UserUpdate
{
    public string FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Avatar { get; set; }
}
