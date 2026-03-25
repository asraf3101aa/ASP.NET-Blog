using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.AccountDTOs;
using Bislerium.Application.DTOs.Email;
using Bislerium.Application.Features.Blogs.Queries.GetDashboardStats;
using Bislerium.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordGenerator;
using System.Web;

namespace Bislerium.Presentation.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AdminController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly IRabbitMQBus _rabbitMQBus;
    private readonly IResponseService _responseService;
    private readonly IMediator _mediator;

    public AdminController(IResponseService responseService, IAccountService accountService, IRabbitMQBus rabbitMQBus, IMediator mediator)
    {
        _accountService = accountService;
        _rabbitMQBus = rabbitMQBus;
        _responseService = responseService;
        _mediator = mediator;
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
        var messageDto = new EmailQueueDto(new string[] { user.Email }, "Admin Invitation", resetLink);
        await _rabbitMQBus.PublishEmailAsync(messageDto);
        return Ok(_responseService.SuccessResponse<object>(null, "Admin added successfully."));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("Dashboard")]
    public async Task<IActionResult> Dashboard([FromQuery] string? duration, [FromQuery] int? month)
    {
        var dashboardData = await _mediator.Send(new GetDashboardStatsQuery(duration, month));
        return Ok(_responseService.SuccessResponse(dashboardData));
    }
}
