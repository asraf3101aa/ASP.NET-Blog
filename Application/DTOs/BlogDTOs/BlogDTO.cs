using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class BlogDTO
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        public int CategoryId { get; set; }
        public IFormFile Banner { get; set; }
        public IFormFile Other {  get; set; }
    }
}
