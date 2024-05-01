using System.ComponentModel.DataAnnotations;

namespace Bislerium.Application.DTOs.BlogDTOs
{
    public class CommentDTO
    {
        [Required]
        public string Text { get; set; }

    }
}
