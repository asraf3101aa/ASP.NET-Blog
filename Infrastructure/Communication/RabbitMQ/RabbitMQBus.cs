using System.Text;
using System.Text.Json;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.Email;
using Bislerium.Infrastructure.Common;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Bislerium.Infrastructure.Communication.RabbitMQ
{
    public class RabbitMQBus : IRabbitMQBus
    {
        private readonly RabbitMQSettings _settings;

        public RabbitMQBus(IOptions<RabbitMQSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task PublishEmailAsync(EmailQueueDto message)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _settings.HostName,
                UserName = _settings.UserName,
                Password = _settings.Password
            };

            using var connection = await factory.CreateConnectionAsync();
            using var channel = await connection.CreateChannelAsync();

            await channel.QueueDeclareAsync(queue: _settings.QueueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

            var json = JsonSerializer.Serialize(message);
            var body = Encoding.UTF8.GetBytes(json);

            var properties = new BasicProperties
            {
                Persistent = true
            };

            await channel.BasicPublishAsync(exchange: string.Empty,
                                 routingKey: _settings.QueueName,
                                 mandatory: false,
                                 basicProperties: properties,
                                 body: body);
        }
    }
}
