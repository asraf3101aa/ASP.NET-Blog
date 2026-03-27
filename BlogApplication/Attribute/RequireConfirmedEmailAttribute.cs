using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using Bislerium.Domain.Entities;
using Bislerium.Application.Interfaces;

public class RequireConfirmedEmailAttribute : TypeFilterAttribute
{
    public RequireConfirmedEmailAttribute() : base(typeof(RequireConfirmedEmailFilter))
    {
    }
}

public class RequireConfirmedEmailFilter : IAsyncAuthorizationFilter
{
    private readonly UserManager<User> _userManager;
    private readonly IResponseService _responseService;

    public RequireConfirmedEmailFilter(UserManager<User> userManager, IResponseService responseService)
    {
        _userManager = userManager;
        _responseService = responseService;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = await _userManager.GetUserAsync(context.HttpContext.User);
        if (user != null && !user.EmailConfirmed)
        {
            var errorResponse = _responseService.CustomErrorResponse("Email Confirmation Required", "Your email address has not been confirmed.");
            context.Result = new BadRequestObjectResult(errorResponse);
        }
    }
}
