using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IAccountService
    {
        public Task<(SignInResult, User)> SignInAsync(UserLogin signInRequest);
        public Task<(IdentityResult, User)> SignUpAsync(UserRegisterDTO signUpRequest);
        public Task<IdentityResult> AddToRoleAsync(User user, string RoleName);
        public Task<string> GenerateEmailConfirmationTokenAsync(User user);
        public Task<string> GenerateChangeEmailTokenAsync(User user, string email);
        public Task<IdentityResult> ChangeEmailAsync(User user, string email, string token);

        public Task SignOutAsync();
        public Task<User> FindByEmailAsync(string email);
        public Task<IdentityResult> ConfirmEmailAsync(User user, string token);
        public Task<string> GeneratePasswordResetTokenAsync(User user);
        public Task<IdentityResult> ResetPasswordAsync(User user, ResetPassword resetPassword);
        public Task<User> GetUserByClaimsAsync(ClaimsPrincipal userClaims);
        public Task<IdentityResult> UpdateAsync(User user, UserUpdate updateUser);
        public Task<IdentityResult> DeleteAsync(User user);
        public Task<IdentityResult> SetEmailAsync(User user, string newEmail);
        public Task<IdentityResult> ChangePasswordAsync(User user, ChangePassword changePassword);
        public Task<IEnumerable<string>> GetRolesAsync(User user);

    }
}
