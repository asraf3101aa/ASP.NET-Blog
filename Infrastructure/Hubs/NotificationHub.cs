using Microsoft.AspNetCore.SignalR;

namespace Bislerium.Infrastructure.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(string userId, object notificationData)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", notificationData);
        }
    }
}
