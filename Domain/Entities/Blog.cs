using Microsoft.AspNetCore.Http;

namespace Bislerium.Domain.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public enum BlogImageType
    {
        Banner,
        Body
    }
    public class BlogImage
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public Blog Blog { get; set; }

        private string? _path;
        public string Path
        {
            get
            {
                if (string.IsNullOrEmpty(_path))
                    return null;
                var httpContextAccessor = new HttpContextAccessor();
                var request = httpContextAccessor.HttpContext?.Request;
                var baseUrl = $"{request?.Scheme}://{request?.Host.Value}";

                return $"{baseUrl}/{_path}";
            }
            set => _path = value;
        }
        public BlogImageType ImageType { get; set; }
    }
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string AuthorId { get; set; }
        public User Author { get; set; }
        public ICollection<BlogImage> Images { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
