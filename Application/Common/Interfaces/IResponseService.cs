using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IResponseService
    {
        public ErrorResponse IdentityResultErrorResponse(IdentityResult result);
        public ErrorResponse SignInResultErrorResponse(SignInResult result);
        public ErrorResponse CustomErrorResponse(string title, string message);
        public SuccessResponse<T> SuccessResponse<T>(T data);

    }
}
