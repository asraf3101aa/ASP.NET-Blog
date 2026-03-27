using Bislerium.Application.DTOs.Email;

namespace Bislerium.Application.Interfaces
{
    public interface IRabbitMQBus
    {
        Task PublishEmailAsync(EmailQueueDto message);
    }
}
