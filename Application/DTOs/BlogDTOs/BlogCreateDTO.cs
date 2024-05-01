using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class BlogCreateDTO
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        public int CategoryId { get; set; }
        public ICollection<BlogImagesDTO> Images { get; set; }
    }
}
