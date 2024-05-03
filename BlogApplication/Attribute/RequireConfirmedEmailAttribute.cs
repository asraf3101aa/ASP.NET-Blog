using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using Bislerium.Domain.Entities;

public class RequireConfirmedEmailAttribute : TypeFilterAttribute
{
    public RequireConfirmedEmailAttribute() : base(typeof(RequireConfirmedEmailFilter))
    {
    }
}

public class RequireConfirmedEmailFilter : IAsyncAuthorizationFilter
{
    private readonly UserManager<User> _userManager;

    public RequireConfirmedEmailFilter(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = await _userManager.GetUserAsync(context.HttpContext.User);
        if (user != null && !user.EmailConfirmed)
        {
            var errorResponse = new ErrorResponse
            {
                Errors = new List<ErrorResponse.ErrorDetail>
                {
                    new ErrorResponse.ErrorDetail
                    {
                        Title = "Email Confirmation Required",
                        Message = "Your email address has not been confirmed."
                    }
                }
            };
            context.Result = new BadRequestObjectResult(errorResponse);
        }
    }
}
