using Microsoft.AspNetCore.Http;
using MimeKit;

namespace Bislerium.Application.DTOs.Extensions
{
    public class MailSettings
    {
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class Message
    {
        public List<MailboxAddress> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public IFormFileCollection Attachments { get; set; }

        public Message(IEnumerable<string> to, string subject, string ? content, IFormFileCollection attachments)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(null, x)));
            Subject = subject;
            Content = content;
            Attachments = attachments;
        }
    }
}
