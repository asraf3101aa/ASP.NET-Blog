using Bislerium.Application.Common.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Bislerium.Infrastructure.Services
{
    public class ResponseService : IResponseService
    {
        public ErrorResponse IdentityResultErrorResponse(IdentityResult result)
        {
            var errorResponse = new ErrorResponse();
            foreach (var error in result.Errors)
            {
                errorResponse.Errors.Add(new ErrorResponse.ErrorDetail
                {
                    Title = error.Code,
                    Message = error.Description
                });
            }

            return errorResponse;
        }

        public ErrorResponse SignInResultErrorResponse(SignInResult result)
        {
            var errorResponse = new ErrorResponse();
            errorResponse.Errors.Add(new ErrorResponse.ErrorDetail
            {
                Title = "Authentication Failed",
                Message = "Invalid credentials."
            });
            return errorResponse;
        }

        public SuccessResponse<T> SuccessResponse<T>(T data)
        {
            return new SuccessResponse<T>(data);
        }

        public ErrorResponse CustomErrorResponse(string title, string message)
        {
            var errorResponse = new ErrorResponse();
            errorResponse.Errors.Add(new ErrorResponse.ErrorDetail
            {
                Title = title,
                Message = message
            });
            return errorResponse;
        }
    }
}
