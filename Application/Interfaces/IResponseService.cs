using Bislerium.Application.DTOs.ResponseDTOs;
using Microsoft.AspNetCore.Identity;

namespace Bislerium.Application.Interfaces
{
    public interface IResponseService
    {
        ApiResponse<object> IdentityResultErrorResponse(IdentityResult result);
        ApiResponse<object> SignInResultErrorResponse(SignInResult result);
        ApiResponse<object> CustomErrorResponse(string title, string message);
        ApiResponse<IDictionary<string, string[]>> ValidationFailResponse(IDictionary<string, string[]> errors, string message = "Validation failed");
        ApiResponse<T> SuccessResponse<T>(T data, string message = "");
        ApiResponse<string> ExceptionResponse(Exception ex, bool isDevelopment);
    }
}
