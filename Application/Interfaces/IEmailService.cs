using Bislerium.Application.DTOs.Email;

namespace Bislerium.Application.Interfaces
{
    public interface IEmailService
    {
        public void SendEmail(EmailMessage message);
        public Task SendEmailAsync(EmailMessage message);
    }
}
