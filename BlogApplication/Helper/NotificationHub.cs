using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Bislerium.Presentation.Helper
{
    [Authorize]
    public class NotificationHub : Hub { }
}
