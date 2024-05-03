using Microsoft.AspNetCore.SignalR;

namespace Bislerium.Infrastructure.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
