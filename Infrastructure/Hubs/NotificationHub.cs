using Microsoft.AspNetCore.SignalR;

namespace Bislerium.Infrastructure.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotification(string title, string body)
        {
            await Clients.User(Context.UserIdentifier).SendAsync("ReceiveNotification", title, body);
        }
    }
}
