using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.Extensions;
using Bislerium.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using X.PagedList;


namespace Bislerium.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IBlogService _blogService;
        private readonly IEmailService _emailService;
        private readonly IFileService _fileService;
        private readonly IJWTTokenService _jwtTokenService;
        private readonly IResponseService _responseService;

        public AccountController(IResponseService responseService,IFileService fileService, IAccountService accountService, IEmailService emailService, IBlogService blogService, IJWTTokenService jwtTokenService)
        {
            _accountService = accountService;
            _emailService = emailService;
            _fileService = fileService;
            _blogService = blogService;
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

            var token = await _accountService.GenerateEmailConfirmationTokenAsync(user);

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

        [HttpGet]
        [Route("Confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token, [FromQuery] string email)
        {
            var user = await _accountService.FindByEmailAsync(email);
            if (user == null)
                return BadRequest(_responseService.CustomErrorResponse("User", "User not found"));
            if (user.EmailConfirmed)
                return BadRequest(_responseService.CustomErrorResponse("User", "Email already confirmed"));
            var result = await _accountService.ConfirmEmailAsync(user, token);
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
        public async Task<IActionResult> ForgotPassword(EmailModel forgotPasswordModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _accountService.FindByEmailAsync(forgotPasswordModel.Email);
            if (user == null)
                return BadRequest(_responseService.CustomErrorResponse("User", "User with this email not found."));

            var token = await _accountService.GeneratePasswordResetTokenAsync(user);
            var callback = Url.Action(nameof(ResetPassword), "Account", new { token, email = user.Email }, Request.Scheme);

            var message = new Message(new string[] { user.Email }, "Reset password token", callback, null);
            await _emailService.SendEmailAsync(message);
            return Ok(_responseService.SuccessResponse("Password reset token sent in email."));
        }

        [HttpPost]
        [Route("Password/Confirm")]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPasswordModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _accountService.FindByEmailAsync(resetPasswordModel.Email);
            if (user == null)
                return BadRequest(_responseService.CustomErrorResponse("User", "User with this email not found."));

            var resetPassResult = await _accountService.ResetPasswordAsync(user, resetPasswordModel);
            return resetPassResult.Succeeded? Ok():BadRequest(_responseService.IdentityResultErrorResponse(resetPassResult));
        }

        [HttpPut]
        [Authorize]
        [RequireConfirmedEmail]
        public async Task<IActionResult> Update(UserUpdate userUpdate)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.GetUserByClaimsAsync(User);
            if (userUpdate.Image != null)
            {
                var (filePath, error) = _fileService.UploadFile(userUpdate.Image);
                if (error != string.Empty)
                    return BadRequest(_responseService.CustomErrorResponse(nameof(userUpdate.Image), error));  
                user.Avatar = filePath;
            }
            var result = await _accountService.UpdateAsync(user, userUpdate);
            return result.Succeeded ? Ok() : BadRequest(_responseService.IdentityResultErrorResponse(result));
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
        [Route("EmailConfirm")]
        [Authorize]
        public async Task<IActionResult> ResendEmailConfirmation()
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var token = await _accountService.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { token, email = user.Email }, Request.Scheme);
            var message = new Message(new string[] { user.Email }, "Confirmation email link", confirmationLink, null);
            await _emailService.SendEmailAsync(message);
            return Ok();
        }
   
        [HttpPut]
        [Route("Email")]
        [Authorize]
        public async Task<IActionResult> UpdateEmail(EmailModel emailModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.GetUserByClaimsAsync(User);
            var existingUser = _accountService.FindByEmailAsync(emailModel.Email);
            if (emailModel.Email == user.Email || existingUser!= null)
                return BadRequest(_responseService.CustomErrorResponse("Email", "Please provide a different email"));

            var token = await _accountService.GenerateChangeEmailTokenAsync(user, emailModel.Email);
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
            return Ok();
        }

        [HttpPost]
        [Route("Email/Confirm")]
        public async Task<IActionResult> ConfirmEmailChange([FromQuery] string token,[FromQuery] string newEmail)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);

            // Confirm the email change token
            var result = await _accountService.ChangeEmailAsync(user, newEmail, token);

            if (!result.Succeeded)
                return BadRequest(_responseService.IdentityResultErrorResponse(result));

            return Ok("Your email has been updated successfully.");
        }

        [HttpPut("Password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePassword changePassword)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _accountService.GetUserByClaimsAsync(User);
            var resetPassResult = await _accountService.ChangePasswordAsync(user, changePassword);
            return resetPassResult.Succeeded ? Ok() : BadRequest(_responseService.IdentityResultErrorResponse(resetPassResult));
        }
    }
}