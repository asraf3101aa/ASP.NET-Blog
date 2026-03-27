namespace Bislerium.Application.DTOs.Email
{
    public class EmailQueueDto
    {
        public List<string> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public EmailQueueDto(IEnumerable<string> to, string subject, string content)
        {
            To = to.ToList();
            Subject = subject;
            Content = content;
        }
    }
}
