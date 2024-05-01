namespace Bislerium.Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int BlogId { get; set; }
        public Blog Blog { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
