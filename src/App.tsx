import Router from "@/routes/Router";
import Provider from "@/providers/Provider";
import { BrowserRouter } from "react-router-dom";
import SignalRService from "@/contexts/NotificationsContext";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    SignalRService.startConnection(handleNotification);
    return () => {
      SignalRService.stopConnection();
    };
  }, []);
  const handleNotification = (title: string, body: string) => {
    // Handle the received notification
    console.log(`Notification received: ${title} - ${body}`);
    // You can show a notification UI, play a sound, or perform any desired action
  };

  return (
    <BrowserRouter>
      <Provider>
        <Router />
      </Provider>
    </BrowserRouter>
  );
};

export default App;
