using MediatR;
using Bislerium.Domain.Entities;

namespace Bislerium.Application.Features.Blogs.Queries.GetCategories
{
    public record GetCategoriesQuery() : IRequest<IEnumerable<Category>>;
}
