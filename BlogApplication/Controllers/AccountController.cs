using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace Bislerium.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IEmailService _emailService;
        private readonly IFileService _fileService;
        private readonly IJWTTokenService _jwtTokenService;
        private readonly IResponseService _responseService;

        public AccountController(IResponseService responseService, IFileService fileService, IAccountService accountService, IEmailService emailService, IBlogService blogService, IJWTTokenService jwtTokenService)
        {
            _accountService = accountService;
            _emailService = emailService;
            _fileService = fileService;
            _jwtTokenService = jwtTokenService;
            _responseService = responseService;
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

            var message = new Message(new string[] { user.Email }, "Confirmation email link", confirmationLink, null);
            await _emailService.SendEmailAsync(message);                
            return Ok(_responseService.SuccessResponse("Registration successful"));
        }

        [HttpPut]
        [Route("Confirm")]
        public async Task<IActionResult> ConfirmEmail(TokenEmailDTO tokenEmail)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.FindByEmailAsync(tokenEmail.Email);
            if (user == null)
                return NotFound(_responseService.CustomErrorResponse("Not Found", "User not found"));
            if (user.EmailConfirmed)
                return BadRequest(_responseService.CustomErrorResponse("Email", "Email already confirmed"));
            var result = await _accountService.ConfirmEmailAsync(user, tokenEmail.Token);
            return result.Succeeded ? Ok(_responseService.SuccessResponse("Email Confirmed")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLogin userModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.FindByEmailAsync(userModel.Email);
            if (user != null && await _accountService.SignInAsync(user, userModel.Password))
                return Ok(_responseService.SuccessResponse(new { AccessToken = await _jwtTokenService.GenerateTokenAsync(user) }));
            return BadRequest(_responseService.CustomErrorResponse("Login Failed", "Invalid Email or Password"));
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
            var message = new Message(new string[] { user.Email }, "Reset password token", callback, null);
            await _emailService.SendEmailAsync(message);
            return Ok(_responseService.SuccessResponse("Password reset token sent in email."));
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

            var resetPassResult = await _accountService.ResetPasswordAsync(user, resetPasswordModel);
            return resetPassResult.Succeeded? Ok(_responseService.SuccessResponse("Password changed successfully.")) :BadRequest(_responseService.IdentityResultErrorResponse(resetPassResult));
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
                user.Avatar = filePath;
            }
            var result = await _accountService.UpdateAsync(user, userUpdate);
            return result.Succeeded ? Accepted(_responseService.SuccessResponse("User details updated successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> Delete()
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var result = await _accountService.DeleteAsync(user);
            return result.Succeeded ? Ok(_responseService.SuccessResponse("Account deleted successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            if (user==null)
                return NotFound(_responseService.CustomErrorResponse("Not found", "User not found."));
            return Ok(_responseService.SuccessResponse(user));
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
            var message = new Message(new string[] { user.Email }, "Confirmation email link", confirmationLink, null);
            await _emailService.SendEmailAsync(message);
            return Ok(_responseService.SuccessResponse("Confirmation email sent successfully."));
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
            if (emailModel.Email == user.Email || existingUser!= null)
                return BadRequest(_responseService.CustomErrorResponse("Email", "Please provide a different email"));

            var token = HttpUtility.UrlEncode(await _accountService.GenerateChangeEmailTokenAsync(user, emailModel.Email));
            // Get the client's origin URL
            var clientOrigin = Request.Headers["Origin"].ToString();

            // If the client origin is not present, fallback to the current request URL
            if (string.IsNullOrEmpty(clientOrigin))
                clientOrigin = $"{Request.Scheme}://{Request.Host}";

            // Construct the confirmation link with the client's origin URL
            var confirmationLink = $"{clientOrigin}/change-email?token={token}&email={user.Email}";

            var message = new Message(new string[] { emailModel.Email }, "Email change request", confirmationLink, null);
            //var result = await _accountService.SetEmailAsync(user, emailModel.Email);
            //if (!result.Succeeded)
            //    return BadRequest(_responseService.IdentityResultErrorResponse(result));

            await _emailService.SendEmailAsync(message);
            return Ok(_responseService.SuccessResponse("Check email for confirmation mail."));
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

            return Ok(_responseService.SuccessResponse("Your email has been updated successfully."));
        }

        [HttpPut("Password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePassword changePassword)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.GetUserByClaimsAsync(User);
            var resetPassResult = await _accountService.ChangePasswordAsync(user, changePassword);
            return resetPassResult.Succeeded ? Ok(_responseService.SuccessResponse("Your password has been updated successfully.")) : BadRequest(_responseService.IdentityResultErrorResponse(resetPassResult));
        }
    }
}