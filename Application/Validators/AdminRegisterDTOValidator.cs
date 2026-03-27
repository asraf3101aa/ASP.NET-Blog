using Bislerium.Application.DTOs.AccountDTOs;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class AdminRegisterDTOValidator : AbstractValidator<AdminRegisterDTO>
{
    public AdminRegisterDTOValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");
    }
}
