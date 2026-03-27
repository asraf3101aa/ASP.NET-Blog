using MediatR;
using Bislerium.Application.DTOs.AdminDTOs;

namespace Bislerium.Application.Features.Blogs.Queries.GetDashboardStats
{
    public record GetDashboardStatsQuery(string? Duration, int? Month) : IRequest<AdminDashboardResponseDTO>;
}
