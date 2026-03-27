using AutoMapper;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.Email;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Web;

namespace Bislerium.Presentation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly IRabbitMQBus _rabbitMQBus;
    private readonly IFileService _fileService;
    private readonly IJWTTokenService _jwtTokenService;
    private readonly IResponseService _responseService;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AccountController(IResponseService responseService, IFileService fileService, IAccountService accountService, IRabbitMQBus rabbitMQBus, IJWTTokenService jwtTokenService, IMapper mapper, IConfiguration configuration)
    {
        _accountService = accountService;
        _rabbitMQBus = rabbitMQBus;
        _fileService = fileService;
        _jwtTokenService = jwtTokenService;
        _responseService = responseService;
        _mapper = mapper;
        _configuration = configuration;
    }


    [HttpPost]
    public async Task<IActionResult> Register(UserRegisterDTO userRegister)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _accountService.FindByEmailAsync(userRegister.Email) != null)
            return BadRequest(_responseService.CustomErrorResponse("Email", "Email is already registered."));

        var (signUpResult, user) = await _accountService.SignUpAsync(userRegister);
        if (!signUpResult.Succeeded)
            return BadRequest(_responseService.IdentityResultErrorResponse(signUpResult));

        var roleAddResult = await _accountService.AddToRoleAsync(user, "Blogger");
        if (!roleAddResult.Succeeded)
            return BadRequest(_responseService.IdentityResultErrorResponse(roleAddResult));

        var token = HttpUtility.UrlEncode(await _accountService.GenerateEmailConfirmationTokenAsync(user));

        // Get the client's origin URL
        var clientOrigin = Request.Headers["Origin"].ToString();

        // If the client origin is not present, fallback to the current request URL
        if (string.IsNullOrEmpty(clientOrigin))
            clientOrigin = $"{Request.Scheme}://{Request.Host}";

        // Construct the confirmation link with the client's origin URL
        var confirmationLink = $"{clientOrigin}/confirm-email?token={token}&email={user.Email}";

        var messageDto = new EmailQueueDto(new string[] { user.Email }, "Confirmation email link", confirmationLink);
        await _rabbitMQBus.PublishEmailAsync(messageDto);
        return Ok(_responseService.SuccessResponse<object>(null, "Registration successful"));
    }

    [HttpPut]
    [Route("Confirm")]
    public async Task<IActionResult> ConfirmEmail(TokenEmailDTO tokenEmail)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = await _accountService.FindByEmailAsync(tokenEmail.Email);
        if (user == null)
            return NotFound(_responseService.CustomErrorResponse("Not Found", "User not found"));
        if (user.EmailConfirmed)
            return BadRequest(_responseService.CustomErrorResponse("Email", "Email already confirmed"));
        var result = await _accountService.ConfirmEmailAsync(user, tokenEmail.Token);
        return result.Succeeded ? Ok(_responseService.SuccessResponse<object>(null, "Email Confirmed")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(UserLogin userModel)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = await _accountService.FindByEmailAsync(userModel.Email);
        if (user != null && await _accountService.SignInAsync(user, userModel.Password))
        {
            var accessToken = await _jwtTokenService.GenerateTokenAsync(user);
            var refreshToken = _jwtTokenService.GenerateRefreshToken(user);

            return Ok(_responseService.SuccessResponse(new TokenDTO
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            }));
        }
        return BadRequest(_responseService.CustomErrorResponse("Login Failed", "Invalid Email or Password"));
    }

    [HttpPost("Refresh")]
    public async Task<IActionResult> Refresh(TokenDTO tokenDto)
    {
        if (tokenDto is null)
            return BadRequest(_responseService.CustomErrorResponse("Invalid Request", "Token DTO is null"));

        // Validate the refresh token (stateless — checks signature and expiry)
        var refreshPrincipal = _jwtTokenService.ValidateRefreshToken(tokenDto.RefreshToken);
        if (refreshPrincipal == null)
            return BadRequest(_responseService.CustomErrorResponse("Invalid Request", "Invalid or expired refresh token"));

        var userId = refreshPrincipal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return BadRequest(_responseService.CustomErrorResponse("Invalid Request", "Invalid refresh token"));

        var user = await _accountService.FindByEmailAsync(
            (await _accountService.GetUserByClaimsAsync(refreshPrincipal))?.Email ?? "");

        // Fallback: look up user by sub claim
        if (user == null)
        {
            // The sub claim contains the user ID, not email. Use GetUserByClaimsAsync approach.
            var principal = _jwtTokenService.GetPrincipalFromExpiredToken(tokenDto.AccessToken);
            var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            user = email != null ? await _accountService.FindByEmailAsync(email) : null;
        }

        if (user == null)
            return BadRequest(_responseService.CustomErrorResponse("Invalid Request", "User not found"));

        var newAccessToken = await _jwtTokenService.GenerateTokenAsync(user);
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken(user);

        return Ok(_responseService.SuccessResponse(new TokenDTO
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        }));
    }

    [HttpPost]
    [Route("Password/Forgot")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDTO forgotPasswordModel)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _accountService.FindByEmailAsync(forgotPasswordModel.Email);
        if (user == null)
            return BadRequest(_responseService.CustomErrorResponse("User", "User with this email not found."));

        var token = HttpUtility.UrlEncode(await _accountService.GeneratePasswordResetTokenAsync(user));
        // Get the client's origin URL
        var clientOrigin = Request.Headers["Origin"].ToString();

        // If the client origin is not present, fallback to the current request URL
        if (string.IsNullOrEmpty(clientOrigin))
            clientOrigin = $"{Request.Scheme}://{Request.Host}";

        // Construct the confirmation link with the client's origin URL
        var callback = $"{clientOrigin}/reset-password?token={token}&email={user.Email}";
        var messageDto = new EmailQueueDto(new string[] { user.Email }, "Reset password token", callback);
        await _rabbitMQBus.PublishEmailAsync(messageDto);
        return Ok(_responseService.SuccessResponse<object>(null, "Password reset token sent in email."));
    }

    [HttpPut]
    [Route("Password/Confirm")]
    public async Task<IActionResult> ResetPassword(ResetPassword resetPasswordModel)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _accountService.FindByEmailAsync(resetPasswordModel.Email);
        if (user == null)
            return BadRequest(_responseService.CustomErrorResponse("User", "User with this email not found."));

        var result = await _accountService.ResetPasswordAsync(user, resetPasswordModel);
        return result.Succeeded ? Ok(_responseService.SuccessResponse<object>(null, "Password changed successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
    }

    [HttpPut]
    [Authorize]
    [RequireConfirmedEmail]
    public async Task<IActionResult> Update([FromForm] UserUpdate userUpdate)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = await _accountService.GetUserByClaimsAsync(User);
        if (userUpdate.Avatar != null)
        {
            var (filePath, error) = _fileService.UploadFile(userUpdate.Avatar);
            if (error != string.Empty)
                return BadRequest(_responseService.CustomErrorResponse("avatar", error));
            user.AvatarPath = filePath;
        }
        var result = await _accountService.UpdateAsync(user, userUpdate);
        return result.Succeeded ? Accepted(_responseService.SuccessResponse<object>(null, "User details updated successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> Delete()
    {
        var user = await _accountService.GetUserByClaimsAsync(User);
        var result = await _accountService.DeleteAsync(user);
        return result.Succeeded ? Ok(_responseService.SuccessResponse<object>(null, "Account deleted successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        var user = await _accountService.GetUserByClaimsAsync(User);
        if (user == null)
            return NotFound(_responseService.CustomErrorResponse("Not found", "User not found."));

        var userDto = _mapper.Map<UserResponseDTO>(user);
        userDto.Roles = (await _accountService.GetRolesAsync(user)).ToList();

        return Ok(_responseService.SuccessResponse(userDto));
    }

    [HttpGet]
    [Route("Confirm/Resend")]
    [Authorize]
    public async Task<IActionResult> ResendEmailConfirmation()
    {
        var user = await _accountService.GetUserByClaimsAsync(User);
        var token = HttpUtility.UrlEncode(await _accountService.GenerateEmailConfirmationTokenAsync(user));
        // Get the client's origin URL
        var clientOrigin = Request.Headers["Origin"].ToString();

        // If the client origin is not present, fallback to the current request URL
        if (string.IsNullOrEmpty(clientOrigin))
            clientOrigin = $"{Request.Scheme}://{Request.Host}";

        // Construct the confirmation link with the client's origin URL
        var confirmationLink = $"{clientOrigin}/confirm-email?token={token}&email={user.Email}";
        var messageDto = new EmailQueueDto(new string[] { user.Email }, "Confirmation email link", confirmationLink);
        await _rabbitMQBus.PublishEmailAsync(messageDto);
        return Ok(_responseService.SuccessResponse<object>(null, "Confirmation email sent successfully."));
    }

    [HttpPost]
    [Route("Email")]
    [Authorize]
    public async Task<IActionResult> UpdateEmail(EmailBaseDTO emailModel)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = await _accountService.GetUserByClaimsAsync(User);
        var existingUser = await _accountService.FindByEmailAsync(emailModel.Email);
        if (emailModel.Email == user.Email || existingUser != null)
            return BadRequest(_responseService.CustomErrorResponse("Email", "Please provide a different email"));

        var token = HttpUtility.UrlEncode(await _accountService.GenerateChangeEmailTokenAsync(user, emailModel.Email));
        // Get the client's origin URL
        var clientOrigin = Request.Headers["Origin"].ToString();

        // If the client origin is not present, fallback to the current request URL
        if (string.IsNullOrEmpty(clientOrigin))
            clientOrigin = $"{Request.Scheme}://{Request.Host}";

        // Construct the confirmation link with the client's origin URL
        var confirmationLink = $"{clientOrigin}/change-email?token={token}&email={user.Email}";

        var messageDto = new EmailQueueDto(new string[] { emailModel.Email }, "Email change request", confirmationLink);
        //var result = await _accountService.SetEmailAsync(user, emailModel.Email);
        //if (!result.Succeeded)
        //    return BadRequest(_responseService.IdentityResultErrorResponse(result));

        await _rabbitMQBus.PublishEmailAsync(messageDto);
        return Ok(_responseService.SuccessResponse<object>(null, "Check email for confirmation mail."));
    }

    [HttpPut]
    [Route("Email")]
    public async Task<IActionResult> ConfirmEmailChange(TokenEmailDTO tokenEmail)
    {
        var user = await _accountService.GetUserByClaimsAsync(User);

        // Confirm the email change token
        var result = await _accountService.ChangeEmailAsync(user, tokenEmail.Email, tokenEmail.Token);

        if (!result.Succeeded)
            return BadRequest(_responseService.IdentityResultErrorResponse(result));

        return Ok(_responseService.SuccessResponse<object>(null, "Your email has been updated successfully."));
    }

    [HttpPut("Password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword(ChangePassword changePassword)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var user = await _accountService.GetUserByClaimsAsync(User);
        var result = await _accountService.ChangePasswordAsync(user, changePassword);
        return result.Succeeded ? Ok(_responseService.SuccessResponse<object>(null, "Your password has been updated successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
    }
}