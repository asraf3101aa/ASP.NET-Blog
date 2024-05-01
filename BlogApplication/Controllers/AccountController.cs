using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.Extensions;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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


        [HttpPost("Register")]
        public async Task<IActionResult> Register(UserRegisterDTO userRegister)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _accountService.FindByEmailAsync(userRegister.Email) != null)
                return BadRequest(_responseService.CustomErrorResponse("Email", "Email is already registered."));

            var (signUpResult, user) = await _accountService.SignUpAsync(userRegister);
            if (!signUpResult.Succeeded)
                return BadRequest(_responseService.IdentityResultErrorResponse(signUpResult));
            
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

            var resultAddResult = await _accountService.AddToRoleAsync(user, "Blogger");
            return Ok(_responseService.SuccessResponse("Registration successful"));
        }

        [HttpPost]
        [Route("Email/Confirm")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _accountService.FindByEmailAsync(email);
            if (user == null)
                return BadRequest(_responseService.CustomErrorResponse("User", "User not found"));
            if (user.EmailConfirmed)
                return BadRequest(_responseService.CustomErrorResponse("User", "Email already confirmed"));
            var result = await _accountService.ConfirmEmailAsync(user, token);
            return result.Succeeded ? Ok() : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLogin userModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (result, user) = await _accountService.SignInAsync(userModel);
            return result.Succeeded ? Ok(_responseService.SuccessResponse(new AccessTokenDTO { AccessToken = await _jwtTokenService.GenerateTokenAsync(user) })) : BadRequest(_responseService.SignInResultErrorResponse(result));
        }

        [HttpPost("Logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _accountService.SignOutAsync();
            return Ok();
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
            return Ok();
        }

        [HttpPost]
        [Route("Password/Reset")]
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
        [Route("Update")]
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
                    
                userUpdate.Avatar = filePath;
            }
            var result = await _accountService.UpdateAsync(user, userUpdate);
            return result.Succeeded ? Ok() : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpDelete("Delete")]
        [Authorize]
        public async Task<IActionResult> Delete()
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var result = await _accountService.DeleteAsync(user);
            return result.Succeeded ? Ok() : BadRequest(_responseService.IdentityResultErrorResponse(result));
        }

        [HttpGet("Profile")]
        [Authorize]
        public async Task<IActionResult> Profile(int pageNumber = 1, int pageSize = 10)
        {
            var user = await _accountService.GetUserByClaimsAsync(User);
            var queryableBlogs = _blogService.GetQueryableAuthorBlogsAsync(user);

            // Using X.PagedList to paginate the queryable blogs
            var pagedBlogs = await queryableBlogs.ToPagedListAsync(pageNumber, pageSize);

            // Creating a response object that includes pagination metadata
            var response = new
            {
                User = user,
                Blogs = pagedBlogs, // The paged list of blogs
                PaginationMetaData = new
                {
                    TotalItems = pagedBlogs.TotalItemCount,
                    PageNumber = pagedBlogs.PageNumber,
                    PageSize = pagedBlogs.PageSize,
                    TotalPages = pagedBlogs.PageCount,
                    HasPreviousPage = pagedBlogs.HasPreviousPage,
                    HasNextPage = pagedBlogs.HasNextPage
                }
            };

            return Ok(_responseService.SuccessResponse(response));
        }

        [HttpPost]
        [Route("Email/Confirmation/Resend")]
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
        [Route("Email/Update")]
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
            var confirmationLink = $"{clientOrigin}/confirm-email?token={token}&email={user.Email}";

            var message = new Message(new string[] { emailModel.Email }, "Email change request", confirmationLink, null);
            var result = await _accountService.SetEmailAsync(user, emailModel.Email);
            if (!result.Succeeded)
                return BadRequest(_responseService.IdentityResultErrorResponse(result));

            await _emailService.SendEmailAsync(message);
            return Accepted();
        }

        [HttpPost("Password/Update")]
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