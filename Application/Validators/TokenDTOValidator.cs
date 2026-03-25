using Bislerium.Application.DTOs.AccountDTOs;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class TokenDTOValidator : AbstractValidator<TokenDTO>
{
    public TokenDTOValidator()
    {
        RuleFor(x => x.AccessToken)
            .NotEmpty().WithMessage("Access token is required.");

        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage("Refresh token is required.");
    }
}
