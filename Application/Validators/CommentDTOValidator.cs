using Bislerium.Application.DTOs.BlogDTOs;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class CommentDTOValidator : AbstractValidator<CommentDTO>
{
    public CommentDTOValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty().WithMessage("Comment text is required.")
            .MaximumLength(1000).WithMessage("Comment must not exceed 1000 characters.");
    }
}
