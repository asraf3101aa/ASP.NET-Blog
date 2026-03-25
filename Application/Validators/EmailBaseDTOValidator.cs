using Bislerium.Application.DTOs.Email;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class EmailBaseDTOValidator : AbstractValidator<EmailBaseDTO>
{
    public EmailBaseDTOValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");
    }
}
