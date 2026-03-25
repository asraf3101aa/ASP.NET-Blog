using System.Text;
using System.Text.Json;
using Bislerium.Application.Interfaces;
using Bislerium.Application.DTOs.Email;
using Bislerium.Infrastructure.Common;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Bislerium.Infrastructure.Communication.Email
{
    public class EmailBackgroundWorker : BackgroundService
    {
        private readonly RabbitMQSettings _settings;
        private readonly IServiceProvider _serviceProvider;
        private IConnection? _connection;
        private IChannel? _channel;

        public EmailBackgroundWorker(IOptions<RabbitMQSettings> settings, IServiceProvider serviceProvider)
        {
            _settings = settings.Value;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var factory = new ConnectionFactory()
            {
                HostName = _settings.HostName,
                UserName = _settings.UserName,
                Password = _settings.Password
            };

            _connection = await factory.CreateConnectionAsync(stoppingToken);
            _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

            await _channel.QueueDeclareAsync(queue: _settings.QueueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null,
                                 cancellationToken: stoppingToken);

            var consumer = new AsyncEventingBasicConsumer(_channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var emailDto = JsonSerializer.Deserialize<EmailQueueDto>(message);

                if (emailDto != null)
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                        var emailMessage = new EmailMessage(emailDto.To, emailDto.Subject, emailDto.Content, null);
                        await emailService.SendEmailAsync(emailMessage);
                    }
                }

                await _channel.BasicAckAsync(deliveryTag: ea.DeliveryTag, multiple: false, cancellationToken: stoppingToken);
            };

            await _channel.BasicConsumeAsync(queue: _settings.QueueName,
                                 autoAck: false,
                                 consumer: consumer,
                                 cancellationToken: stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            if (_channel != null)
            {
                await _channel.CloseAsync(cancellationToken: cancellationToken);
            }
            if (_connection != null)
            {
                await _connection.CloseAsync(cancellationToken: cancellationToken);
            }
            await base.StopAsync(cancellationToken);
        }
    }
}
