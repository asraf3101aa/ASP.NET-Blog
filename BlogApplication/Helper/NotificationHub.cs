using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bislerium.Presentation.Helper
{
    public class NotificationHub : Hub
    {
        private static readonly Dictionary<string, HashSet<string>> UserConnections = new Dictionary<string, HashSet<string>>();

        public override Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                lock (UserConnections)
                {
                    if (!UserConnections.TryGetValue(userId, out var connections))
                    {
                        connections = new HashSet<string>();
                        UserConnections[userId] = connections;
                    }

                    connections.Add(Context.ConnectionId);
                }
            }

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                lock (UserConnections)
                {
                    if (UserConnections.TryGetValue(userId, out var connections))
                    {
                        connections.Remove(Context.ConnectionId);

                        if (connections.Count == 0)
                        {
                            UserConnections.Remove(userId);
                        }
                    }
                }
            }

            return base.OnDisconnectedAsync(exception);
        }
    }
}
