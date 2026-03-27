using Microsoft.AspNetCore.Http;

namespace Bislerium.Application.DTOs.BlogDTOs;

public class BlogDTO
{
    public string Title { get; set; }
    public string Body { get; set; }
    public int CategoryId { get; set; }
    public IFormFile? Banner { get; set; }
    public IFormFile? Other { get; set; }
}
