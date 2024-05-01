using Bislerium.Application.DTOs.Extensions;

namespace Bislerium.Application.Common.Interfaces
{
    public interface IEmailService
    {
        public void SendEmail(Message message);
        public Task SendEmailAsync(Message message);
    }
}
