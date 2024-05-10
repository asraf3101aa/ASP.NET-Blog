import * as signalR from "@microsoft/signalr";
import { ILocalStorage } from "@/storage/ILocalStorage";
import { INotificationsRepository } from "@/@types/repository";

export class NotificationsRepository implements INotificationsRepository {
  private _localStorage: ILocalStorage;
  private _notificationBaseURL: string;
  private hubConnection: signalR.HubConnection | null = null;
  constructor(notificationBaseURL: string, localStorageClient: ILocalStorage) {
    this._localStorage = localStorageClient;
    this._notificationBaseURL = notificationBaseURL;
  }
  public startConnection = (
    notificationReceived: (title: string, body: string) => void
  ) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this._notificationBaseURL, {
        accessTokenFactory: () => this._localStorage.getAccessToken() ?? "",
      })
      .build();

    this.hubConnection.on(
      "notification",
      ({ title, body }: { title: string; body: string }) => {
        notificationReceived(title, body);
      }
    );

    this.hubConnection
      .start()
      .then(() => console.log("SignalR connection started"))
      .catch((error) => console.log(error));
  };
  public stopConnection = () => {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  };
}
