using Bislerium.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class BlogImagesDTO
    {
        public BlogImageType ImageType { get; set; }
        public IFormFile File { get; set; }
    }
}
