using Bislerium.Application.DTOs.Email;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IEmailService
    {
        public void SendEmail(EmailMessage message);
        public Task SendEmailAsync(EmailMessage message);
    }
}
