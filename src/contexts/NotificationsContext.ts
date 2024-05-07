import * as signalR from "@microsoft/signalr";

const NOTIFICATION_BASE_URL = import.meta.env.VITE_NOTIFICATION_BASE_URL;
class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  public startConnection = (
    notificationReceived: (title: string, body: string) => void
  ) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${NOTIFICATION_BASE_URL}/notificationHub`)
      .build();

    this.hubConnection.on("ReceiveNotification", (body: string) => {
      console.log(body);
      notificationReceived("title", body);
    });

    this.hubConnection
      .start()
      .then(() => console.log("SignalR connection started"))
      .catch((err) =>
        console.log("Error while starting SignalR connection: " + err)
      );
  };
  public stopConnection = () => {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  };
}
export default new SignalRService();
