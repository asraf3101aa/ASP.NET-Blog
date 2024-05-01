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
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<User> _userManager;

    public RequireConfirmedEmailFilter(IHttpContextAccessor httpContextAccessor, UserManager<User> userManager)
    {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext.User);
        if (user != null && !user.EmailConfirmed)
        {
            context.Result = new ForbidResult();
        }
    }
}