using Bislerium.Application.DTOs.BlogDTOs;
using FluentValidation;

namespace Bislerium.Application.Validators;

public class BlogDTOValidator : AbstractValidator<BlogDTO>
{
    public BlogDTOValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Body is required.");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).WithMessage("Category is required.");
    }
}
