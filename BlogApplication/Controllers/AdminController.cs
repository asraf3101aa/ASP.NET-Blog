using Bislerium.Application.Common.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.AdminDTOs;
using Bislerium.Application.DTOs.Extensions;
using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator;
using System.Web;

namespace Bislerium.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IBlogService _blogService;
        private readonly IEmailService _emailService;
        private readonly IResponseService _responseService;
        public AdminController(IResponseService responseService, IAccountService accountService, IEmailService emailService, IBlogService blogService)
        {
            _accountService = accountService;
            _emailService = emailService;
            _responseService = responseService;
            _blogService = blogService;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register(AdminRegisterDTO adminRegister)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var existingUser = await _accountService.FindByEmailAsync(adminRegister.Email);
            if (existingUser != null)
                return BadRequest(_responseService.CustomErrorResponse("Email", "Email already registerd."));
            var userRegister = new UserRegisterDTO()
            {
                Email = adminRegister.Email,
                FirstName = adminRegister.FirstName,
                LastName = adminRegister.LastName,
                Password = new Password(includeLowercase: true, includeUppercase: true, includeNumeric: false, includeSpecial: false, passwordLength: 21).Next()

            };
            var (signUpResult, user) = await _accountService.SignUpAsync(userRegister);
            if (!signUpResult.Succeeded)
                return BadRequest(_responseService.IdentityResultErrorResponse(signUpResult));
            var roleAdd = await _accountService.AddToRoleAsync(user, "Admin");
            if (!roleAdd.Succeeded)
                return BadRequest(_responseService.IdentityResultErrorResponse(roleAdd));
          
            // Confirm the email for the admin user
            var confirmEmailResult = await _accountService.ConfirmEmailAsync(user, await _accountService.GenerateEmailConfirmationTokenAsync(user));
            var token = HttpUtility.UrlEncode(await _accountService.GeneratePasswordResetTokenAsync(user));

            // Get the client's origin URL
            var clientOrigin = Request.Headers["Origin"].ToString();

            // If the client origin is not present, fallback to the current request URL
            if (string.IsNullOrEmpty(clientOrigin))
                clientOrigin = $"{Request.Scheme}://{Request.Host}";

            // Construct the password reset link
            var resetLink = $"{clientOrigin}/reset-password?token={token}&email={user.Email}";

            // Send the password reset link to the admin user's email
            var message = new Message(new string[] { user.Email }, "Admin Invitation", resetLink, null);
            await _emailService.SendEmailAsync(message);
            return Ok(_responseService.SuccessResponse("Admin added successfully."));
        }
        
        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("Dashboard")]
        public IActionResult Dashboard([FromQuery] string ? duration, [FromQuery] int? month)
        {
            var queryableBlogs = _blogService.GetQueryableBlogs();

            var queryableBlogForStats = queryableBlogs;
            if (duration != null && duration.ToLower() == "monthly")
            {
                DateTime now = DateTime.Now;
                DateTime monthStart = new DateTime(now.Year, month ?? now.Month, 1);
                DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);
                queryableBlogForStats = queryableBlogForStats.Where(b => b.CreatedAt >= monthStart && b.CreatedAt <= monthEnd);
            }
            var blogCount = queryableBlogForStats.Count();
            var upvoteCount = queryableBlogForStats.SelectMany(b => b.Reactions.Where(r => r.Type == ReactionType.Upvote)).Count();
            var downvoteCount = queryableBlogForStats.SelectMany(b => b.Reactions.Where(r => r.Type == ReactionType.Downvote)).Count();
            var commentCount = queryableBlogForStats.SelectMany(b => b.Comments).Count();

            var blogStats = new BlogStatsDTO
            {
                BlogCount = blogCount,
                UpvoteCount = upvoteCount,
                DownvoteCount = downvoteCount,
                CommentCount = commentCount
            };

            var queryablePopularBlogs = _blogService.GetQueryablePopularBlogAsync();

            if (duration != null && duration.ToLower() == "monthly")
            {
                DateTime now = DateTime.Now;
                DateTime monthStart = new DateTime(now.Year, month ?? now.Month, 1);
                DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);
                queryablePopularBlogs = queryablePopularBlogs.Where(b => b.CreatedAt >= monthStart && b.CreatedAt <= monthEnd);
            }

            var popularBlogs = queryablePopularBlogs.Take(10).ToList();

            var queryableBlogForPopularBlogger = queryableBlogs.ToList();
            if (duration != null && duration.ToLower() == "monthly")
            {
                DateTime now = DateTime.Now;
                DateTime monthStart = new DateTime(now.Year, month ?? now.Month, 1);
                DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);
                queryableBlogForPopularBlogger = queryableBlogForPopularBlogger.Where(b => b.CreatedAt >= monthStart && b.CreatedAt <= monthEnd).ToList();
            }

            var queryablePopularBloggers = queryableBlogForPopularBlogger.ToList()
                .GroupBy(b => b.Author)
                .Select(g => new PopularBlogger
                {
                    FirstName = g.Key.FirstName,
                    LastName = g.Key.LastName,
                    Email = g.Key.Email,
                    TotalBlogs = g.Count(),
                    TotalUpvote = g.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Upvote)),
                    TotalDownvote = g.Sum(b => b.Reactions.Count(r => r.Type == ReactionType.Downvote)),
                    TotalComments = g.Sum(b => b.Comments.Count()),
                    TotalPopularityScore = g.Sum(b => _blogService.CalculatePopularity(b))
                })
                .OrderByDescending(b => b.TotalPopularityScore)
                .AsQueryable();

            var popularBlogger = queryablePopularBloggers.Take(10).ToList();
            return Ok(_responseService.SuccessResponse(
                new
                {
                    Duration = duration,
                    Month = month,
                    BlogStats = blogStats,
                    PopularBlogger = popularBlogger,
                    PopularBlogs = popularBlogs
                }));
        }
    }
}
