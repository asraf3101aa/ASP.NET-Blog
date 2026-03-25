using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.ResponseDTOs;
using Microsoft.AspNetCore.Identity;

namespace Bislerium.Infrastructure.Services;

public class ResponseService : IResponseService
{
    public ApiResponse<object> IdentityResultErrorResponse(IdentityResult result)
    {
        var errors = result.Errors.GroupBy(e => e.Code)
            .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

        return ApiResponse<object>.Fail(errors, "Identity operations failed");
    }

    public ApiResponse<object> SignInResultErrorResponse(SignInResult result)
    {
        var errors = new Dictionary<string, string[]>
        {
            { "Auth", new[] { "Invalid credentials." } }
        };
        return ApiResponse<object>.Fail(errors, "Authentication failed");
    }

    public ApiResponse<T> SuccessResponse<T>(T data, string message = "")
    {
        return ApiResponse<T>.Success(data, message);
    }

    public ApiResponse<object> CustomErrorResponse(string title, string message)
    {
        var errors = new Dictionary<string, string[]>
        {
            { title, new[] { message } }
        };
        return ApiResponse<object>.Fail(errors, message);
    }

    public ApiResponse<IDictionary<string, string[]>> ValidationFailResponse(IDictionary<string, string[]> errors, string message = "Validation failed")
    {
        return ApiResponse<IDictionary<string, string[]>>.Fail(errors, message);
    }

    public ApiResponse<string> ExceptionResponse(Exception ex, bool isDevelopment)
    {
        string errorDetail = isDevelopment ? ex.ToString() : "An internal server error occurred.";
        return ApiResponse<string>.ErrorResponse(errorDetail, ex.Message);
    }
}
