using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Domain.Entities;
using Bislerium.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Bislerium.Infrastructure.Services
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ApplicationDbContext _context;

        public AccountService(SignInManager<User> signInManager, UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
        }

        public async Task<User> FindByEmailAsync(string email)
        {
            return await _userManager.FindByEmailAsync(email);
        }
        public async Task<(IdentityResult, User)> SignUpAsync(UserRegisterDTO newUser)
        {
            var user = new User
            {
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Email = newUser.Email,
                UserName = newUser.Email
            };
            return (await _userManager.CreateAsync(user, newUser.Password), user);
        }
        public async Task<string> GenerateEmailConfirmationTokenAsync(User user)
        {
            return await _userManager.GenerateEmailConfirmationTokenAsync(user);
        }
        public async Task<string> GenerateChangeEmailTokenAsync(User user, string email)
        {
            return await _userManager.GenerateChangeEmailTokenAsync(user, email);
        }
        public async Task<IdentityResult> AddToRoleAsync(User user, string RoleName)
        {
            return await _userManager.AddToRoleAsync(user, "Blogger");
        }
        public async Task<IEnumerable<string>> GetRolesAsync(User user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles;
        }
        public async Task<bool> SignInAsync(User user, string password)
        {
            var result = await _userManager.CheckPasswordAsync(user, password);
            return result;
        }
        public async Task<IdentityResult> ConfirmEmailAsync(User user, string token)
        {
            return await _userManager.ConfirmEmailAsync(user, token);
        }
        public async Task<IdentityResult> ChangeEmailAsync(User user, string email, string token)
        {
            return await _userManager.ChangeEmailAsync(user, email, token);
        }
        public async Task<string> GeneratePasswordResetTokenAsync(User user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }
        public async Task<IdentityResult> ResetPasswordAsync(User user, ResetPassword resetPassword)
        {
            return await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
        }
        public async Task<User> GetUserByClaimsAsync(ClaimsPrincipal userClaims)
        {
            var userId = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return await _userManager.FindByIdAsync(userId);
        }
        public async Task<IdentityResult> UpdateAsync(User user, UserUpdate updateUser)
        {
            user.FirstName = updateUser.FirstName ?? user.FirstName;
            user.LastName = updateUser.LastName ?? user.LastName;
            return await _userManager.UpdateAsync(user);
        }
        public async Task<IdentityResult> DeleteAsync(User user)
        {
            return await _userManager.DeleteAsync(user);
        }
        public async Task<IdentityResult> SetEmailAsync(User user, string newEmail)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    await _userManager.SetEmailAsync(user, newEmail);
                    await _userManager.SetUserNameAsync(user, newEmail);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return IdentityResult.Success;
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return IdentityResult.Failed(new IdentityError { Description = "An error occurred while setting email." });
                }
            }
        }
        public async Task<IdentityResult> ChangePasswordAsync(User user, ChangePassword changePassword)
        {
            return await _userManager.ChangePasswordAsync(user, changePassword.CurrentPassword, changePassword.NewPassword);
        }

    }

}
