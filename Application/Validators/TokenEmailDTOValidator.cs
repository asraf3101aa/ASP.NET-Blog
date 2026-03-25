using Bislerium.Application.DTOs.AccountDTOs;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class TokenEmailDTOValidator : AbstractValidator<TokenEmailDTO>
{
    public TokenEmailDTOValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required.");
    }
}
