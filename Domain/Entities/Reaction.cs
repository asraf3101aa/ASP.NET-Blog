namespace Bislerium.Domain.Entities
{
    public enum ReactionType
    {
        Upvote,
        Downvote
    }
    public class Reaction
    {
        public int Id { get; set; }
        public ReactionType Type { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int? BlogId { get; set; }
        public Blog? Blog { get; set; }
        public int? CommentId { get; set; }
        public Comment? Comment { get; set; }
    }
}
